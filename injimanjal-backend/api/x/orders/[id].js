const { supabase } = require('../../../lib/supabase');
const { adminAuth } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, customers(name, email, phone), addresses(line1, line2, city, state, pincode, phone), order_items(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Could not load order' });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  return res.status(200).json({ order });
}

module.exports = adminAuth(handler);
