/* ============================================================
   AMIGO eSIM — GLOBAL JAVASCRIPT
   SPA navigation, scroll reveal, copy-to-clipboard, mobile nav,
   dropdown, URL routing, popstate (browser back/forward)
   ============================================================ */

// ── URL SLUG MAPS ──────────────────────────────────────────
var slugMap = {
  'home'           : '/',
  'offer'          : '/offer',
  'pricing'        : '/pricing',
  'review'         : '/review',
  'alternatives'   : '/alternatives',
  'affiliate'      : '/affiliate',
  'privacy'        : '/privacy',
  'blog'           : '/blog',
  'blog-esim-europe': '/blog/esim-europe',
  'blog-esim-japan' : '/blog/esim-japan',
  'blog-esim-usa'   : '/blog/esim-usa',
  'guide1'         : '/guide/activate-iphone-android',
  'guide2'         : '/guide/esim-vs-roaming-vs-local-sim',
  'guide3'         : '/guide/how-to-choose-right-plan'
};

var reverseSlugMap = {
  ''                               : 'home',
  '/'                              : 'home',
  '/home'                          : 'home',
  '/offer'                         : 'offer',
  '/pricing'                       : 'pricing',
  '/review'                        : 'review',
  '/alternatives'                  : 'alternatives',
  '/affiliate'                     : 'affiliate',
  '/privacy'                       : 'privacy',
  '/blog'                          : 'blog',
  '/blog/esim-europe'              : 'blog-esim-europe',
  '/blog/esim-japan'               : 'blog-esim-japan',
  '/blog/esim-usa'                 : 'blog-esim-usa',
  '/guide/activate-iphone-android' : 'guide1',
  '/guide/esim-vs-roaming-vs-local-sim': 'guide2',
  '/guide/how-to-choose-right-plan': 'guide3'
};

// Legacy flat slugs for old bookmarks (/guide1, /blog-esim-europe, etc.)
var legacyMap = {
  'guide1'          : 'guide1',
  'guide2'          : 'guide2',
  'guide3'          : 'guide3',
  'blog-esim-europe': 'blog-esim-europe',
  'blog-esim-japan' : 'blog-esim-japan',
  'blog-esim-usa'   : 'blog-esim-usa'
};

var simplePages = ['home','offer','pricing','review','alternatives','affiliate','privacy','blog'];

// ── ROUTING: URL → page name ───────────────────────────────
function getPageFromURL() {
  var pathname = window.location.pathname.replace(/\.html?$/, '');

  // 1. Exact match on full pathname
  if (reverseSlugMap[pathname]) return reverseSlugMap[pathname];

  // 2. Simple single-segment: /pricing → pricing
  var flat = pathname.replace(/^\//, '');
  if (simplePages.includes(flat)) return flat;

  // 3. Legacy flat slugs
  if (legacyMap[flat]) return legacyMap[flat];

  // 4. Hash fallback for very old bookmarks
  var hash = window.location.hash.replace('#', '');
  if (hash) {
    if (simplePages.includes(hash)) return hash;
    if (legacyMap[hash]) return legacyMap[hash];
  }

  return 'home';
}

// ── SPA NAVIGATION ─────────────────────────────────────────
function navigate(page) {
  // Hide all sections, show target
  document.querySelectorAll('.page-section').forEach(function(el) {
    el.classList.remove('active');
  });
  var target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  // Update nav active states
  document.querySelectorAll('.hnav-link[data-page]').forEach(function(el) {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Guides dropdown button active state
  var guideBtn  = document.querySelector('.hnav-dropdown-btn');
  var isGuide   = ['guide1','guide2','guide3'].includes(page);
  var isBlog    = ['blog','blog-esim-europe','blog-esim-japan','blog-esim-usa'].includes(page);
  var blogNav   = document.querySelector('.hnav-link[data-page="blog"]');
  if (blogNav)  blogNav.classList.toggle('active', isBlog);
  if (guideBtn) guideBtn.classList.toggle('active', isGuide);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-run scroll reveal for newly active page
  setTimeout(runReveal, 100);

  // Push URL
  var slug = slugMap[page] || '/' + page;
  try { history.pushState({ page: page }, '', slug); } catch(e) {}
}

// ── DROPDOWN (Guides menu) ─────────────────────────────────
function toggleDropdown(event) {
  event.stopPropagation();
  var dd = document.getElementById('guidesDropdown');
  if (dd) dd.classList.toggle('open');
}

function closeDropdown() {
  var dd = document.getElementById('guidesDropdown');
  if (dd) dd.classList.remove('open');
}

// Close dropdown on outside click
document.addEventListener('click', function(e) {
  var dd = document.getElementById('guidesDropdown');
  if (dd && !dd.contains(e.target)) closeDropdown();
});

// ── MOBILE NAV ─────────────────────────────────────────────
function toggleMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (nav) nav.classList.toggle('open');
}

function closeMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open');
}

// ── COPY TO CLIPBOARD ──────────────────────────────────────
function copyCode(code, btn) {
  navigator.clipboard.writeText(code).then(function() {
    var orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background  = '#e8005c';
    btn.style.color       = '#fff';
    btn.style.borderColor = '#e8005c';
    setTimeout(function() {
      btn.textContent     = orig;
      btn.style.background  = '';
      btn.style.color       = '';
      btn.style.borderColor = '';
    }, 1800);
  });
}

// ── SCROLL REVEAL ──────────────────────────────────────────
function runReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Observe all reveal elements inside the currently active page
  document.querySelectorAll(
    '.page-section.active .reveal, ' +
    '.page-section.active .reveal-left, ' +
    '.page-section.active .reveal-right'
  ).forEach(function(el) {
    el.classList.remove('visible');
    obs.observe(el);
  });
}

// ── INIT ───────────────────────────────────────────────────
(function init() {
  // Handle 404.html SPA redirect query param (?p=/pricing)
  var params = new URLSearchParams(window.location.search);
  var redirectPath = params.get('p');
  if (redirectPath) {
    window.history.replaceState(null, '', redirectPath);
  }

  // /home → / canonical redirect
  if (window.location.pathname === '/home') {
    window.history.replaceState(null, '', '/');
  }

  // Navigate to the correct page based on current URL
  navigate(getPageFromURL());

  // Handle browser back / forward
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
      navigate(e.state.page);
    } else {
      navigate(getPageFromURL());
    }
  });
})();
