const { clearAuthCookies } = require('../../../lib/jwt');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  clearAuthCookies(res, { accessName: 'admin_access', refreshName: 'admin_refresh' });
  return res.status(200).json({ ok: true });
};
