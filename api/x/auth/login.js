const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { signAdminAccess, signAdminRefresh, setAuthCookies } = require('../../../lib/jwt');
const { rateLimit } = require('../../../middleware/rateLimit');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = schema.safeParse(req.body);
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

module.exports = rateLimit('admin-login')(handler);
