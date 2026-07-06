const { verifyAdminAccess, parseCookies } = require('../lib/jwt');
const { supabase } = require('../lib/supabase');

/**
 * Wraps a Vercel serverless handler and requires a valid ADMIN access token.
 * A customer token cannot pass this check — different cookie name + different secret.
 * Attaches req.admin = { id, username, role }
 */
function adminAuth(handler) {
  return async (req, res) => {
    try {
      const cookies = parseCookies(req);
      const token = cookies.admin_access;
      if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      const decoded = verifyAdminAccess(token);
      req.admin = { id: decoded.id, username: decoded.username, role: decoded.role };
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired admin session' });
    }
  };
}

/** Records an admin action to activity_log. Call this from within route handlers. */
async function logActivity(adminId, action, target) {
  await supabase.from('activity_log').insert({ admin_id: adminId, action, target });
}

module.exports = { adminAuth, logActivity };
