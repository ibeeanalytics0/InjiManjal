const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { adminAuth, logActivity } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const createSchema = z.object({
  code: z.string().min(2).toUpperCase(),
  type: z.enum(['percent', 'flat']),
  discount_value: z.number().positive(),
  min_order: z.number().min(0).default(0),
  usage_limit: z.number().int().positive().optional(),
  expiry: z.string().datetime().optional(),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: 'Could not load coupons' });
    return res.status(200).json({ coupons: data });
  }

  if (req.method === 'POST') {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return zodError(res, parsed.error);

    const { data, error } = await supabase.from('coupons').insert(parsed.data).select().single();
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Coupon code already exists' });
      return res.status(500).json({ error: 'Could not create coupon' });
    }

    await logActivity(req.admin.id, 'CREATE_COUPON', `coupon:${data.code}`);
    return res.status(201).json({ coupon: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = adminAuth(handler);
