# InjiManjal Backend

Node.js serverless backend for the InjiManjal e-commerce site, deployed on Vercel.
Supabase (PostgreSQL) for data, Razorpay for GPay/UPI payments, Resend for transactional email.

## Setup

1. **Supabase**
   - Create a new Supabase project.
   - Run `sql/schema.sql` in the SQL editor (creates all tables, triggers, and helper functions).
   - Copy your Project URL and `service_role` key (Settings → API).

2. **Razorpay**
   - Create a Razorpay account, switch to Test Mode.
   - Copy Key ID and Key Secret (Settings → API Keys).

3. **Resend**
   - Create an account, verify a sending domain (or use their test domain while developing).
   - Copy your API key.

4. **Environment variables**
   - Copy `.env.example` to `.env` and fill in all values.
   - Generate strong random secrets for the four JWT secrets, e.g.:
     ```
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
     Run it four times for `CUSTOMER_JWT_SECRET`, `CUSTOMER_REFRESH_SECRET`, `ADMIN_JWT_SECRET`, `ADMIN_REFRESH_SECRET`.

5. **Install dependencies**
   ```
   npm install
   ```

6. **Create your first admin account** (do this locally, never as a live route)
   ```
   node scripts/create-admin.js youradminname aStrongPassword123
   ```

7. **Local dev**
   ```
   npx vercel dev
   ```

8. **Deploy**
   - Push to GitHub, import into Vercel.
   - Add all env vars from `.env` into Vercel's Environment Variables settings.
   - Deploy.

## Admin panel

The `admin-ui/` folder is a static hidden panel. Deploy it as a separate Vercel
static project (or under a non-obvious path/subdomain — do not use `/admin`).
Point its `fetch()` calls at your backend's deployed URL if hosted separately,
or serve it from the same Vercel project if you prefer a single deployment.

## Route map

See the original plan doc for the full customer (`/api/shop/*`) and admin
(`/api/x/*`) route list — the folder structure under `api/` mirrors it exactly,
Vercel-style (each file = one route, `[param].js` = dynamic segment).

## Security notes already implemented

- Separate JWT secrets + separate cookies for customers vs admins — a customer
  token cannot pass `adminAuth`.
- Access tokens: 15 min expiry, HTTP-only, `Secure`, `SameSite=Strict` cookies.
- Refresh tokens: 7 day expiry, same cookie protections; `/auth/refresh` routes
  issue a new pair silently.
- Razorpay payment signatures are verified server-side with HMAC-SHA256 before
  any order is marked paid — the frontend cannot fabricate a "successful" payment.
- `password_hash` is never selected/returned in any API response.
- Zod validates every request body.
- bcrypt with 12 rounds for all password hashing.
- Basic in-memory rate limiting on both login routes (see `middleware/rateLimit.js`
  for a note on swapping to Upstash Redis for production-grade protection across
  serverless instances).
- Every admin mutation is recorded to `activity_log`.
