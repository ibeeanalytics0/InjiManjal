const { z } = require('zod');
const { supabase } = require('../../lib/supabase');
const { adminAuth, logActivity } = require('../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../lib/http');

// ==========================================
// SCHEMAS FROM EACH ENDPOINT
// ==========================================
const createProductSchema = z.object({
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

const updateProductSchema = z.object({
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

const updateSettingsSchema = z.object({
  free_shipping_threshold: z.number().min(0).optional(),
  shipping_cost: z.number().min(0).optional(),
  tax_percent: z.number().min(0).max(100).optional(),
});

// ==========================================
// 1. PRODUCTS SUBSYSTEM LOGIC
// ==========================================
async function handleGetProducts(req, res) {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not load products' });
  return res.status(200).json({ products: data });
}

async function handleCreateProduct(req, res) {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const { data, error } = await supabase.from('products').insert(parsed.data).select().single();
  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not create product' });
  }

  await logActivity(req.admin.id, 'CREATE_PRODUCT', `product:${data.id}`);
  return res.status(201).json({ product: data });
}

async function handleUpdateProduct(req, res, id) {
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const { data, error } = await supabase.from('products').update(parsed.data).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: 'Could not update product' });

  await logActivity(req.admin.id, 'UPDATE_PRODUCT', `product:${id}`);
  return res.status(200).json({ product: data });
}

async function handleDeleteProduct(req, res, id) {
  // Soft delete — keeps order history intact
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id);
  if (error) return res.status(500).json({ error: 'Could not delete product' });

  await logActivity(req.admin.id, 'DELETE_PRODUCT', `product:${id}`);
  return res.status(200).json({ ok: true });
}

// ==========================================
// 2. SETTINGS SUBSYSTEM LOGIC
// ==========================================
async function handleGetSettings(req, res) {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) return res.status(500).json({ error: 'Could not load settings' });

  const settings = {};
  for (const row of data) settings[row.key] = row.value;
  return res.status(200).json({ settings });
}

async function handleUpdateSettings(req, res) {
  const parsed = updateSettingsSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const updates = Object.entries(parsed.data);
  for (const [key, value] of updates) {
    await supabase.from('settings').upsert({ key, value: String(value) });
  }

  await logActivity(req.admin.id, 'UPDATE_SETTINGS', updates.map(([k, v]) => `${k}=${v}`).join(', '));
  return res.status(200).json({ ok: true });
}

// ==========================================
// MAIN MULTI-ROUTE ADMIN ROUTER
// ==========================================
async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;

  const url = req.url || '';
  const cleanPath = url.split('?')[0];
  const pathParts = cleanPath.split('/').filter(Boolean); // Example: ['api', 'x', 'products', '123'] or ['api', 'x', 'settings']
  const idFromQuery = req.query?.id;

  // Route group destination resolution
  if (pathParts.includes('settings')) {
    if (req.method === 'GET') return await handleGetSettings(req, res);
    if (req.method === 'PUT') return await handleUpdateSettings(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (pathParts.includes('products')) {
    // If there is an ID at the end of the path array (e.g. /api/x/products/45)
    const id = idFromQuery || (pathParts.length > 3 ? pathParts[3] : null);
    if (id) {
      if (req.method === 'PUT') return await handleUpdateProduct(req, res, id);
      if (req.method === 'DELETE') return await handleDeleteProduct(req, res, id);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Otherwise standard fallback for root actions
    if (req.method === 'GET') return await handleGetProducts(req, res);
    if (req.method === 'POST') return await handleCreateProduct(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(404).json({ error: 'Admin target sub-route not found' });
}

module.exports = adminAuth(handler);