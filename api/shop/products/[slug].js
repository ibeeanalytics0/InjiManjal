const { supabase } = require('../../../lib/supabase');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;

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
};
