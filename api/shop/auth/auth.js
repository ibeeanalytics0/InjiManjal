const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { 
  signCustomerAccess, 
  signCustomerRefresh, 
  setAuthCookies, 
  clearAuthCookies, 
  verifyCustomerRefresh, 
  parseCookies 
} = require('../../../lib/jwt');
const { rateLimit } = require('../../../middleware/rateLimit');
const { customerAuth } = require('../../../middleware/customerAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

// ==========================================
// 1. LOGIC FROM register.js
// ==========================================
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(8).max(100),
});

async function handleRegister(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { name, email, phone, password } = parsed.data;

  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { data: customer, error } = await supabase
    .from('customers')
    .insert({ name, email, phone, password_hash })
    .select('id, name, email')
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not create account' });
  }

  const payload = { id: customer.id, email: customer.email };
  const accessToken = signCustomerAccess(payload);
  const refreshToken = signCustomerRefresh(payload);

  setAuthCookies(res, {
    accessName: 'customer_access',
    accessToken,
    refreshName: 'customer_refresh',
    refreshToken,
  });

  return res.status(201).json({ customer });
}

// ==========================================
// 2. LOGIC FROM login.js
// ==========================================
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function handleLogin(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { email, password } = parsed.data;

  const { data: customer } = await supabase
    .from('customers')
    .select('id, name, email, password_hash')
    .eq('email', email)
    .maybeSingle();

  if (!customer) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, customer.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const payload = { id: customer.id, email: customer.email };
  const accessToken = signCustomerAccess(payload);
  const refreshToken = signCustomerRefresh(payload);

  setAuthCookies(res, {
    accessName: 'customer_access',
    accessToken,
    refreshName: 'customer_refresh',
    refreshToken,
  });

  return res.status(200).json({
    customer: { id: customer.id, name: customer.name, email: customer.email },
  });
}

// Apply rate limiting specifically to the login sub-handler function
const limitedLogin = rateLimit('customer-login')(handleLogin);

// ==========================================
// 3. LOGIC FROM logout.js
// ==========================================
async function handleLogout(req, res) {
  clearAuthCookies(res, { accessName: 'customer_access', refreshName: 'customer_refresh' });
  return res.status(200).json({ ok: true });
}

// ==========================================
// 4. LOGIC FROM refresh.js
// ==========================================
async function handleRefresh(req, res) {
  const cookies = parseCookies(req);
  const refreshToken = cookies.customer_refresh;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = verifyCustomerRefresh(refreshToken);
    const payload = { id: decoded.id, email: decoded.email };

    const accessToken = signCustomerAccess(payload);
    const newRefreshToken = signCustomerRefresh(payload);

    setAuthCookies(res, {
      accessName: 'customer_access',
      accessToken,
      refreshName: 'customer_refresh',
      refreshToken: newRefreshToken,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(401).json({ error: 'Refresh token expired — please log in again' });
  }
}

async function handleMe(req, res) {
  const { data: customer, error } = await supabase
    .from('customers')
    .select('id, name, email')
    .eq('id', req.customer.id)
    .maybeSingle();

  if (error || !customer) return res.status(404).json({ error: 'Customer not found' });
  return res.status(200).json({ customer });
}

// ==========================================
// MAIN ROUTER GATEWAY
// ==========================================
module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;

  // Read the route action passed by Vercel rewrites, with URL fallback for local dev.
  const url = req.url || '';
  const action = req.query?.action;

  if (req.method === 'GET' && (action === 'me' || url.endsWith('/me'))) {
    return customerAuth(handleMe)(req, res);
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (action === 'register' || url.endsWith('/register')) {
    return await handleRegister(req, res);
  }
  
  if (action === 'login' || url.endsWith('/login')) {
    return await limitedLogin(req, res);
  }
  
  if (action === 'logout' || url.endsWith('/logout')) {
    return await handleLogout(req, res);
  }
  
  if (action === 'refresh' || url.endsWith('/refresh')) {
    return await handleRefresh(req, res);
  }

  return res.status(404).json({ error: 'Auth route not found' });
};
