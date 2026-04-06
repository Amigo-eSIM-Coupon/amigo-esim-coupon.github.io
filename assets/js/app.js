/* ============================================================
   AMIGO eSIM — app.js
   Handles: SPA navigation + legacy separate HTML pages
   ============================================================ */

const AFFILIATE_URL = 'https://esimbros.com/go/amigo-esim';
const COUPON_CODE   = 'ESIMDUDE';

/* ── Copy coupon code ──────────────────────────────────────── */
function copyCode(codeOrId, btn) {
  var text;

  /* Handle legacy usage: copyCode('elementId') — gets text from element */
  if (btn === undefined) {
    var el = document.getElementById(codeOrId);
    text = el ? el.textContent.trim() : codeOrId;
    btn = null;
  } else {
    /* SPA usage: copyCode('ESIMDUDE', buttonElement) */
    text = (typeof codeOrId === 'string') ? codeOrId : COUPON_CODE;
  }

  var doFeedback = function(button) {
    if (!button) return;
    var orig = button.textContent;
    var origBg = button.style.background;
    var origColor = button.style.color;
    var origBorder = button.style.borderColor;
    button.textContent = '✓ Copied!';
    button.style.background = '#e8005c';
    button.style.color = '#fff';
    button.style.borderColor = '#e8005c';
    setTimeout(function() {
      button.textContent = orig;
      button.style.background = origBg;
      button.style.color = origColor;
      button.style.borderColor = origBorder;
    }, 1800);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      doFeedback(btn);
    }).catch(function() {
      fallbackCopy(text);
      doFeedback(btn);
    });
  } else {
    fallbackCopy(text);
    doFeedback(btn);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
}

/* ── SPA: Guides dropdown ──────────────────────────────────── */
function toggleDropdown(event) {
  if (event) event.stopPropagation();
  var dd = document.getElementById('guidesDropdown');
  if (dd) dd.classList.toggle('open');
}

function closeDropdown() {
  var dd = document.getElementById('guidesDropdown');
  if (dd) dd.classList.remove('open');
}

/* ── Legacy pages: Guides dropdown ────────────────────────── */
function toggleDropdownLegacy() {
  var menu = document.getElementById('dropdownMenu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

/* ── SPA Mobile nav ────────────────────────────────────────── */
function toggleMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (!nav) return;
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

function closeMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Legacy pages: Mobile nav ─────────────────────────────── */
function toggleMobileNavLegacy() {
  var nav = document.getElementById('mobileNav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  var isOpen = nav.style.display === 'flex';
  nav.style.display = isOpen ? 'none' : 'flex';
  if (ham) ham.textContent = isOpen ? '☰' : '✕';
}

/* ── SPA Navigation ────────────────────────────────────────── */
function navigate(page) {
  /* Only runs if page-sections exist (SPA mode) */
  var sections = document.querySelectorAll('.page-section');
  if (!sections.length) return;

  sections.forEach(function(el) { el.classList.remove('active'); });
  var target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  /* Update nav active states */
  document.querySelectorAll('.hnav-link[data-page]').forEach(function(el) {
    el.classList.toggle('active', el.dataset.page === page);
  });

  var guideBtn = document.querySelector('.hnav-dropdown-btn');
  var isGuide  = ['guide1','guide2','guide3'].indexOf(page) !== -1;
  var isBlog   = ['blog','blog-esim-europe','blog-esim-japan','blog-esim-usa'].indexOf(page) !== -1;
  var blogNav  = document.querySelector('.hnav-link[data-page="blog"]');
  if (blogNav)  blogNav.classList.toggle('active', isBlog);
  if (guideBtn) guideBtn.classList.toggle('active', isGuide);

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(runReveal, 100);

  /* Update URL */
  var slugMap = {
    'home': '/', 'offer': '/offer', 'pricing': '/pricing', 'review': '/review',
    'alternatives': '/alternatives', 'affiliate': '/affiliate', 'privacy': '/privacy',
    'blog': '/blog',
    'blog-esim-europe': '/blog/esim-europe',
    'blog-esim-japan':  '/blog/esim-japan',
    'blog-esim-usa':    '/blog/esim-usa',
    'guide1': '/guide/activate-iphone-android',
    'guide2': '/guide/esim-vs-roaming-vs-local-sim',
    'guide3': '/guide/how-to-choose-right-plan'
  };
  var slug = slugMap[page] || '/' + page;
  try { history.pushState({ page: page }, '', slug); } catch(e) {}
}

/* ── Scroll Reveal ─────────────────────────────────────────── */
function runReveal() {
  var selector = '.page-section.active .reveal, .page-section.active .reveal-left, .page-section.active .reveal-right';
  var els = document.querySelectorAll(selector);

  /* Fallback for non-SPA pages */
  if (!els.length) {
    els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  }

  if (!els.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function(el) {
    el.classList.remove('visible');
    obs.observe(el);
  });
}

/* ── Active nav for legacy pages ───────────────────────────── */
function setActiveLegacyNav() {
  var path = window.location.pathname;
  document.querySelectorAll('.main-nav a').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    if (href && href !== '#' && path.indexOf(href.replace('../', '')) !== -1) {
      a.classList.add('active');
    }
  });
}

/* ── Smooth scroll ─────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Sticky header shadow ──────────────────────────────────── */
function initHeaderScroll() {
  var header = document.querySelector('.site-header, .global-header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = '';
    }
  }, { passive: true });
}

/* ── Close dropdowns on outside click ─────────────────────── */
function initOutsideClick() {
  document.addEventListener('click', function(e) {
    /* SPA dropdown */
    var spa = document.getElementById('guidesDropdown');
    if (spa && !spa.contains(e.target)) closeDropdown();

    /* Legacy dropdown */
    var leg = document.querySelector('.nav-dropdown');
    if (leg && !leg.contains(e.target)) {
      var menu = document.getElementById('dropdownMenu');
      if (menu) menu.classList.remove('open');
    }
  });
}

/* ── Update affiliate links ────────────────────────────────── */
function updateAffiliateLinks() {
  document.querySelectorAll('a[href*="amigoesim.pxf.io"]').forEach(function(a) {
    a.href = AFFILIATE_URL;
  });
}

/* ── Rating bar animation ──────────────────────────────────── */
function initRatingBars() {
  document.querySelectorAll('.rating-fill').forEach(function(bar) {
    var w = bar.style.width;
    bar.style.width = '0';
    setTimeout(function() { bar.style.width = w; }, 400);
  });
}

/* ── Mobile nav for LEGACY pages ───────────────────────────── */
function initLegacyMobileNav() {
  var ham = document.getElementById('hamburger');
  var nav = document.getElementById('mobileNav');
  if (!ham || !nav) return;

  /* Legacy pages use ☰ text button, not span-based */
  if (ham.tagName === 'BUTTON' && !ham.querySelector('span')) {
    ham.addEventListener('click', function() {
      var isOpen = nav.classList.contains('open');
      nav.classList.toggle('open', !isOpen);
      ham.textContent = isOpen ? '☰' : '✕';
    });
  }
}

/* ── SPA Init ──────────────────────────────────────────────── */
function initSPA() {
  var sections = document.querySelectorAll('.page-section');
  if (!sections.length) return; /* Not an SPA page */

  /* Hamburger for SPA */
  var ham = document.getElementById('hamburger');
  if (ham) {
    ham.addEventListener('click', toggleMobileNav);
  }

  /* Mobile nav close on link click */
  document.querySelectorAll('#mobileNav .mobile-nav-link, #mobileNav .mobile-nav-sub').forEach(function(a) {
    a.addEventListener('click', closeMobileNav);
  });

  /* Determine page from URL */
  var reverseSlugMap = {
    '': 'home', '/': 'home',
    '/home': 'home', '/offer': 'offer', '/pricing': 'pricing',
    '/review': 'review', '/alternatives': 'alternatives',
    '/affiliate': 'affiliate', '/privacy': 'privacy',
    '/blog': 'blog',
    '/blog/esim-europe': 'blog-esim-europe',
    '/blog/esim-japan':  'blog-esim-japan',
    '/blog/esim-usa':    'blog-esim-usa',
    '/guide/activate-iphone-android': 'guide1',
    '/guide/esim-vs-roaming-vs-local-sim': 'guide2',
    '/guide/how-to-choose-right-plan': 'guide3'
  };

  var legacyMap = {
    'guide1': 'guide1', 'guide2': 'guide2', 'guide3': 'guide3',
    'blog-esim-europe': 'blog-esim-europe',
    'blog-esim-japan': 'blog-esim-japan',
    'blog-esim-usa': 'blog-esim-usa'
  };

  var simplePages = ['home','offer','pricing','review','alternatives','affiliate','privacy','blog'];

  function getPageFromURL() {
    var pathname = window.location.pathname.replace(/\.html?$/, '');
    if (reverseSlugMap[pathname]) return reverseSlugMap[pathname];
    var flat = pathname.replace(/^\//, '');
    if (simplePages.indexOf(flat) !== -1) return flat;
    if (legacyMap[flat]) return legacyMap[flat];
    var hash = window.location.hash.replace('#', '');
    if (hash) {
      if (simplePages.indexOf(hash) !== -1) return hash;
      if (legacyMap[hash]) return legacyMap[hash];
    }
    return 'home';
  }

  navigate(getPageFromURL());

  window.addEventListener('popstate', function(e) {
    navigate(e.state && e.state.page ? e.state.page : getPageFromURL());
  });
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  /* Universal */
  updateAffiliateLinks();
  initSmoothScroll();
  initHeaderScroll();
  initOutsideClick();
  initRatingBars();
  setActiveLegacyNav();
  initLegacyMobileNav();

  /* Copy buttons — both pill-copy, coupon-copy, deal-card-footer-copy */
  document.querySelectorAll('.coupon-copy, .pill-copy, .deal-card-footer-copy').forEach(function(btn) {
    btn.addEventListener('click', function() {
      copyCode(btn.dataset.code || COUPON_CODE, btn);
    });
  });

  /* SPA init (only runs on amigo-index.html) */
  initSPA();

  /* Non-SPA reveal (runs on legacy pages) */
  var hasSPA = document.querySelectorAll('.page-section').length > 0;
  if (!hasSPA) {
    runReveal();
  }
});
