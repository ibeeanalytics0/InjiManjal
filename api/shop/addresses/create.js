const { z } = require('zod');
const { supabase } = require('../../../lib/supabase');
const { customerAuth } = require('../../../middleware/customerAuth');
const { applySecurityHeaders, handlePreflight, zodError } = require('../../../lib/http');

const schema = z.object({
  label: z.string().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(4).max(10),
  phone: z.string().min(10).max(15),
  is_default: z.boolean().optional(),
});

async function handler(req, res) {
  applySecurityHeaders(req, res);
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return zodError(res, parsed.error);

  const { data: address, error } = await supabase
    .from('addresses')
    .insert({ ...parsed.data, customer_id: req.customer.id })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not save address' });
  }

  return res.status(201).json({ address });
}

module.exports = customerAuth(handler);
