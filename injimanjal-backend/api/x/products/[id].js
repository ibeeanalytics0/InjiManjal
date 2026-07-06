const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { adminAuth, logActivity } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive().optional(),
  sale_price: z.number().positive().nullable().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  image_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  const { id } = req.query;

  if (req.method === 'PUT') {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return zodError(res, parsed.error);

    const { data, error } = await supabase.from('products').update(parsed.data).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: 'Could not update product' });

    await logActivity(req.admin.id, 'UPDATE_PRODUCT', `product:${id}`);
    return res.status(200).json({ product: data });
  }

  if (req.method === 'DELETE') {
    // Soft delete — keeps order history intact
    const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id);
    if (error) return res.status(500).json({ error: 'Could not delete product' });

    await logActivity(req.admin.id, 'DELETE_PRODUCT', `product:${id}`);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = adminAuth(handler);
