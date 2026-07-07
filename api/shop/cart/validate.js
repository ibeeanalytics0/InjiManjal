const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const schema = z.object({
  items: z.array(z.object({
    product_id: z.number().int(),
    quantity: z.number().int().positive(),
  })).min(1),
});

module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { items } = parsed.data;

  const ids = items.map(i => i.product_id);
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, sale_price, stock, is_active')
    .in('id', ids);

  if (error) return res.status(500).json({ error: 'Could not validate cart' });

  const issues = [];
  const validated = [];

  for (const item of items) {
    const product = products.find(p => p.id === item.product_id);
    if (!product || !product.is_active) {
      issues.push({ product_id: item.product_id, issue: 'Product unavailable' });
      continue;
    }
    if (product.stock < item.quantity) {
      issues.push({ product_id: item.product_id, issue: `Only ${product.stock} left in stock` });
      continue;
    }
    validated.push({
      product_id: product.id,
      name: product.name,
      unit_price: product.sale_price || product.price,
      quantity: item.quantity,
    });
  }

  if (issues.length > 0) {
    return res.status(409).json({ valid: false, issues });
  }

  return res.status(200).json({ valid: true, items: validated });
};
