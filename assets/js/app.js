/* ============================================================
   AMIGO eSIM — Global JS
   New affiliate link: https://esimbros.com/go/amigo-esim
   ============================================================ */

var AFFILIATE_URL = 'https://esimbros.com/go/amigo-esim';

/* ── Update all affiliate links on page load ── */
function updateAffiliateLinks() {
  document.querySelectorAll('a[href*="amigoesim.pxf.io"], a[href*="amigo-esim"]').forEach(function(a) {
    if (a.href && a.href.indexOf('esimbros.com') === -1) {
      a.href = AFFILIATE_URL;
    }
  });
}

/* ── Copy coupon code ── */
function copyCode(codeOrId, btn) {
  var text;
  var el = document.getElementById(codeOrId);
  if (el) {
    text = (el.innerText || el.textContent).trim();
  } else {
    text = String(codeOrId).trim();
  }
  navigator.clipboard.writeText(text).then(function() {
    if (!btn) return;
    var orig = btn.textContent;
    var origBg = btn.style.background;
    var origColor = btn.style.color;
    var origBorder = btn.style.borderColor;
    btn.textContent = '✓ Copied!';
    btn.style.background = '#e8005c';
    btn.style.color = '#fff';
    btn.style.borderColor = '#e8005c';
    setTimeout(function() {
      btn.textContent = orig;
      btn.style.background = origBg;
      btn.style.color = origColor;
      btn.style.borderColor = origBorder;
    }, 1800);
  }).catch(function() {
    if (el) {
      var r = document.createRange();
      r.selectNode(el);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(r);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }
  });
}

/* ── Guides dropdown ── */
function toggleDropdown(event) {
  if (event) event.stopPropagation();
  var dd = document.getElementById('dropdownMenu') || document.getElementById('guidesDropdown');
  var toggle = document.querySelector('.dropdown-toggle, .hnav-dropdown-btn');
  if (!dd) return;
  var open = dd.classList.toggle('open');
  if (toggle) toggle.classList.toggle('active', open);
}
function closeDropdown() {
  var dd = document.getElementById('dropdownMenu') || document.getElementById('guidesDropdown');
  var toggle = document.querySelector('.dropdown-toggle, .hnav-dropdown-btn');
  if (dd) dd.classList.remove('open');
  if (toggle) toggle.classList.remove('active');
}
document.addEventListener('click', function(e) {
  var dropdown = document.querySelector('.nav-dropdown, .hnav-dropdown');
  if (dropdown && !dropdown.contains(e.target)) closeDropdown();
});

/* ── Mobile nav ── */
function toggleMobileNav() {
  var nav = document.getElementById('mobileNav');
  var btn = document.getElementById('hamburger');
  if (!nav) return;
  var open = nav.classList.toggle('open');
  if (btn) btn.textContent = open ? '✕' : '☰';
}
function closeMobileNav() {
  var nav = document.getElementById('mobileNav');
  var btn = document.getElementById('hamburger');
  if (nav) nav.classList.remove('open');
  if (btn && btn.tagName === 'BUTTON') btn.textContent = '☰';
}

/* ── Active nav ── */
function setActiveNav() {
  var path = window.location.pathname;
  var filename = path.split('/').pop() || 'index.html';
  var isGuide = path.includes('/guides/');
  var isBlog = path.includes('/blog/');

  document.querySelectorAll('.main-nav > a, .nav-links-row .nav-pill, .hnav-link[data-page]').forEach(function(link) {
    link.classList.remove('active');
    var href = link.getAttribute('href') || link.dataset.page || '';
    var hFile = href.split('/').pop();
    if (hFile === filename && !isBlog && !isGuide) link.classList.add('active');
    if ((isBlog || isGuide) && (href.includes('blog') || href === 'blog/index.html')) link.classList.add('active');
  });

  if (isGuide) {
    var toggle = document.querySelector('.dropdown-toggle, .hnav-dropdown-btn');
    if (toggle) toggle.classList.add('active');
  }

  document.querySelectorAll('.dropdown-menu a, .hnav-dropdown-item').forEach(function(link) {
    link.classList.remove('active');
    var href = link.getAttribute('href') || '';
    var hFile = href.split('/').pop();
    if (hFile === filename) link.classList.add('active');
  });
}

/* ── Reveal on scroll ── */
function initReveal() {
  var items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!items.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function(el) { observer.observe(el); });
}

/* ── Smooth scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

/* ── Close mobile nav on link click ── */
function initMobileNavClose() {
  document.querySelectorAll('.mobile-nav a, .mobile-nav-link, .mobile-nav-sub').forEach(function(link) {
    link.addEventListener('click', closeMobileNav);
  });
}

/* ── Sticky header shadow ── */
function initHeaderScroll() {
  var header = document.querySelector('.site-header, .sticky-nav');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(232,0,92,0.1)'
      : '';
  }, { passive: true });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  updateAffiliateLinks();
  setActiveNav();
  initReveal();
  initSmoothScroll();
  initMobileNavClose();
  initHeaderScroll();
});
