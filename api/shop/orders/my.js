const { supabase } = require('../../../lib/supabase');
const { customerAuth } = require('../../../middleware/customerAuth');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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

module.exports = customerAuth(handler);
