const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const COOKIE_BASE = {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
  path: '/',
};

// ---------- CUSTOMER ----------
function signCustomerAccess(payload) {
  return jwt.sign(payload, process.env.CUSTOMER_JWT_SECRET, { expiresIn: '15m' });
}
function signCustomerRefresh(payload) {
  return jwt.sign(payload, process.env.CUSTOMER_REFRESH_SECRET, { expiresIn: '7d' });
}
function verifyCustomerAccess(token) {
  return jwt.verify(token, process.env.CUSTOMER_JWT_SECRET);
}
function verifyCustomerRefresh(token) {
  return jwt.verify(token, process.env.CUSTOMER_REFRESH_SECRET);
}

// ---------- ADMIN ----------
function signAdminAccess(payload) {
  return jwt.sign(payload, process.env.ADMIN_JWT_SECRET, { expiresIn: '15m' });
}
function signAdminRefresh(payload) {
  return jwt.sign(payload, process.env.ADMIN_REFRESH_SECRET, { expiresIn: '7d' });
}
function verifyAdminAccess(token) {
  return jwt.verify(token, process.env.ADMIN_JWT_SECRET);
}
function verifyAdminRefresh(token) {
  return jwt.verify(token, process.env.ADMIN_REFRESH_SECRET);
}

// ---------- COOKIE HELPERS ----------
function setAuthCookies(res, { accessName, accessToken, refreshName, refreshToken }) {
  const accessCookie = cookie.serialize(accessName, accessToken, {
    ...COOKIE_BASE,
    maxAge: 15 * 60, // 15 min
  });
  const refreshCookie = cookie.serialize(refreshName, refreshToken, {
    ...COOKIE_BASE,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
}

function clearAuthCookies(res, { accessName, refreshName }) {
  const clearAccess = cookie.serialize(accessName, '', { ...COOKIE_BASE, maxAge: 0 });
  const clearRefresh = cookie.serialize(refreshName, '', { ...COOKIE_BASE, maxAge: 0 });
  res.setHeader('Set-Cookie', [clearAccess, clearRefresh]);
}

function parseCookies(req) {
  return cookie.parse(req.headers.cookie || '');
}

module.exports = {
  signCustomerAccess,
  signCustomerRefresh,
  verifyCustomerAccess,
  verifyCustomerRefresh,
  signAdminAccess,
  signAdminRefresh,
  verifyAdminAccess,
  verifyAdminRefresh,
  setAuthCookies,
  clearAuthCookies,
  parseCookies,
};
