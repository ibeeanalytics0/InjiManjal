const introScreen = document.getElementById('intro-screen');
const mainSite = document.getElementById('main-site');

function launchSite() {
  introScreen.style.opacity = '0';
  introScreen.style.visibility = 'hidden';
  mainSite.classList.add('visible');
  setTimeout(() => {
    introScreen.style.display = 'none';
  }, 800);
}

setTimeout(() => {
  if (introScreen && introScreen.style.display !== 'none') launchSite();
}, 3000);

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active', 'page-enter');
  });
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
}

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
});

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? 'flex' : 'none';
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-button');
  if (!menu || !button) return;
  const isOpen = !menu.classList.contains('hidden');
  menu.classList.toggle('hidden', isOpen);
  menu.classList.toggle('flex', !isOpen);
  button.setAttribute('aria-expanded', String(!isOpen));
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-button');
  if (!menu || !button) return;
  if (!menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    button.setAttribute('aria-expanded', 'false');
  }
}

function handleContactSubmit(btn) {
  if (!btn) return;
  btn.textContent = '✓ Message Sent!';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  }, 3000);
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});