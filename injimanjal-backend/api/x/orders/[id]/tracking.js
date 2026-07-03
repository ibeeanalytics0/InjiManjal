const { z } = require('zod');
const { supabase } = require('../../../../lib/supabase');
const { adminAuth, logActivity } = require('../../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../../lib/http');

const schema = z.object({
  tracking_number: z.string().min(1),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const { data, error } = await supabase
    .from('orders')
    .update({ tracking_number: parsed.data.tracking_number })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not update tracking number' });

  await logActivity(req.admin.id, 'UPDATE_TRACKING', `order:${id} -> ${parsed.data.tracking_number}`);
  return res.status(200).json({ order: data });
}

module.exports = adminAuth(handler);
