const { supabase } = require('../../../lib/supabase');
const { adminAuth, logActivity } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;

  // Soft delete via is_active so historical orders that referenced this coupon stay intact
  const { error } = await supabase.from('coupons').update({ is_active: false }).eq('id', id);
  if (error) return res.status(500).json({ error: 'Could not delete coupon' });

  await logActivity(req.admin.id, 'DELETE_COUPON', `coupon:${id}`);
  return res.status(200).json({ ok: true });
}

module.exports = adminAuth(handler);
