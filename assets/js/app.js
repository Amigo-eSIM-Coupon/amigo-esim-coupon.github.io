/* ════════════════════════════════════════
   AMIGO eSIM — Global JavaScript
   app.js
════════════════════════════════════════ */

/* ── Copy Coupon Code ── */
function copyCode(code, btn) {
  navigator.clipboard.writeText(code).then(function () {
    var orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background = '#e8005c';
    btn.style.color = '#fff';
    btn.style.borderColor = '#e8005c';
    setTimeout(function () {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 1800);
  });
}

/* ── Mobile Nav Toggle ── */
function toggleMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (nav) nav.classList.toggle('open');
}

/* ── Guides Dropdown ── */
function toggleDropdown(event) {
  event.stopPropagation();
  var dd = document.getElementById('guidesDropdown');
  if (dd) dd.classList.toggle('open');
}
function closeDropdown() {
  var dd = document.getElementById('guidesDropdown');
  if (dd) dd.classList.remove('open');
}
document.addEventListener('click', function (e) {
  var dd = document.getElementById('guidesDropdown');
  if (dd && !dd.contains(e.target)) closeDropdown();
});

/* ── Scroll Reveal ── */
function initReveal() {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
    observer.observe(el);
  });
}

/* ── Set Active Nav Link ── */
function setActiveNav() {
  var path = window.location.pathname;
  var filename = path.split('/').pop();
  if (!filename || filename === '') filename = 'index.html';

  document.querySelectorAll('.hnav-link').forEach(function (link) {
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (!href) return;
    var hrefFile = href.split('/').pop();
    if (!hrefFile || hrefFile === '') hrefFile = 'index.html';
    if (hrefFile === filename) link.classList.add('active');
  });

  // Mobile nav active
  document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (!href) return;
    var hrefFile = href.split('/').pop();
    if (!hrefFile || hrefFile === '') hrefFile = 'index.html';
    if (hrefFile === filename) link.classList.add('active');
  });

  // Guides dropdown active if on a guide page
  var guidePages = ['activate-iphone-android.html','esim-vs-roaming-vs-local-sim.html','how-to-choose-right-plan.html'];
  var guideBtn = document.querySelector('.hnav-dropdown-btn');
  if (guideBtn && guidePages.indexOf(filename) !== -1) {
    guideBtn.classList.add('active');
  }

  // Blog sub-pages highlight Blog nav link
  var blogPages = ['best-esim-europe.html','best-esim-japan.html','best-esim-usa.html'];
  if (blogPages.indexOf(filename) !== -1) {
    document.querySelectorAll('.hnav-link').forEach(function(link) {
      if (link.getAttribute('href') && link.getAttribute('href').indexOf('blog') !== -1) {
        link.classList.add('active');
      }
    });
  }
}

/* ── Smooth Scroll for In-Page Anchors ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function () {
  initReveal();
  setActiveNav();
  initSmoothScroll();
});
