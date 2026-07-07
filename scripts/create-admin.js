/**
 * One-time script to create your first admin account.
 * Run locally (never deploy this as an API route):
 *
 *   node scripts/create-admin.js myusername myPassword123
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabase } = require('../lib/supabase');

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Usage: node scripts/create-admin.js <username> <password>');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters');
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, 12);
  const { data, error } = await supabase
    .from('admins')
    .insert({ username, password_hash, role: 'admin' })
    .select('id, username')
    .single();

  if (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }

  console.log('Admin created:', data);
  process.exit(0);
}

main();
