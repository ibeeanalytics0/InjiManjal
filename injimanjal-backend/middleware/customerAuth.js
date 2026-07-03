const { verifyCustomerAccess, parseCookies } = require('../lib/jwt');

/**
 * Wraps a Vercel serverless handler and requires a valid customer access token.
 * Usage: module.exports = customerAuth(async (req, res) => {...})
 * Attaches req.customer = { id, email }
 */
function customerAuth(handler) {
  return async (req, res) => {
    try {
      const cookies = parseCookies(req);
      const token = cookies.customer_access;
      if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      const decoded = verifyCustomerAccess(token);
      req.customer = { id: decoded.id, email: decoded.email };
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
  };
}

module.exports = { customerAuth };
