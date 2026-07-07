/**
 * Shared admin panel helper.
 * Wraps fetch() with credentials + automatic silent refresh on 401.
 */
async function adminFetch(url, options = {}) {
  const opts = { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...options };
  let res = await fetch(url, opts);

  if (res.status === 401) {
    const refreshRes = await fetch('/api/x/auth/refresh', { method: 'POST', credentials: 'include' });
    if (refreshRes.ok) {
      res = await fetch(url, opts); // retry original request once
    } else {
      window.location.href = 'index.html';
      return null;
    }
  }
  return res;
}

async function adminLogout() {
  await fetch('/api/x/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = 'index.html';
}

function renderTopbar(active) {
  const links = [
    ['dashboard.html', 'Dashboard'],
    ['orders.html', 'Orders'],
    ['products.html', 'Products'],
    ['customers.html', 'Customers'],
    ['settings.html', 'Settings'],
  ];
  const linksHtml = links
    .map(([href, label]) => `<a href="${href}" class="${active === href ? 'active' : ''}">${label}</a>`)
    .join('');
  document.getElementById('topbar').innerHTML = `
    <div>${linksHtml}</div>
    <div><a href="#" onclick="adminLogout(); return false;">Log out</a></div>
  `;
}
