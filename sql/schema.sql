-- ============================================
-- InjiManjal E-Commerce Schema (PostgreSQL / Supabase)
-- ============================================

-- Auto-update updated_at trigger function
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================
-- customers
-- ============================
create table customers (
  id serial primary key,
  name text not null,
  email text unique not null,
  phone text,
  password_hash text not null,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_customers_updated
before update on customers
for each row execute function set_updated_at();

-- ============================
-- addresses
-- ============================
create table addresses (
  id serial primary key,
  customer_id integer references customers(id) on delete cascade,
  label text default 'Home',
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  phone text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- ============================
-- products
-- ============================
create table products (
  id serial primary key,
  name text not null,
  slug text unique not null,
  description text,
  category text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  sku text unique,
  stock integer not null default 0,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_products_updated
before update on products
for each row execute function set_updated_at();

-- ============================
-- coupons
-- ============================
create table coupons (
  id serial primary key,
  code text unique not null,
  type text not null check (type in ('percent', 'flat')),
  discount_value numeric(10,2) not null,
  min_order numeric(10,2) default 0,
  usage_limit integer,
  used_count integer default 0,
  expiry timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_coupons_updated
before update on coupons
for each row execute function set_updated_at();

-- ============================
-- orders
-- ============================
create table orders (
  id serial primary key,
  customer_id integer references customers(id) on delete set null,
  address_id integer references addresses(id),
  status text not null default 'PENDING'
    check (status in ('PENDING','PAID','SHIPPED','DELIVERED','CANCELLED')),
  payment_id text,
  payment_status text default 'INITIATED'
    check (payment_status in ('INITIATED','PAID','FAILED','REFUNDED')),
  razorpay_order_id text,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0,
  shipping_cost numeric(10,2) default 0,
  tax numeric(10,2) default 0,
  total numeric(10,2) not null,
  coupon_code text,
  tracking_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_orders_updated
before update on orders
for each row execute function set_updated_at();

-- ============================
-- order_items
-- ============================
create table order_items (
  id serial primary key,
  order_id integer references orders(id) on delete cascade,
  product_id integer references products(id),
  product_name text not null,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  created_at timestamptz default now()
);

-- ============================
-- admins
-- ============================
create table admins (
  id serial primary key,
  username text unique not null,
  password_hash text not null,
  role text default 'admin',
  last_login timestamptz,
  created_at timestamptz default now()
);

-- ============================
-- settings
-- ============================
create table settings (
  key text primary key,
  value text not null
);

insert into settings (key, value) values
  ('free_shipping_threshold', '499'),
  ('shipping_cost', '49'),
  ('tax_percent', '0');

-- ============================
-- activity_log
-- ============================
create table activity_log (
  id serial primary key,
  admin_id integer references admins(id),
  action text not null,
  target text,
  created_at timestamptz default now()
);

-- ============================
-- Helper functions (atomic stock/coupon updates)
-- ============================
create or replace function decrement_stock(p_product_id integer, p_qty integer)
returns void as $$
begin
  update products set stock = greatest(0, stock - p_qty) where id = p_product_id;
end;
$$ language plpgsql;

create or replace function increment_coupon_usage(p_code text)
returns void as $$
begin
  update coupons set used_count = used_count + 1 where code = p_code;
end;
$$ language plpgsql;

-- ============================
-- Indexes
-- ============================
create index idx_products_slug on products(slug);
create index idx_products_active on products(is_active);
create index idx_orders_customer on orders(customer_id);
create index idx_orders_status on orders(status);
create index idx_order_items_order on order_items(order_id);
create index idx_addresses_customer on addresses(customer_id);
