/**
 * Simple in-memory rate limiter: 5 attempts / 15 min per IP+route.
 *
 * NOTE: Vercel serverless functions are stateless across invocations/instances,
 * so this in-memory store is only a best-effort limiter on a single warm instance.
 * For real brute-force protection in production, swap this for Upstash Redis
 * (free tier works fine) — same interface, just replace the Map with Redis calls.
 */
const attempts = new Map();

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minutes default
const MAX_ATTEMPTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 5;

function rateLimit(keyPrefix) {
  return (handler) => async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    const record = attempts.get(key) || { count: 0, windowStart: now };

    if (now - record.windowStart > WINDOW_MS) {
      record.count = 0;
      record.windowStart = now;
    }

    if (record.count >= MAX_ATTEMPTS) {
      const retryAfterSec = Math.ceil((WINDOW_MS - (now - record.windowStart)) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({ error: 'Too many attempts. Try again later.' });
    }

    record.count += 1;
    attempts.set(key, record);

    return handler(req, res);
  };
}

module.exports = { rateLimit };
