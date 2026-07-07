const { supabase } = require('../../../lib/supabase');
const { adminAuth } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // password_hash intentionally excluded from select
  const { data, error } = await supabase
    .from('customers')
    .select('id, name, email, phone, is_verified, created_at')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Could not load customers' });
  return res.status(200).json({ customers: data });
}

module.exports = adminAuth(handler);
