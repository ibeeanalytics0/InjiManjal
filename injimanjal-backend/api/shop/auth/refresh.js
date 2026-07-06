const {
  verifyCustomerRefresh,
  signCustomerAccess,
  signCustomerRefresh,
  setAuthCookies,
  parseCookies,
} = require('../../../lib/jwt');
const { applySecurityHeaders, handlePreflight } = require('../../../lib/http');

module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
};
