const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { verifyPaymentSignature } = require('../../../lib/razorpay');
const { customerAuth } = require('../../../middleware/customerAuth');
const { sendOrderConfirmationToCustomer, sendNewOrderAlertToAdmin } = require('../../../lib/mailer');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const schema = z.object({
  order_id: z.number().int(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  // 1. Verify signature — this is the step that stops a faked/fabricated "payment"
  const isValid = verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
  if (!isValid) {
    await supabase.from('orders').update({ payment_status: 'FAILED' }).eq('id', order_id);
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  // 2. Confirm order belongs to this customer and matches the razorpay order
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .eq('customer_id', req.customer.id)
    .eq('razorpay_order_id', razorpay_order_id)
    .maybeSingle();

  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.payment_status === 'PAID') {
    return res.status(200).json({ ok: true, message: 'Already confirmed' }); // idempotent
  }

  // 3. Mark order paid
  await supabase
    .from('orders')
    .update({ status: 'PAID', payment_status: 'PAID', payment_id: razorpay_payment_id })
    .eq('id', order_id);

  // 4. Decrement stock
  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order_id);
  for (const item of items) {
    await supabase.rpc('decrement_stock', { p_product_id: item.product_id, p_qty: item.quantity })
      .catch(async () => {
        // fallback if the RPC function doesn't exist yet — direct update
        const { data: product } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
        await supabase.from('products').update({ stock: Math.max(0, product.stock - item.quantity) }).eq('id', item.product_id);
      });
  }

  // 5. Bump coupon usage
  if (order.coupon_code) {
    await supabase.rpc('increment_coupon_usage', { p_code: order.coupon_code }).catch(() => {});
  }

  // 6. Send emails (best-effort — don't fail the request if email fails)
  try {
    await sendOrderConfirmationToCustomer(order, req.customer.email, items);
    await sendNewOrderAlertToAdmin(order, req.customer.email, items);
  } catch (err) {
    console.error('Email send failed:', err);
  }

  return res.status(200).json({ ok: true, order_id: order.id });
}

module.exports = customerAuth(handler);
