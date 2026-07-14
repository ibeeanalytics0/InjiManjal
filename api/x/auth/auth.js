const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { 
  signAdminAccess, 
  signAdminRefresh, 
  setAuthCookies, 
  clearAuthCookies, 
  verifyAdminRefresh, 
  parseCookies 
} = require('../../../lib/jwt');
const { rateLimit } = require('../../../middleware/rateLimit');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

// ==========================================
// 1. LOGIC FROM login.js
// ==========================================
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

async function handleLogin(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { username, password } = parsed.data;

  const { data: admin } = await supabase
    .from('admins')
    .select('id, username, password_hash, role')
    .eq('username', username)
    .maybeSingle();

  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = { id: admin.id, username: admin.username, role: admin.role };
  const accessToken = signAdminAccess(payload);
  const refreshToken = signAdminRefresh(payload);

  setAuthCookies(res, {
    accessName: 'admin_access',
    accessToken,
    refreshName: 'admin_refresh',
    refreshToken,
  });

  await supabase.from('admins').update({ last_login: new Date().toISOString() }).eq('id', admin.id);

  return res.status(200).json({ admin: { id: admin.id, username: admin.username, role: admin.role } });
}

// Apply rate limiting specifically to the admin login sub-handler
const limitedLogin = rateLimit('admin-login')(handleLogin);

// ==========================================
// 2. LOGIC FROM logout.js
// ==========================================
async function handleLogout(req, res) {
  clearAuthCookies(res, { accessName: 'admin_access', refreshName: 'admin_refresh' });
  return res.status(200).json({ ok: true });
}

// ==========================================
// 3. LOGIC FROM refresh.js
// ==========================================
async function handleRefresh(req, res) {
  const cookies = parseCookies(req);
  const refreshToken = cookies.admin_refresh;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = verifyAdminRefresh(refreshToken);
    const payload = { id: decoded.id, username: decoded.username, role: decoded.role };

    const accessToken = signAdminAccess(payload);
    const newRefreshToken = signAdminRefresh(payload);

    setAuthCookies(res, {
      accessName: 'admin_access',
      accessToken,
      refreshName: 'admin_refresh',
      refreshToken: newRefreshToken,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(401).json({ error: 'Refresh token expired — please log in again' });
  }
}

// ==========================================
// MAIN ROUTER GATEWAY
// ==========================================
module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Read the incoming URL path
  const url = req.url || '';

  if (url.endsWith('/login')) {
    return await limitedLogin(req, res);
  }

  if (url.endsWith('/logout')) {
    return await handleLogout(req, res);
  }

  if (url.endsWith('/refresh')) {
    return await handleRefresh(req, res);
  }

  return res.status(404).json({ error: 'Admin auth route not found' });
};
