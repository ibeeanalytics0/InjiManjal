const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());

/** Applies CORS + Helmet-equivalent security headers. Call at the top of every handler. */
function applySecurityHeaders(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

/** Handles CORS preflight. Returns true if the request was a preflight (caller should stop). */
function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

/** Wraps zod parse errors into a clean 400 response. */
function zodError(res, error) {
  return res.status(400).json({
    error: 'Validation failed',
    details: error.errors?.map(e => ({ field: e.path.join('.'), message: e.message })),
  });
}

module.exports = { applySecurityHeaders, handlePreflight, zodError };
