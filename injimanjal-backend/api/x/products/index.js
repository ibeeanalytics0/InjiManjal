const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { adminAuth, logActivity } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive(),
  sale_price: z.number().positive().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  image_url: z.string().url().optional(),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: 'Could not load products' });
    return res.status(200).json({ products: data });
  }

  if (req.method === 'POST') {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return zodError(res, parsed.error);

    const { data, error } = await supabase.from('products').insert(parsed.data).select().single();
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not create product' });
    }

    await logActivity(req.admin.id, 'CREATE_PRODUCT', `product:${data.id}`);
    return res.status(201).json({ product: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = adminAuth(handler);
