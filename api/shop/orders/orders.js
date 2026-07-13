const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { razorpay } = require('../../../lib/razorpay');
const { customerAuth } = require('../../../middleware/customerAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

// ==========================================
// CONFIG & SCHEMA FROM create.js
// ==========================================
const schema = z.object({
  address_id: z.number().int(),
  items: z.array(z.object({
    product_id: z.number().int(),
    quantity: z.number().int().positive(),
  })).min(1),
  coupon_code: z.string().optional(),
});

async function getSetting(key, fallback) {
  const { data } = await supabase.from('settings').select('value').eq('key', key).maybeSingle();
  return data ? Number(data.value) : fallback;
}

// ==========================================
// 1. LOGIC FROM create.js (POST)
// ==========================================
async function handleCreateOrder(req, res) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { address_id, items, coupon_code } = parsed.data;

  // Re-validate stock & pricing server-side
  const ids = items.map(i => i.product_id);
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, sale_price, stock, is_active')
    .in('id', ids);

  for (const item of items) {
    const product = products.find(p => p.id === item.product_id);
    if (!product || !product.is_active) {
      return res.status(409).json({ error: `Product ${item.product_id} unavailable` });
    }
    if (product.stock < item.quantity) {
      return res.status(409).json({ error: `Insufficient stock for ${product.name}` });
    }
  }

  const lineItems = items.map(item => {
    const product = products.find(p => p.id === item.product_id);
    const unit_price = Number(product.sale_price || product.price);
    return { product_id: product.id, product_name: product.name, quantity: item.quantity, unit_price };
  });

  const subtotal = lineItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  // Apply coupon if provided
  let discount = 0;
  if (coupon_code) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', coupon_code)
      .eq('is_active', true)
      .maybeSingle();

    if (!coupon) return res.status(400).json({ error: 'Invalid coupon code' });
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    if (subtotal < coupon.min_order) {
      return res.status(400).json({ error: `Minimum order of ₹${coupon.min_order} required for this coupon` });
    }
    discount = coupon.type === 'percent'
      ? (subtotal * coupon.discount_value) / 100
      : coupon.discount_value;
  }

  // Shipping + tax from settings
  const freeShippingThreshold = await getSetting('free_shipping_threshold', 499);
  const shippingCostSetting = await getSetting('shipping_cost', 49);
  const taxPercent = await getSetting('tax_percent', 0);

  const afterDiscount = subtotal - discount;
  const shipping_cost = afterDiscount >= freeShippingThreshold ? 0 : shippingCostSetting;
  const tax = (afterDiscount * taxPercent) / 100;
  const total = Math.round((afterDiscount + shipping_cost + tax) * 100) / 100;

  // Create order row (PENDING)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: req.customer.id,
      address_id,
      status: 'PENDING',
      payment_status: 'INITIATED',
      subtotal,
      discount,
      shipping_cost,
      tax,
      total,
      coupon_code: coupon_code || null,
    })
    .select()
    .single();

  if (orderError) {
    console.error(orderError);
    return res.status(500).json({ error: 'Could not create order' });
  }

  // Insert order items
  const itemsPayload = lineItems.map(i => ({ ...i, order_id: order.id }));
  const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
  if (itemsError) {
    console.error(itemsError);
    return res.status(500).json({ error: 'Could not save order items' });
  }

  // Create Razorpay order (amount in paise)
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: 'INR',
    receipt: `order_${order.id}`,
  });

  await supabase.from('orders').update({ razorpay_order_id: razorpayOrder.id }).eq('id', order.id);

  return res.status(201).json({
    order_id: order.id,
    razorpay_order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key_id: process.env.RAZORPAY_KEY_ID,
  });
}

// ==========================================
// 2. LOGIC FROM my.js (GET)
// ==========================================
async function handleGetMyOrders(req, res) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, status, payment_status, subtotal, discount, shipping_cost, tax, total, tracking_number, created_at, order_items(product_name, quantity, unit_price)')
    .eq('customer_id', req.customer.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not load orders' });
  }

  return res.status(200).json({ orders });
}

// ==========================================
// MAIN ROUTER GATEWAY
// ==========================================
async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method === 'POST') {
    return await handleCreateOrder(req, res);
  }
  
  if (req.method === 'GET') {
    return await handleGetMyOrders(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = customerAuth(handler);
