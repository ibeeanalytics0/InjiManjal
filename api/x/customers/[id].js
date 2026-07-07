const { supabase } = require('../../../lib/supabase');
const { adminAuth } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;

  const { data: customer, error: custError } = await supabase
    .from('customers')
    .select('id, name, email, phone, is_verified, created_at, addresses(*)')
    .eq('id', id)
    .maybeSingle();

  if (custError) return res.status(500).json({ error: 'Could not load customer' });
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, payment_status, total, created_at')
    .eq('customer_id', id)
    .order('created_at', { ascending: false });

  return res.status(200).json({ customer, orders: orders || [] });
}

module.exports = adminAuth(handler);
