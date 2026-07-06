const { supabase } = require('../../../lib/supabase');
const { adminAuth } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { data, error } = await supabase
    .from('activity_log')
    .select('id, action, target, created_at, admins(username)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return res.status(500).json({ error: 'Could not load activity log' });
  return res.status(200).json({ logs: data });
}

module.exports = adminAuth(handler);
