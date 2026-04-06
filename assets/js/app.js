/* ============================================================
   AMIGO ESIM — Unified JavaScript
   Works for: SPA (amigo-index.html) + all static pages
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   CONSTANTS
   ---------------------------------------------------------- */
const AFFILIATE_URL = 'https://esimbros.com/go/amigo-esim';
const COUPON_CODE   = 'ESIMDUDE';

/* ----------------------------------------------------------
   UTILITY: detect whether we're in SPA or static page
   ---------------------------------------------------------- */
const IS_SPA = !!document.querySelector('.page-section');

/* ----------------------------------------------------------
   1. AFFILIATE LINK REWRITER
   Replaces any old affiliate URLs with the new one.
   ---------------------------------------------------------- */
function rewriteAffiliateLinks() {
  const OLD_PATTERNS = [
    'amigoesim.pxf.io',
    'amigo-esim.pxf.io',
    'amigoesim.com/go',
    'go.amigo'
  ];

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (OLD_PATTERNS.some(p => href.includes(p))) {
      link.setAttribute('href', AFFILIATE_URL);
      link.setAttribute('rel', 'nofollow noopener sponsored');
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    }
    // Also tag existing correct affiliate links
    if (href && href.includes('esimbros.com/go/amigo-esim')) {
      link.setAttribute('rel', 'nofollow noopener sponsored');
    }
  });
}

/* ----------------------------------------------------------
   2. COUPON CODE COPY
   ---------------------------------------------------------- */
function copyCode(target) {
  let text = COUPON_CODE;

  // target can be the code string itself or an element id
  if (target && typeof target === 'string' && target !== COUPON_CODE) {
    const el = document.getElementById(target);
    if (el) text = el.textContent.trim();
  }

  const btn = event && event.currentTarget ? event.currentTarget : null;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => flashCopied(btn));
  } else {
    // Fallback for older browsers / http
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    flashCopied(btn);
  }
}

function flashCopied(btn) {
  if (!btn) {
    // Try to find whichever copy button was just clicked
    btn = document.querySelector('.copy-btn, .btn-copy');
  }
  if (!btn) return;

  const orig = btn.textContent;
  btn.textContent = '✓ Copied!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = orig;
    btn.classList.remove('copied');
  }, 2000);
}

// Expose globally for inline onclick= usage
window.copyCode = function(target) {
  // When called via inline onclick, 'event' is the click event
  let text = COUPON_CODE;
  if (target && typeof target === 'string') {
    const el = document.getElementById(target);
    if (el) text = el.textContent.trim();
  }

  // Find the closest button
  let btn = null;
  if (window.event) {
    btn = window.event.target.closest('button') || window.event.target;
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => flashCopied(btn));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    flashCopied(btn);
  }
};

/* ----------------------------------------------------------
   3. SPA NAVIGATION
   Only active when IS_SPA is true.
   ---------------------------------------------------------- */
const PAGE_SLUG_MAP = {
  'home':             '/',
  'review':           '/review',
  'pricing':          '/pricing',
  'alternatives':     '/alternatives',
  'blog':             '/blog',
  'blog-esim-europe': '/blog/best-esim-europe',
  'blog-esim-japan':  '/blog/best-esim-japan',
  'blog-esim-usa':    '/blog/best-esim-usa',
  'guide-activate':   '/guides/activate-iphone-android',
  'guide-vs-roaming': '/guides/esim-vs-roaming-vs-local-sim',
  'guide-choose':     '/guides/how-to-choose-right-plan',
  'disclosure':       '/disclosure',
  'privacy':          '/privacy',
};

function navigate(pageId) {
  if (!IS_SPA) return;

  // Hide all page sections
  document.querySelectorAll('.page-section').forEach(el => {
    el.classList.remove('active');
  });

  // Show target page
  const target = document.getElementById('page-' + pageId)
               || document.querySelector('[data-page="' + pageId + '"]');
  if (target) {
    target.classList.add('active');
  }

  // Update nav active state
  document.querySelectorAll('.nav-btn[data-page], .nav-btn[onclick]').forEach(btn => {
    btn.classList.remove('active');
    const btnPage = btn.getAttribute('data-page')
                 || (btn.getAttribute('onclick') || '').match(/navigate\(['"]([^'"]+)['"]\)/)?.[1];
    if (btnPage === pageId) btn.classList.add('active');
  });

  // Update URL without reload
  const slug = PAGE_SLUG_MAP[pageId] || '/';
  try { history.pushState({ page: pageId }, '', slug); } catch (_) {}

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger reveal animations for new page
  setTimeout(runReveal, 100);

  // Animate rating bars on review page
  if (pageId === 'review') {
    setTimeout(animateRatingBars, 300);
  }

  // Close mobile nav if open
  closeMobileNav();
}

// Expose globally
window.navigate = navigate;

/* ----------------------------------------------------------
   4. MOBILE NAV TOGGLE (SPA + static)
   ---------------------------------------------------------- */
function openMobileNav() {
  const nav = document.querySelector('.mobile-nav, .mobile-drawer');
  if (nav) {
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileNav() {
  const nav = document.querySelector('.mobile-nav, .mobile-drawer');
  if (nav) {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function toggleMobileNav() {
  const nav = document.querySelector('.mobile-nav, .mobile-drawer');
  if (nav && nav.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav  = closeMobileNav;

/* ----------------------------------------------------------
   5. DROPDOWN MENUS (hover + click for touch)
   ---------------------------------------------------------- */
function initDropdowns() {
  document.querySelectorAll('.spa-nav-dropdown, .nav-dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('button, .nav-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        // Close all dropdowns first
        document.querySelectorAll('.spa-nav-dropdown.open, .nav-dropdown.open').forEach(d => {
          d.classList.remove('open');
        });
        if (!isOpen) dropdown.classList.add('open');
      });
    }
  });

  // Close on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.spa-nav-dropdown.open, .nav-dropdown.open').forEach(d => {
      d.classList.remove('open');
    });
  });
}

/* ----------------------------------------------------------
   6. FAQ ACCORDION
   ---------------------------------------------------------- */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q, .faq-question');
    if (!q) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all other items in same group
      const group = item.closest('.faq-list, .faq-accordion');
      if (group) {
        group.querySelectorAll('.faq-item.open').forEach(openItem => {
          if (openItem !== item) openItem.classList.remove('open');
        });
      }
      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ----------------------------------------------------------
   7. DEVICE TABS (iPhone / Android)
   ---------------------------------------------------------- */
function initDeviceTabs() {
  document.querySelectorAll('.device-tabs, .tab-group').forEach(tabGroup => {
    const btns    = tabGroup.querySelectorAll('.tab-btn, .device-tab');
    const section = tabGroup.closest('section') || tabGroup.parentElement;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab') || btn.getAttribute('data-target');

        // Update active button
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show matching content
        const contents = section ? section.querySelectorAll('.tab-content, .device-content') : [];
        contents.forEach(c => {
          c.classList.remove('active');
          if (c.getAttribute('data-tab') === target || c.id === target) {
            c.classList.add('active');
          }
        });
      });
    });
  });
}

/* ----------------------------------------------------------
   8. SCROLL REVEAL
   ---------------------------------------------------------- */
function runReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    observer.observe(el);
  });
}

/* ----------------------------------------------------------
   9. RATING BAR ANIMATION
   ---------------------------------------------------------- */
function animateRatingBars() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const targetWidth = bar.getAttribute('data-width') || bar.style.width || '0%';
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 50);
    });
  });
}

/* ----------------------------------------------------------
   10. HEADER SCROLL SHADOW
   ---------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.spa-header, .site-header, .main-nav');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,.08)';
    } else {
      header.style.boxShadow = '';
    }
  }, { passive: true });
}

/* ----------------------------------------------------------
   11. ACTIVE NAV LINK (static pages only)
   ---------------------------------------------------------- */
function initActiveNavLink() {
  if (IS_SPA) return;

  const path = window.location.pathname;
  document.querySelectorAll('.hnav-link, .header-nav a, .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (path === href || (href !== '/' && path.startsWith(href.replace(/\.html$/, '')))) {
      link.classList.add('active');
    }
  });
}

/* ----------------------------------------------------------
   12. SMOOTH SCROLL for anchor links
   ---------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement)
                          .getPropertyValue('--header-h')) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ----------------------------------------------------------
   13. MOBILE NAV OVERLAY — close on backdrop click
   ---------------------------------------------------------- */
function initMobileNavClose() {
  const nav = document.querySelector('.mobile-nav, .mobile-drawer');
  if (!nav) return;

  nav.addEventListener('click', (e) => {
    if (e.target === nav) closeMobileNav();
  });

  const closeBtn = nav.querySelector('.close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);

  const hamburger = document.querySelector('.mobile-menu-btn, .hamburger, .mobile-toggle');
  if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
}

/* ----------------------------------------------------------
   14. POPSTATE — handle browser back/forward in SPA
   ---------------------------------------------------------- */
function initPopstate() {
  if (!IS_SPA) return;

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
      navigate(e.state.page);
    } else {
      navigate('home');
    }
  });
}

/* ----------------------------------------------------------
   INIT — run everything on DOM ready
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  rewriteAffiliateLinks();
  initDropdowns();
  initFAQ();
  initDeviceTabs();
  initHeaderScroll();
  initActiveNavLink();
  initSmoothScroll();
  initMobileNavClose();
  initPopstate();

  // Initial reveal pass
  runReveal();

  // Animate rating bars if on review page or review section is visible
  if (document.querySelector('.bar-fill')) {
    setTimeout(animateRatingBars, 400);
  }

  // SPA: activate home page by default if nothing is active
  if (IS_SPA) {
    const hasActive = document.querySelector('.page-section.active');
    if (!hasActive) {
      const home = document.getElementById('page-home')
                 || document.querySelector('.page-section');
      if (home) home.classList.add('active');
    }

    // Mark home nav button as active
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const page = btn.getAttribute('data-page')
                || (btn.getAttribute('onclick') || '').match(/navigate\(['"]([^'"]+)['"]\)/)?.[1];
      if (page === 'home') btn.classList.add('active');
    });
  }
});
