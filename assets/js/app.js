/* ============================================================
   AMIGO eSIM — Global JS
   Matches SPA function names exactly:
   copyCode(), toggleDropdown(), closeDropdown(),
   toggleMobileNav(), closeMobileNav(), setActiveNav(),
   initReveal(), initSmoothScroll()
   ============================================================ */

/* ── Copy code to clipboard ── */
function copyCode(elementId, btn) {
  // Handle both (elementId, btn) and (codeString, btn) signatures
  var text;
  var el = document.getElementById(elementId);
  if (el) {
    text = el.innerText || el.textContent;
  } else {
    // elementId is actually the code string directly
    text = elementId;
  }
  text = text.trim();

  navigator.clipboard.writeText(text).then(function() {
    if (btn) {
      var orig = btn.textContent;
      var origBg   = btn.style.background;
      var origColor= btn.style.color;
      var origBorder = btn.style.borderColor;
      btn.textContent = '✓ Copied!';
      btn.style.background   = '#e8005c';
      btn.style.color        = '#fff';
      btn.style.borderColor  = '#e8005c';
      setTimeout(function() {
        btn.textContent      = orig;
        btn.style.background  = origBg;
        btn.style.color       = origColor;
        btn.style.borderColor = origBorder;
      }, 1800);
    }
  }).catch(function() {
    if (el) {
      var range = document.createRange();
      range.selectNode(el);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }
  });
}

/* ── Guides dropdown toggle ── */
function toggleDropdown(event) {
  if (event) event.stopPropagation();
  var dd     = document.getElementById('dropdownMenu') ||
               document.getElementById('guidesDropdown');
  var toggle = document.querySelector('.dropdown-toggle') ||
               document.querySelector('.hnav-dropdown-btn');
  if (!dd) return;
  var open = dd.classList.toggle('open');
  if (toggle) toggle.classList.toggle('active', open);
}
function closeDropdown() {
  var dd     = document.getElementById('dropdownMenu') ||
               document.getElementById('guidesDropdown');
  var toggle = document.querySelector('.dropdown-toggle') ||
               document.querySelector('.hnav-dropdown-btn');
  if (dd)     dd.classList.remove('open');
  if (toggle) toggle.classList.remove('active');
}

/* Close dropdown on outside click */
document.addEventListener('click', function(e) {
  var dropdown = document.querySelector('.nav-dropdown') ||
                 document.querySelector('.hnav-dropdown');
  if (dropdown && !dropdown.contains(e.target)) closeDropdown();
});

/* ── Mobile nav toggle ── */
function toggleMobileNav() {
  var nav = document.getElementById('mobileNav');
  var btn = document.getElementById('hamburger');
  if (!nav) return;
  var open = nav.classList.toggle('open');
  if (btn) btn.querySelector('span:first-child') && (btn.textContent = open ? '✕' : '☰');
}
function closeMobileNav() {
  var nav = document.getElementById('mobileNav');
  var btn = document.getElementById('hamburger');
  if (nav) nav.classList.remove('open');
  if (btn && btn.tagName === 'BUTTON') btn.textContent = '☰';
}

/* ── Active nav link ── */
function setActiveNav() {
  var path     = window.location.pathname;
  var filename = path.split('/').pop() || 'index.html';
  var isGuide  = path.includes('/guides/');
  var isBlog   = path.includes('/blog/');

  document.querySelectorAll('.main-nav > a, .hnav-link[data-page]').forEach(function(link) {
    link.classList.remove('active');
    var href = link.getAttribute('href') || link.dataset.page || '';
    var hFile = href.split('/').pop();

    if (hFile === filename && !isBlog && !isGuide) link.classList.add('active');
    if ((isBlog || isGuide) && (href.includes('blog') || href === 'blog/index.html')) link.classList.add('active');
  });

  // Highlight guides dropdown toggle on guide pages
  if (isGuide) {
    var toggle = document.querySelector('.dropdown-toggle, .hnav-dropdown-btn');
    if (toggle) toggle.classList.add('active');
  }

  // Highlight active item inside dropdown
  document.querySelectorAll('.dropdown-menu a, .hnav-dropdown-item').forEach(function(link) {
    link.classList.remove('active');
    var href  = link.getAttribute('href') || '';
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

/* ── Smooth scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 70;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
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
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(232,0,92,0.1)'
      : '';
  }, { passive: true });
}

/* ── Init on DOM ready ── */
document.addEventListener('DOMContentLoaded', function() {
  setActiveNav();
  initReveal();
  initSmoothScroll();
  initMobileNavClose();
  initHeaderScroll();
});
