const { supabase } = require('../../../lib/supabase');
const { adminAuth } = require('../../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const [{ count: customerCount }, { count: orderCount }, { data: paidOrders }, { data: lowStock }] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total').eq('payment_status', 'PAID'),
    supabase.from('products').select('id, name, stock').lt('stock', 10).eq('is_active', true),
  ]);

  const revenue = (paidOrders || []).reduce((sum, o) => sum + Number(o.total), 0);

  return res.status(200).json({
    customers: customerCount || 0,
    orders: orderCount || 0,
    revenue: Math.round(revenue * 100) / 100,
    low_stock_products: lowStock || [],
  });
}

module.exports = adminAuth(handler);
