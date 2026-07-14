const { z } = require('zod');
const { supabase } = require('../../lib/supabase');
const { adminAuth, logActivity } = require('../../middleware/adminAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../lib/http');

// ==========================================
// VALIDATION SCHEMAS
// ==========================================
const createCouponSchema = z.object({
  code: z.string().min(2).toUpperCase(),
  type: z.enum(['percent', 'flat']),
  discount_value: z.number().positive(),
  min_order: z.number().min(0).default(0),
  usage_limit: z.number().int().positive().optional(),
  expiry: z.string().datetime().optional(),
});

const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

const orderTrackingSchema = z.object({
  tracking_number: z.string().min(1),
});

// ==========================================
// 1. COUPONS MODULE
// ==========================================
async function handleGetCoupons(req, res) {
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not load coupons' });
  return res.status(200).json({ coupons: data });
}

async function handleCreateCoupon(req, res) {
  const parsed = createCouponSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const { data, error } = await supabase.from('coupons').insert(parsed.data).select().single();
  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Coupon code already exists' });
    return res.status(500).json({ error: 'Could not create coupon' });
  }
  await logActivity(req.admin.id, 'CREATE_COUPON', `coupon:${data.code}`);
  return res.status(201).json({ coupon: data });
}

async function handleDeleteCoupon(req, res, id) {
  const { error } = await supabase.from('coupons').update({ is_active: false }).eq('id', id);
  if (error) return res.status(500).json({ error: 'Could not delete coupon' });
  await logActivity(req.admin.id, 'DELETE_COUPON', `coupon:${id}`);
  return res.status(200).json({ ok: true });
}

// ==========================================
// 2. CUSTOMERS MODULE
// ==========================================
async function handleGetCustomers(req, res) {
  const { data, error } = await supabase
    .from('customers')
    .select('id, name, email, phone, is_verified, created_at')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not load customers' });
  return res.status(200).json({ customers: data });
}

async function handleGetSingleCustomer(req, res, id) {
  const { data: customer, error: custError } = await supabase
    .from('customers')
    .select('id, name, email, phone, is_verified, created_at, addresses(*)')
    .eq('id', id)
    .maybeSingle();

  if (custError) return res.status(500).json({ error: 'Could not load customer' });
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, payment_status, total, created_at')
    .eq('customer_id', id)
    .order('created_at', { ascending: false });

  return res.status(200).json({ customer, orders: orders || [] });
}

// ==========================================
// 3. LOGS MODULE
// ==========================================
async function handleGetLogs(req, res) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('id, action, target, created_at, admins(username)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return res.status(500).json({ error: 'Could not load activity log' });
  return res.status(200).json({ logs: data });
}

// ==========================================
// 4. ORDERS MODULE
// ==========================================
async function handleGetOrders(req, res) {
  const { status } = req.query;
  let query = supabase
    .from('orders')
    .select('id, customer_id, status, payment_status, total, tracking_number, created_at, customers(name, email)')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not load orders' });
  }
  return res.status(200).json({ orders: data });
}

async function handleGetSingleOrder(req, res, id) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, customers(name, email, phone), addresses(line1, line2, city, state, pincode, phone), order_items(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Could not load order' });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.status(200).json({ order });
}

async function handleUpdateOrderStatus(req, res, id) {
  const parsed = orderStatusSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const { data, error } = await supabase
    .from('orders')
    .update({ status: parsed.data.status })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not update order status' });
  await logActivity(req.admin.id, 'UPDATE_ORDER_STATUS', `order:${id} -> ${parsed.data.status}`);
  return res.status(200).json({ order: data });
}

async function handleUpdateOrderTracking(req, res, id) {
  const parsed = orderTrackingSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const { data, error } = await supabase
    .from('orders')
    .update({ tracking_number: parsed.data.tracking_number })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not update tracking number' });
  await logActivity(req.admin.id, 'UPDATE_TRACKING', `order:${id} -> ${parsed.data.tracking_number}`);
  return res.status(200).json({ order: data });
}

// ==========================================
// MAIN GENERAL DISPATCHER
// ==========================================
async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;

  const url = req.url || '';
  const cleanPath = url.split('?')[0];
  const pathParts = cleanPath.split('/').filter(Boolean); // e.g., ['api', 'x', 'orders', 'status']

  // ----------------------------------------
  // DISPATCH COUPONS
  // ----------------------------------------
  if (pathParts.includes('coupons')) {
    if (pathParts.length > 3) {
      if (req.method === 'DELETE') return await handleDeleteCoupon(req, res, pathParts[3]);
      return res.status(405).json({ error: 'Method not allowed' });
    }
    if (req.method === 'GET') return await handleGetCoupons(req, res);
    if (req.method === 'POST') return await handleCreateCoupon(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ----------------------------------------
  // DISPATCH CUSTOMERS
  // ----------------------------------------
  if (pathParts.includes('customers')) {
    if (pathParts.length > 3) {
      if (req.method === 'GET') return await handleGetSingleCustomer(req, res, pathParts[3]);
      return res.status(405).json({ error: 'Method not allowed' });
    }
    if (req.method === 'GET') return await handleGetCustomers(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ----------------------------------------
  // DISPATCH LOGS
  // ----------------------------------------
  if (pathParts.includes('logs')) {
    if (req.method === 'GET') return await handleGetLogs(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ----------------------------------------
  // DISPATCH ORDERS
  // ----------------------------------------
  if (pathParts.includes('orders')) {
    if (pathParts.length > 4) {
      const id = pathParts[3]; 
      const action = pathParts[4];
      if (req.method === 'PUT' && action === 'status') return await handleUpdateOrderStatus(req, res, id);
      if (req.method === 'PUT' && action === 'tracking') return await handleUpdateOrderTracking(req, res, id);
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    if (pathParts.length > 3) {
      if (req.method === 'GET') return await handleGetSingleOrder(req, res, pathParts[3]);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (req.method === 'GET') return await handleGetOrders(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ----------------------------------------
  // DISPATCH DASHBOARD STATS
  // ----------------------------------------
  if (pathParts.includes('dashboard') && pathParts.includes('stats')) {
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

  return res.status(404).json({ error: 'Admin dashboard path handler fallback failed' });
}

module.exports = adminAuth(handler);
