const { supabase } = require('../../../lib/supabase');
const { adminAuth } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { status } = req.query;

  let query = supabase
    .from('orders')
    .select('id, customer_id, status, payment_status, total, tracking_number, created_at, customers(name, email)')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not load orders' });
  }

  return res.status(200).json({ orders: data });
}

module.exports = adminAuth(handler);
