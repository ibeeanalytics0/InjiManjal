// Product display metadata only. Real product records come from Supabase/admin.
const CATALOG_META = {
  "honey-figs": {
    "emoji": "🍯",
    "unit": "50g",
    "badge": "Natural",
    "tags": [
      "Sun-Dried",
      "Premium Honey"
    ],
    "marketPrice": 160
  },
  "pure-honey": {
    "emoji": "🍯",
    "unit": "250g",
    "badge": "Raw",
    "tags": [
      "Unprocessed",
      "Pure"
    ],
    "marketPrice": 520
  },
  "fig-powder": {
    "emoji": "🫙",
    "unit": "50g",
    "badge": "Natural",
    "tags": [
      "Sweetener",
      "Nutritious"
    ],
    "marketPrice": 160
  },
  "butterfly-pea-flower": {
    "emoji": "💙",
    "unit": "10g",
    "badge": "Organic",
    "tags": [
      "Antioxidant",
      "Vibrant"
    ],
    "marketPrice": 70
  },
  "black-kavuni-rice": {
    "emoji": "🌾",
    "unit": "1 kg",
    "badge": "Heritage",
    "tags": [
      "Non-GMO",
      "Chemical-Free"
    ],
    "marketPrice": 420
  },
  "seeraga-samba-rice": {
    "emoji": "🌾",
    "unit": "1 kg",
    "badge": "Aromatic",
    "tags": [
      "Native Seed",
      "High Aroma"
    ],
    "marketPrice": 380
  },
  "sivan-samba-ponni-rice": {
    "emoji": "🌾",
    "unit": "1 kg",
    "badge": "Traditional",
    "tags": [
      "Strength",
      "Heritage"
    ],
    "marketPrice": 280
  },
  "butterfly-pea-tea": {
    "emoji": "🫖",
    "unit": "15g",
    "badge": "Organic",
    "tags": [
      "Caffeine Free",
      "Colour Changing"
    ],
    "marketPrice": 140
  },
  "tomato-soup": {
    "emoji": "🥣",
    "unit": "50g",
    "badge": "Instant",
    "tags": [
      "No MSG",
      "Natural"
    ],
    "marketPrice": 90
  },
  "mudakathan-soup": {
    "emoji": "🥣",
    "unit": "50g",
    "badge": "Herbal",
    "tags": [
      "Joint Care",
      "Traditional"
    ],
    "marketPrice": 100
  },
  "drumstick-leaves-soup": {
    "emoji": "🥣",
    "unit": "50g",
    "badge": "Iron Rich",
    "tags": [
      "Moringa",
      "Nutritious"
    ],
    "marketPrice": 90
  },
  "mudavattukal-soup": {
    "emoji": "🥣",
    "unit": "50g",
    "badge": "Traditional",
    "tags": [
      "Authentic",
      "Herbal"
    ],
    "marketPrice": 280
  },
  "black-kavuni-porridge": {
    "emoji": "🥣",
    "unit": "200g",
    "badge": "Nutritious",
    "tags": [
      "Antioxidant",
      "Heritage"
    ],
    "marketPrice": 320
  },
  "black-gram-porridge": {
    "emoji": "🥣",
    "unit": "200g",
    "badge": "Protein",
    "tags": [
      "High Protein",
      "Traditional"
    ],
    "marketPrice": 300
  },
  "millet-porridge": {
    "emoji": "🥣",
    "unit": "200g",
    "badge": "Millet",
    "tags": [
      "Gluten Free",
      "Energy"
    ],
    "marketPrice": 340
  },
  "drumstick-adai-mix": {
    "emoji": "🫙",
    "unit": "200g",
    "badge": "Breakfast",
    "tags": [
      "Iron Rich",
      "Traditional"
    ],
    "marketPrice": 320
  },
  "vallarai-podi": {
    "emoji": "🫙",
    "unit": "100g",
    "badge": "Memory Herb",
    "tags": [
      "Brain Health",
      "Pure Grind"
    ],
    "marketPrice": 320
  },
  "curry-leaf-podi": {
    "emoji": "🌿",
    "unit": "100g",
    "badge": "Authentic",
    "tags": [
      "Iron Rich",
      "Flavour Boost"
    ],
    "marketPrice": 320
  },
  "drumstick-dal-powder": {
    "emoji": "🫙",
    "unit": "100g",
    "badge": "Traditional",
    "tags": [
      "Moringa",
      "Healthy Podi"
    ],
    "marketPrice": 320
  },
  "rice-vadam": {
    "emoji": "🌞",
    "unit": "100g",
    "badge": "Handmade",
    "tags": [
      "Sun-Dried",
      "Native Rice"
    ],
    "marketPrice": 90
  },
  "onion-vadam": {
    "emoji": "🧅",
    "unit": "50g",
    "badge": "Traditional",
    "tags": [
      "Small Batch",
      "No Preservatives"
    ],
    "marketPrice": 100
  },
  "cluster-beans-vathal": {
    "emoji": "🌱",
    "unit": "50g",
    "badge": "Handmade",
    "tags": [
      "Sun-Dried",
      "Pure"
    ],
    "marketPrice": 90
  },
  "brinjal-vathal": {
    "emoji": "🍆",
    "unit": "50g",
    "badge": "Traditional",
    "tags": [
      "Sun-Dried",
      "Authentic"
    ],
    "marketPrice": 90
  },
  "bittergourd-vathal": {
    "emoji": "🥒",
    "unit": "50g",
    "badge": "Traditional",
    "tags": [
      "Diabetic Friendly",
      "Sun-Dried"
    ],
    "marketPrice": 90
  },
  "potato-vathal": {
    "emoji": "🥔",
    "unit": "50g",
    "badge": "Handmade",
    "tags": [
      "Sun-Dried",
      "Crispy"
    ],
    "marketPrice": 90
  },
  "turkey-berry-vathal": {
    "emoji": "🫐",
    "unit": "50g",
    "badge": "Rare",
    "tags": [
      "Sundakkai",
      "Medicinal"
    ],
    "marketPrice": 100
  },
  "sorrel-thokku": {
    "emoji": "🫙",
    "unit": "230g",
    "badge": "Tangy",
    "tags": [
      "Pulicaikeeral",
      "Traditional"
    ],
    "marketPrice": 360
  },
  "lemon-pickle": {
    "emoji": "🍋",
    "unit": "230g",
    "badge": "Classic",
    "tags": [
      "Tangy",
      "No Preservatives"
    ],
    "marketPrice": 340
  },
  "mangai-vathal": {
    "emoji": "🥭",
    "unit": "50g",
    "badge": "Seasonal",
    "tags": [
      "Raw Mango",
      "Traditional"
    ],
    "marketPrice": 90
  },
  "garlic-pickle": {
    "emoji": "🧄",
    "unit": "230g",
    "badge": "Spicy",
    "tags": [
      "Bold Flavour",
      "No MSG"
    ],
    "marketPrice": 360
  },
  "green-gram-soup": {
    "emoji": "🥣",
    "unit": "50g",
    "badge": "Protein",
    "tags": [
      "Weight Loss",
      "Fibre Rich"
    ],
    "marketPrice": 160
  },
  "seenthal-soup": {
    "emoji": "🥣",
    "unit": "50g",
    "badge": "Herbal",
    "tags": [
      "Diabetes",
      "Immunity"
    ],
    "marketPrice": 200
  },
  "thuthi-leaf-soup": {
    "emoji": "🥣",
    "unit": "50g",
    "badge": "Healing",
    "tags": [
      "Wounds",
      "Skin Health"
    ],
    "marketPrice": 210
  },
  "yanai-nerunjil": {
    "emoji": "🥣",
    "unit": "50g",
    "badge": "Siddha",
    "tags": [
      "Renal Health",
      "Detox"
    ],
    "marketPrice": 200
  },
  "ragi-cookies": {
    "emoji": "🍪",
    "unit": "10 pcs",
    "badge": "Healthy",
    "tags": [
      "Calcium Rich",
      "Natural"
    ],
    "marketPrice": 100
  },
  "kambu-cookies": {
    "emoji": "🍪",
    "unit": "10 pcs",
    "badge": "Millet",
    "tags": [
      "Energy",
      "Natural"
    ],
    "marketPrice": 100
  },
  "cashew-cookies": {
    "emoji": "🍪",
    "unit": "10 pcs",
    "badge": "Premium",
    "tags": [
      "Cashew",
      "Crunchy"
    ],
    "marketPrice": 100
  },
  "peanut-cookies": {
    "emoji": "🍪",
    "unit": "10 pcs",
    "badge": "Protein",
    "tags": [
      "Peanut",
      "Wholesome"
    ],
    "marketPrice": 100
  },
  "coconut-cookies": {
    "emoji": "🍪",
    "unit": "10 pcs",
    "badge": "Natural",
    "tags": [
      "Coconut",
      "Traditional"
    ],
    "marketPrice": 100
  },
  "pirandai-oil": {
    "emoji": "🫙",
    "unit": "100ml",
    "badge": "Herbal",
    "tags": [
      "Joint Relief",
      "Circulation"
    ],
    "marketPrice": 260
  },
  "green-gram-soap": {
    "emoji": "🟩",
    "unit": "75g",
    "badge": "Natural",
    "tags": [
      "Cleansing",
      "Pimple Care"
    ],
    "marketPrice": 250
  },
  "guava-podi": {
    "emoji": "🍈",
    "unit": "50g",
    "badge": "Immunity",
    "tags": [
      "Blood Sugar",
      "Digestive"
    ],
    "marketPrice": 120
  },
  "coconut-idly-podi": {
    "emoji": "🥥",
    "unit": "50g",
    "badge": "Breakfast",
    "tags": [
      "Coconut",
      "No Additives"
    ],
    "marketPrice": 120
  }
};

const CATEGORY_EMOJI = {
  wellness: '🌿', tea: '🍵', rice: '🌾', soup: '🥣', podi: '🫙',
  vadam: '☀️', pickle: '🫙', cookies: '🍪', oil: '🫙', soap: '🟩', organic: '🌿',
};
let isLoginMode = true;
let currentCustomer = null;
let pendingCheckoutProductId = null;
let activeCatalog = [];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[character]));
}

async function fetchWithCustomerSession(url, options = {}, retry = true) {
  const response = await fetch(url, { ...options, credentials: 'include' });
  if (response.status !== 401 || !retry) return response;

  const refresh = await fetch('/api/shop/auth/refresh', { method: 'POST', credentials: 'include' });
  if (!refresh.ok) return response;
  return fetchWithCustomerSession(url, options, false);
}

// Global Scoped Functions mapped to UI Buttons
window.launchSite = function() {
  const introScreen = document.getElementById('intro-screen');
  const mainSite = document.getElementById('main-site');
  if (!introScreen) return;
  introScreen.style.opacity = '0';
  introScreen.style.visibility = 'hidden';
  if (mainSite) mainSite.classList.add('visible');
  setTimeout(() => { introScreen.style.display = 'none'; }, 800);
};

window.showPage = function(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'page-enter'));
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    void target.offsetWidth;
    target.classList.add('page-enter');
  }
  document.querySelectorAll('.nav-links button[data-page]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === name);
  });
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(initScrollAnimations, 50);
};

window.filterProducts = function(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#products-grid .product-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'flex' : 'none';
  });
};

window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-button');
  if (!menu || !button) return;
  const isOpen = !menu.classList.contains('hidden');
  menu.classList.toggle('hidden', isOpen);
  menu.classList.toggle('flex', !isOpen);
  button.setAttribute('aria-expanded', String(!isOpen));
};

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    document.getElementById('mobile-menu-button')?.setAttribute('aria-expanded', 'false');
  }
}

// ─── AUTH MODAL EXPORTS ───────────────────────────────────────────────────
window.openAuthModal = function() {
  if (currentCustomer) {
    window.openProfileModal();
    return;
  }
  window.toggleAuthModal(true);
  const overlay = document.getElementById('authModalOverlay');
  if (overlay) {
    overlay.style.setProperty('display', 'flex', 'important');
  }
  document.body.style.overflow = 'hidden';
};

window.closeAuthModal = function() {
  const overlay = document.getElementById('authModalOverlay');
  if (overlay) overlay.style.setProperty('display', 'none', 'important');
  document.body.style.overflow = '';
  if (document.getElementById('authError')) document.getElementById('authError').style.display = 'none';
  if (document.getElementById('authName')) document.getElementById('authName').value = '';
  if (document.getElementById('authEmail')) document.getElementById('authEmail').value = '';
  if (document.getElementById('authPassword')) document.getElementById('authPassword').value = '';
};

window.toggleAuthModal = function(loginMode) {
  isLoginMode = loginMode;
  
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const authNameRow = document.getElementById('authNameRow');
  const authModalTitle = document.getElementById('authModalTitle');
  const authModalSubtitle = document.getElementById('authModalSubtitle');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authSwitchText = document.getElementById('authSwitchText');
  const authSwitchBtn = document.getElementById('authSwitchBtn');
  const authError = document.getElementById('authError');

  if (tabLogin) {
    tabLogin.style.background = loginMode ? '#d4a339' : 'transparent';
    tabLogin.style.color = loginMode ? '#0f1a12' : '#9ca3af';
  }
  if (tabRegister) {
    tabRegister.style.background = loginMode ? 'transparent' : '#d4a339';
    tabRegister.style.color = loginMode ? '#9ca3af' : '#0f1a12';
  }
  if (authNameRow) authNameRow.style.display = loginMode ? 'none' : 'block';
  if (authModalTitle) authModalTitle.textContent = loginMode ? 'Welcome Back' : 'Create Account';
  if (authModalSubtitle) authModalSubtitle.textContent = loginMode ? 'Sign in to your InjiManjal account' : 'Join the InjiManjal family';
  if (authSubmitBtn) authSubmitBtn.textContent = loginMode ? 'Sign In' : 'Create Account';
  if (authSwitchText) authSwitchText.textContent = loginMode ? "Don't have an account?" : 'Already have an account?';
  
  if (authSwitchBtn) {
    authSwitchBtn.textContent = loginMode ? 'Create one' : 'Sign in';
  }
  if (authError) authError.style.display = 'none';
};

window.handleAuthRequest = async function() {
  const email = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;
  const name = document.getElementById('authName')?.value.trim();
  const errEl = document.getElementById('authError');
  const btn = document.getElementById('authSubmitBtn');

  if (errEl) errEl.style.display = 'none';

  if (!email || !password) {
    if (errEl) {
      errEl.textContent = 'Please fill in all fields.';
      errEl.style.display = 'block';
    }
    return;
  }
  if (!isLoginMode && (!name || name.length < 2)) {
    if (errEl) {
      errEl.textContent = 'Please enter your full name.';
      errEl.style.display = 'block';
    }
    return;
  }

  if (btn) {
    btn.textContent = isLoginMode ? 'Signing in...' : 'Creating account...';
    btn.disabled = true;
  }

  try {
    const endpoint = isLoginMode ? '/api/shop/auth/login' : '/api/shop/auth/register';
    const body = isLoginMode ? { email, password } : { name, email, password };

    const res = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      if (errEl) {
        errEl.textContent = data.error || 'Something went wrong. Try again.';
        errEl.style.display = 'block';
      }
      return;
    }

    currentCustomer = data.customer;
    updateNavForLoggedInUser();
    window.closeAuthModal();

  } catch (err) {
    if (errEl) {
      errEl.textContent = 'Network error. Make sure you are connected.';
      errEl.style.display = 'block';
    }
  } finally {
    if (btn) {
      btn.textContent = isLoginMode ? 'Sign In' : 'Create Account';
      btn.disabled = false;
    }
  }
};

async function handleLogout() {
  await fetch('/api/shop/auth/logout', { method: 'POST', credentials: 'include' });
  currentCustomer = null;
  const btn = document.getElementById('navAuthBtn');
  if (btn) {
    btn.textContent = 'Login';
    btn.classList.remove('logged-in');
  }
}

window.openProfileModal = async function() {
  if (!currentCustomer) return window.openAuthModal();

  const overlay = document.getElementById('profileModalOverlay');
  const details = document.getElementById('profileDetails');
  const orders = document.getElementById('profileOrders');
  if (!overlay || !details || !orders) return;

  details.innerHTML = `
    <div class="account-detail"><span>Name</span><strong>${escapeHtml(currentCustomer.name)}</strong></div>
    <div class="account-detail"><span>Email</span><strong>${escapeHtml(currentCustomer.email)}</strong></div>`;
  orders.textContent = 'Loading your orders...';
  overlay.style.setProperty('display', 'flex', 'important');
  document.body.style.overflow = 'hidden';

  try {
    const response = await fetchWithCustomerSession('/api/shop/orders/my');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load orders.');

    if (!data.orders?.length) {
      orders.innerHTML = '<p class="account-empty">No orders yet. Your completed orders will appear here.</p>';
      return;
    }

    orders.innerHTML = data.orders.map(order => `
      <article class="account-order">
        <div><strong>Order #${escapeHtml(order.id)}</strong><span>${new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
        <div><strong>₹${Number(order.total).toFixed(2)}</strong><span>${escapeHtml(order.status)}</span></div>
      </article>`).join('');
  } catch (error) {
    orders.innerHTML = `<p class="account-error">${escapeHtml(error.message)}</p>`;
  }
};

window.closeProfileModal = function() {
  document.getElementById('profileModalOverlay')?.style.setProperty('display', 'none', 'important');
  document.body.style.overflow = '';
};

window.signOutFromProfile = async function() {
  await handleLogout();
  window.closeProfileModal();
};

function updateNavForLoggedInUser() {
  const btn = document.getElementById('navAuthBtn');
  if (!btn) return;
  const firstName = currentCustomer?.name?.split(' ')[0] || 'Account';
  btn.textContent = `Hi, ${firstName} ▾`;
  btn.classList.add('logged-in');
}

async function restoreCustomerSession() {
  try {
    const response = await fetchWithCustomerSession('/api/shop/auth/me');
    if (!response.ok) return;
    const data = await response.json();
    currentCustomer = data.customer;
    updateNavForLoggedInUser();
  } catch (error) {
    // A missing or expired session simply leaves the visitor signed out.
  }
}

// ─── HYDRATION FUNCTIONS ──────────────────────────────────────────────────
function buildCatalogProduct(live) {
  const meta = CATALOG_META[live.slug] || {};
  const category = String(live.category || 'organic').toLowerCase();
  const price = Number(live.sale_price || live.price || 0);
  const marketPrice = Math.max(Number(live.price || price), Number(meta.marketPrice || price));
  const stock = Number(live.stock || 0);
  return {
    id: live.id,
    name: live.name || 'Product',
    slug: live.slug || String(live.id),
    category,
    emoji: meta.emoji || CATEGORY_EMOJI[category] || CATEGORY_EMOJI.organic,
    price,
    marketPrice,
    unit: meta.unit || 'unit',
    badge: stock > 0 ? (meta.badge || 'Available') : 'Out of Stock',
    tags: Array.isArray(meta.tags) && meta.tags.length ? meta.tags : [category, stock > 0 ? 'In Stock' : 'Out of Stock'],
    imageUrl: live.image_url || '',
    stock,
  };
}

async function loadLiveCatalog() {
  try {
    const response = await fetch('/api/shop/products');
    if (!response.ok) return [];
    const data = await response.json();
    const liveProducts = Array.isArray(data.products) ? data.products : [];
    return liveProducts.map(buildCatalogProduct);
  } catch (error) {
    return [];
  }
}

async function hydrateShopAndPricing() {
  activeCatalog = await loadLiveCatalog();

  const grid = document.getElementById('products-grid');
  const tableBody = document.getElementById('pricing-table-rows');

  if (grid) {
    if (activeCatalog.length === 0) {
      grid.innerHTML = '<div class="products-empty">Products are being updated. Please check back soon.</div>';
    } else {
      grid.innerHTML = activeCatalog.map(prod => {
        const savePercent = prod.marketPrice > prod.price
          ? Math.round(((prod.marketPrice - prod.price) / prod.marketPrice) * 100)
          : 0;
        return `
        <div class="product-card bg-teal-950/30 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-md flex flex-col justify-between" data-cat="${prod.category}">
          <div class="h-44 bg-gradient-to-br from-emerald-950 to-amber-950 flex items-center justify-center text-4xl relative overflow-hidden">
            ${prod.imageUrl ? '<img src="' + escapeHtml(prod.imageUrl) + '" alt="' + escapeHtml(prod.name) + '" class="product-image">' : prod.emoji}
            <div class="product-badge absolute top-3 right-3 bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">${prod.badge}</div>
          </div>
          <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
            <div class="space-y-1">
              <div class="text-[10px] tracking-widest uppercase text-amber-400 font-semibold">${prod.category}</div>
              <h3 class="font-serif text-base text-white font-medium leading-tight">${escapeHtml(prod.name)}</h3>
              <div class="flex flex-wrap gap-1.5 pt-1">
                ${prod.tags.map(t => `<span class="text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between pt-2 pb-3">
                <span class="text-white font-serif text-base font-bold">₹${prod.price} <small class="text-[10px] text-white/50 font-sans font-normal">/ ${escapeHtml(prod.unit)}</small></span>
                <span class="text-xs text-white/40 line-through">₹${prod.marketPrice}</span>
                <span class="text-[10px] bg-red-800 text-white font-bold px-2 py-0.5 rounded-md">Save ${savePercent}%</span>
              </div>
              <button class="btn-primary w-full py-2 text-xs rounded-xl font-semibold" ${prod.stock <= 0 ? 'disabled' : ''} onclick="triggerCheckoutFlow(${prod.id})">${prod.stock <= 0 ? 'Out of Stock' : '🛒 Buy Now — ₹' + prod.price}</button>
            </div>
          </div>
        </div>`;
      }).join('');
    }
  }

  if (tableBody) {
    if (activeCatalog.length === 0) {
      tableBody.innerHTML = '<div class="pricing-empty">Products are being updated.</div>';
    } else {
      tableBody.innerHTML = activeCatalog.map(prod => {
        const savePercent = prod.marketPrice > prod.price
          ? Math.round(((prod.marketPrice - prod.price) / prod.marketPrice) * 100)
          : 0;
        return `
        <div class="pricing-row">
          <div class="pricing-product">
            <span class="p-ico">${prod.emoji}</span>
            <div class="p-details">
              <strong>${escapeHtml(prod.name)}</strong>
              <span>${escapeHtml(prod.unit)} · Sourced Direct</span>
            </div>
          </div>
          <span class="store-price">₹${prod.marketPrice}</span>
          <span class="im-price">₹${prod.price}</span>
          <span class="savings-badge">Save ${savePercent}%</span>
        </div>`;
      }).join('');
    }
  }
}
window.triggerCheckoutFlow = async function(productId) {
  if (!currentCustomer) {
    window.openAuthModal();
    return;
  }
  const prod = activeCatalog.find(p => p.id === productId);
  if (!prod) return;
  if (prod.stock <= 0) {
    alert('This product is currently out of stock.');
    return;
  }

  pendingCheckoutProductId = productId;
  window.openCheckoutAddressModal(prod);
};

window.openCheckoutAddressModal = function(product) {
  const overlay = document.getElementById('checkoutModalOverlay');
  const productName = document.getElementById('checkoutProductName');
  const error = document.getElementById('checkoutError');
  if (!overlay || !productName) return;
  productName.textContent = `${product.name} - ₹${product.price}`;
  if (error) error.style.display = 'none';
  overlay.style.setProperty('display', 'flex', 'important');
  document.body.style.overflow = 'hidden';
};

window.closeCheckoutAddressModal = function() {
  document.getElementById('checkoutModalOverlay')?.style.setProperty('display', 'none', 'important');
  document.body.style.overflow = '';
};

window.submitCheckoutAddress = async function() {
  const product = activeCatalog.find(p => p.id === pendingCheckoutProductId);
  const error = document.getElementById('checkoutError');
  const button = document.getElementById('checkoutSubmitBtn');
  if (!product || !currentCustomer) return;

  const address = {
    label: document.getElementById('checkoutLabel')?.value.trim() || 'Home',
    line1: document.getElementById('checkoutLine1')?.value.trim(),
    line2: document.getElementById('checkoutLine2')?.value.trim() || undefined,
    city: document.getElementById('checkoutCity')?.value.trim(),
    state: document.getElementById('checkoutState')?.value.trim(),
    pincode: document.getElementById('checkoutPincode')?.value.trim(),
    phone: document.getElementById('checkoutPhone')?.value.trim(),
    is_default: true,
  };

  if (!address.line1 || !address.city || !address.state || !address.pincode || !address.phone) {
    if (error) {
      error.textContent = 'Please complete all delivery address fields.';
      error.style.display = 'block';
    }
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = 'Preparing payment...';
  }

  try {
    const addressResponse = await fetchWithCustomerSession('/api/shop/addresses/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
    });
    const addressData = await addressResponse.json();
    if (!addressResponse.ok) throw new Error(addressData.error || 'Could not save delivery address.');

    const orderRes = await fetchWithCustomerSession('/api/shop/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address_id: addressData.address.id, items: [{ product_id: product.id, quantity: 1 }] }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed.');

    const options = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: 'INR',
      name: 'InjiManjal',
      description: product.name,
      image: 'https://i.postimg.cc/7LFr3pbh/logo-Inji-Manjal.png',
      order_id: orderData.razorpay_order_id,
      prefill: { name: currentCustomer.name, email: currentCustomer.email },
      theme: { color: '#1e6e45' },
      handler: async function (response) {
        const verifyRes = await fetchWithCustomerSession('/api/shop/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id:              orderData.order_id,
            razorpay_order_id:     response.razorpay_order_id,
            razorpay_payment_id:   response.razorpay_payment_id,
            razorpay_signature:    response.razorpay_signature,
          }),
        });
        if (verifyRes.ok) {
          alert('🌿 Order placed! You will receive a confirmation email shortly.');
        } else {
          const vd = await verifyRes.json();
          alert('⚠️ Payment verification failed: ' + (vd.error || 'Contact support.'));
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function(resp) { alert('Payment failed: ' + resp.error.description); });
    rzp.open();
  } catch (err) {
    if (error) {
      error.textContent = err.message;
      error.style.display = 'block';
    }
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = 'Continue to Payment';
    }
  }
};

window.handleContactSubmit = function(btn) {
  if (!btn) return;
  btn.textContent = '✓ Message Sent!';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = 'Send Message →'; btn.disabled = false; }, 3000);
};

var observerInstance = null;
function initScrollAnimations() {
  if (observerInstance) observerInstance.disconnect();
  observerInstance = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observerInstance.observe(el));
}

// ─── DOM INITIATOR SAFE ASYNC LAYER ───────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  hydrateShopAndPricing().then(initScrollAnimations);
  restoreCustomerSession();
  
  setTimeout(() => {
    const introScreen = document.getElementById('intro-screen');
    if (introScreen && introScreen.style.display !== 'none') window.launchSite();
  }, 3000);

  document.getElementById('authModalOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) window.closeAuthModal();
  });
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeAuthModal(); });
