const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { adminAuth, logActivity } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const updateSchema = z.object({
  free_shipping_threshold: z.number().min(0).optional(),
  shipping_cost: z.number().min(0).optional(),
  tax_percent: z.number().min(0).max(100).optional(),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) return res.status(500).json({ error: 'Could not load settings' });

    const settings = {};
    for (const row of data) settings[row.key] = row.value;
    return res.status(200).json({ settings });
  }

  if (req.method === 'PUT') {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return zodError(res, parsed.error);

    const updates = Object.entries(parsed.data);
    for (const [key, value] of updates) {
      await supabase.from('settings').upsert({ key, value: String(value) });
    }

    await logActivity(req.admin.id, 'UPDATE_SETTINGS', updates.map(([k, v]) => `${k}=${v}`).join(', '));
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = adminAuth(handler);
