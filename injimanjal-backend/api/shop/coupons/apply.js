const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
});

module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { code, subtotal } = parsed.data;

  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (!coupon) return res.status(404).json({ valid: false, error: 'Invalid coupon code' });
  if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
    return res.status(400).json({ valid: false, error: 'Coupon has expired' });
  }
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return res.status(400).json({ valid: false, error: 'Coupon usage limit reached' });
  }
  if (subtotal < coupon.min_order) {
    return res.status(400).json({ valid: false, error: `Minimum order of ₹${coupon.min_order} required` });
  }

  const discount = coupon.type === 'percent' ? (subtotal * coupon.discount_value) / 100 : coupon.discount_value;

  return res.status(200).json({ valid: true, discount: Math.round(discount * 100) / 100 });
};
