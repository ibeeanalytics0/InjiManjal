const { supabase } = require('../../../lib/supabase');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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
};
