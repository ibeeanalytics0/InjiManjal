const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(8).max(100),
});

module.exports = async (req, res) => {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);
  const { name, email, phone, password } = parsed.data;

  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { data: customer, error } = await supabase
    .from('customers')
    .insert({ name, email, phone, password_hash })
    .select('id, name, email')
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not create account' });
  }

  return res.status(201).json({ customer });
};
