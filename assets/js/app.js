/* ============================================================
   AMIGO eSIM — app.js (for separate HTML pages only)
   The SPA uses its own inline script — this file handles
   the standalone pages: review.html, pricing.html, etc.
   ============================================================ */

const AFFILIATE_URL = 'https://esimbros.com/go/amigo-esim';
const COUPON_CODE   = 'ESIMDUDE';

/* ── Copy coupon code ──────────────────────────────────────── */
function copyCode(code, btn) {
  const codeVal = (typeof code === 'string') ? code : COUPON_CODE;
  const button  = btn || (typeof code === 'object' ? code : null);
  navigator.clipboard.writeText(codeVal).then(() => {
    if (button) {
      const orig = button.textContent;
      button.textContent = '✓ Copied!';
      button.style.background = '#e8005c';
      button.style.color = '#fff';
      button.style.borderColor = '#e8005c';
      setTimeout(() => {
        button.textContent = orig;
        button.style.background = '';
        button.style.color = '';
        button.style.borderColor = '';
      }, 1800);
    }
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = codeVal;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

/* ── Dropdown toggle ───────────────────────────────────────── */
function toggleDropdown(ev) {
  if (ev && typeof ev.preventDefault === 'function') {
    ev.preventDefault();
    ev.stopPropagation();
    const wrap = ev.currentTarget && ev.currentTarget.closest('.hnav-dropdown');
    if (wrap) {
      const isOpen = wrap.classList.contains('open');
      document.querySelectorAll('.hnav-dropdown.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) wrap.classList.add('open');
      return;
    }
  }
  const id = typeof ev === 'string' ? ev : null;
  const menu = id ? document.getElementById(id) : null;
  const toggle = id ? document.querySelector(`[data-dropdown="${id}"]`) : null;
  if (!menu) return;
  const isOpen = menu.classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) {
    menu.classList.add('open');
    if (toggle) toggle.classList.add('open');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
  document.querySelectorAll('.dropdown-toggle').forEach(t => t.classList.remove('open'));
  document.querySelectorAll('.hnav-dropdown.open').forEach(d => d.classList.remove('open'));
}

/* ── Mobile nav ────────────────────────────────────────────── */
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const ham = document.getElementById('hamburger') || document.querySelector('.header-hamburger');
  if (!nav) return;
  const isOpen = nav.classList.contains('open');
  nav.classList.toggle('open', !isOpen);
  if (ham) ham.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  const ham = document.getElementById('hamburger') || document.querySelector('.header-hamburger');
  if (nav) nav.classList.remove('open');
  if (ham) ham.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Device tabs ───────────────────────────────────────────── */
function switchTab(tabId) {
  document.querySelectorAll('.device-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.device-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById(tabId);
  const tab   = document.querySelector(`[data-tab="${tabId}"]`);
  if (panel) panel.classList.add('active');
  if (tab)   tab.classList.add('active');
}

/* ── FAQ accordion ─────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Active nav link ───────────────────────────────────────── */
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('a.nav-pill, .dropdown-menu a, #mobileNav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && path.endsWith(href.replace('../', '').replace('./', ''))) {
      a.classList.add('active');
    }
  });
}

/* ── Reveal on scroll ──────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Smooth scroll ─────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Sticky header shadow ──────────────────────────────────── */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ── Close dropdowns on outside click ─────────────────────── */
function initOutsideClick() {
  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown') && !e.target.closest('[data-dropdown]') && !e.target.closest('.hnav-dropdown')) {
      closeAllDropdowns();
    }
  });
}

/* ── Update affiliate links ────────────────────────────────── */
function updateAffiliateLinks() {
  document.querySelectorAll('a[href*="amigoesim.pxf.io"]').forEach(a => {
    a.href = AFFILIATE_URL;
  });
}

/* ── Rating bar animation ──────────────────────────────────── */
function initRatingBars() {
  document.querySelectorAll('.bar-fill, .mock-score-bar-fill').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = w; }, 300);
  });
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  setActiveNav();
  initReveal();
  initSmoothScroll();
  initHeaderScroll();
  initOutsideClick();
  updateAffiliateLinks();
  initRatingBars();

  /* Hamburger (pages without inline onclick use id="hamburger") */
  const ham = document.getElementById('hamburger');
  if (ham) ham.addEventListener('click', toggleMobileNav);

  /* Mobile nav close on link click */
  document.querySelectorAll('#mobileNav a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });

  /* Copy buttons */
  document.querySelectorAll('.coupon-copy, .deal-card-footer-copy, .pill-copy').forEach(btn => {
    btn.addEventListener('click', () => copyCode(btn.dataset.code || COUPON_CODE, btn));
  });
});
