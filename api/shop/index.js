const { z } = require('zod');
const { supabase } = require('../../lib/supabase');
const { verifyPaymentSignature } = require('../../lib/razorpay');
const { customerAuth } = require('../../middleware/customerAuth');
const { sendOrderConfirmationToCustomer, sendNewOrderAlertToAdmin } = require('../../lib/mailer');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../lib/http');

// ==========================================
// SCHEMAS FROM EACH ENDPOINT
// ==========================================
const addressSchema = z.object({
  label: z.string().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(4).max(10),
  phone: z.string().min(10).max(15),
  is_default: z.boolean().optional(),
});

const cartSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int(),
    quantity: z.number().int().positive(),
  })).min(1),
});

const couponSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
});

const paymentSchema = z.object({
  order_id: z.number().int(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// ==========================================
// 1. UTILITY: CREATE ADDRESS (Requires Auth)
// ==========================================
async function handleCreateAddress(req, res) {
  const parsed = addressSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const { data: address, error } = await supabase
    .from('addresses')
    .insert({ ...parsed.data, customer_id: req.customer.id })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not save address' });
  }
  return res.status(201).json({ address });
}

// ==========================================
// 2. UTILITY: VALIDATE CART (Public)
// ==========================================
async function handleValidateCart(req, res) {
  const parsed = cartSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { items } = parsed.data;

  const ids = items.map(i => i.product_id);
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, sale_price, stock, is_active')
    .in('id', ids);

  if (error) return res.status(500).json({ error: 'Could not validate cart' });

  const issues = [];
  const validated = [];

  for (const item of items) {
    const product = products.find(p => p.id === item.product_id);
    if (!product || !product.is_active) {
      issues.push({ product_id: item.product_id, issue: 'Product unavailable' });
      continue;
    }
    if (product.stock < item.quantity) {
      issues.push({ product_id: item.product_id, issue: `Only ${product.stock} left in stock` });
      continue;
    }
    validated.push({
      product_id: product.id,
      name: product.name,
      unit_price: product.sale_price || product.price,
      quantity: item.quantity,
    });
  }

  if (issues.length > 0) return res.status(409).json({ valid: false, issues });
  return res.status(200).json({ valid: true, items: validated });
}

// ==========================================
// 3. UTILITY: APPLY COUPON (Public)
// ==========================================
async function handleApplyCoupon(req, res) {
  const parsed = couponSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { code, subtotal } = parsed.data;

  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (!coupon) return res.status(404).json({ valid: false, error: 'Invalid coupon code' });
  if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
    return res.status(400).json({ valid: false, error: 'Coupon has expired' });
  }
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return res.status(400).json({ valid: false, error: 'Coupon usage limit reached' });
  }
  if (subtotal < coupon.min_order) {
    return res.status(400).json({ valid: false, error: `Minimum order of ₹${coupon.min_order} required` });
  }

  const discount = coupon.type === 'percent' ? (subtotal * coupon.discount_value) / 100 : coupon.discount_value;
  return res.status(200).json({ valid: true, discount: Math.round(discount * 100) / 100 });
}

// ==========================================
// 4. UTILITY: VERIFY PAYMENT (Requires Auth)
// ==========================================
async function handleVerifyPayment(req, res) {
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const isValid = verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
  if (!isValid) {
    await supabase.from('orders').update({ payment_status: 'FAILED' }).eq('id', order_id);
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .eq('customer_id', req.customer.id)
    .eq('razorpay_order_id', razorpay_order_id)
    .maybeSingle();

  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.payment_status === 'PAID') {
    return res.status(200).json({ ok: true, message: 'Already confirmed' });
  }

  await supabase
    .from('orders')
    .update({ status: 'PAID', payment_status: 'PAID', payment_id: razorpay_payment_id })
    .eq('id', order_id);

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order_id);
  for (const item of items) {
    await supabase.rpc('decrement_stock', { p_product_id: item.product_id, p_qty: item.quantity })
      .catch(async () => {
        const { data: product } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
        await supabase.from('products').update({ stock: Math.max(0, product.stock - item.quantity) }).eq('id', item.product_id);
      });
  }

  if (order.coupon_code) {
    await supabase.rpc('increment_coupon_usage', { p_code: order.coupon_code }).catch(() => {});
  }

  try {
    await sendOrderConfirmationToCustomer(order, req.customer.email, items);
    await sendNewOrderAlertToAdmin(order, req.customer.email, items);
  } catch (err) {
    console.error('Email send failed:', err);
  }

  return res.status(200).json({ ok: true, order_id: order.id });
}

// ==========================================
// MAIN MULTI-ROUTE DISPATCHER
// ==========================================
module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = req.url || '';

  // Forwarding destination checks
  if (url.endsWith('/addresses/create')) {
    return customerAuth(handleCreateAddress)(req, res);
  }
  if (url.endsWith('/cart/validate')) {
    return await handleValidateCart(req, res);
  }
  if (url.endsWith('/coupons/apply')) {
    return await handleApplyCoupon(req, res);
  }
  if (url.endsWith('/payment/verify')) {
    return customerAuth(handleVerifyPayment)(req, res);
  }

  return res.status(404).json({ error: 'Sub-endpoint path not found' });
};