const { supabase } = require('../../lib/supabase');
const { applySecurityHeaders, handlePreflight } = require('../../lib/http');

// ==========================================
// 1. LOGIC FROM index.js (List or Filter Products)
// ==========================================
async function handleListProducts(req, res) {
  const { category } = req.query;

  let query = supabase
    .from('products')
    .select('id, name, slug, description, category, price, sale_price, image_url, stock')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not load products' });
  }

  return res.status(200).json({ products: data });
}

// ==========================================
// 2. LOGIC FROM [slug].js (Get Single Product)
// ==========================================
async function handleSingleProduct(req, res, slug) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, category, price, sale_price, image_url, stock')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not load product' });
  }
  if (!data) return res.status(404).json({ error: 'Product not found' });

  return res.status(200).json({ product: data });
}

// ==========================================
// MAIN ROUTER GATEWAY
// ==========================================
module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const url = req.url || '';
  
  // Clean up the URL to evaluate the path parameters
  // e.g., /api/shop/products OR /api/shop/products/some-product-slug
  const cleanPath = url.split('?')[0]; 
  const pathParts = cleanPath.split('/').filter(Boolean); // Example: ['api', 'shop', 'products', 'slug']

  // If there's a 4th element in the path, it represents the dynamic product slug
  if (pathParts.length > 3) {
    const slug = pathParts[3];
    return await handleSingleProduct(req, res, slug);
  }

  // Otherwise, fallback to the standard index product listing behavior
  return await handleListProducts(req, res);
};