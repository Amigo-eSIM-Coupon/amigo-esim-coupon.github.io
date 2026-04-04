/* ============================================================
   AMIGO eSIM DEALS – Global JavaScript
   assets/js/app.js
   ============================================================ */

/* ── Copy coupon code to clipboard ── */
function copyCode(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text.trim()).then(() => {
    const btn = el.nextElementSibling;
    if (btn && btn.classList.contains('copy-btn')) {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('copied');
      }, 2000);
    }
  }).catch(() => {
    /* Fallback for older browsers */
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  });
}

/* ── Mobile nav toggle ── */
function toggleMobileNav() {
  const nav  = document.getElementById('mobileNav');
  const btn  = document.getElementById('hamburger');
  if (!nav) return;
  const open = nav.classList.toggle('open');
  if (btn) btn.textContent = open ? '✕' : '☰';
}

/* ── Guides dropdown toggle ── */
function toggleDropdown() {
  const menu   = document.getElementById('dropdownMenu');
  const toggle = document.querySelector('.dropdown-toggle');
  if (!menu) return;
  const open = menu.classList.toggle('open');
  if (toggle) toggle.classList.toggle('active', open);
}

function closeDropdown() {
  const menu   = document.getElementById('dropdownMenu');
  const toggle = document.querySelector('.dropdown-toggle');
  if (menu)   menu.classList.remove('open');
  if (toggle) toggle.classList.remove('active');
}

/* Close dropdown when clicking outside */
document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.nav-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    closeDropdown();
  }
});

/* ── Set active nav link ── */
function setActiveNav() {
  const path     = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  const isGuide  = path.includes('/guides/');
  const isBlog   = path.includes('/blog/');

  document.querySelectorAll('.main-nav > a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    const hFile = href.split('/').pop();

    if (hFile === filename && !isBlog && !isGuide) {
      link.classList.add('active');
    }
    if ((isBlog  || isGuide) && (href.includes('blog') || href === 'blog/index.html')) {
      link.classList.add('active');
    }
  });

  /* Highlight dropdown toggle when on a guide page */
  if (isGuide) {
    const toggle = document.querySelector('.dropdown-toggle');
    if (toggle) toggle.classList.add('active');
  }

  /* Highlight active link inside the dropdown menu */
  document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.classList.remove('active');
    const href  = link.getAttribute('href') || '';
    const hFile = href.split('/').pop();
    if (hFile === filename) {
      link.classList.add('active');
    }
  });
}

/* ── IntersectionObserver reveal ── */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
}

/* ── Smooth scroll for on-page anchors ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ── Close mobile nav on link click ── */
function initMobileNavClose() {
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('mobileNav');
      const btn = document.getElementById('hamburger');
      if (nav) nav.classList.remove('open');
      if (btn) btn.textContent = '☰';
    });
  });
}

/* ── Sticky header shadow ── */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,95,249,0.12)'
      : '0 2px 16px rgba(0,95,249,0.07)';
  }, { passive: true });
}

/* ── Init all on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initReveal();
  initSmoothScroll();
  initMobileNavClose();
  initHeaderScroll();
});
