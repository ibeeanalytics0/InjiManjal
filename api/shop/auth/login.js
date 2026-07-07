const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { signCustomerAccess, signCustomerRefresh, setAuthCookies } = require('../../../lib/jwt');
const { rateLimit } = require('../../../middleware/rateLimit');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { email, password } = parsed.data;

  const { data: customer } = await supabase
    .from('customers')
    .select('id, name, email, password_hash')
    .eq('email', email)
    .maybeSingle();

  // Generic error message on purpose — don't reveal whether the email exists
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

module.exports = rateLimit('customer-login')(handler);
