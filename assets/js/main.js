/* ===== عباية خيال — main.js ===== */
(function () {
  'use strict';

  /* ---- Preloader (hard fallback) ---- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (!preloader) return;
    preloader.style.opacity = '0';
    setTimeout(function () { preloader.style.display = 'none'; }, 600);
  }
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 1200); // fallback if load never fires

  /* ---- Sticky header shrink ---- */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile full-screen menu ---- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mmClose = document.getElementById('mmClose');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (burger) burger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger) burger.addEventListener('click', openMenu);
  if (mmClose) mmClose.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); closeLightbox(); }
  });

  /* ---- Scroll reveal (with fallback) ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // safety: reveal everything after 2s no matter what
    setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add('visible'); });
    }, 2000);
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  function openLightbox(src, alt) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || 'عرض مكبّر';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.g-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var src = item.getAttribute('data-img');
      var img = item.querySelector('img');
      openLightbox(src, img ? img.alt : '');
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---- Toast ---- */
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  function showToast(msg) {
    if (!toast) return;
    if (toastMsg && msg) toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  /* ---- Order form -> WhatsApp + localStorage ---- */
  var WA = '966531900776';
  var form = document.getElementById('orderForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('name') || {}).value || '';
      var phone = (document.getElementById('phone') || {}).value || '';
      var service = (document.getElementById('service') || {}).value || '';
      var notes = (document.getElementById('notes') || {}).value || '';

      name = name.trim(); phone = phone.trim();
      if (!name || !phone || !service) {
        showToast('فضلاً أكمل الاسم والجوال وصنف العباية');
        return;
      }

      // Save to localStorage (demo)
      try {
        var orders = JSON.parse(localStorage.getItem('khayal_orders') || '[]');
        orders.push({ name: name, phone: phone, service: service, notes: notes, at: new Date().toISOString() });
        localStorage.setItem('khayal_orders', JSON.stringify(orders));
      } catch (err) { /* ignore storage errors */ }

      // Build WhatsApp message
      var msg =
        'السلام عليكم، أرغب في طلب من عباية خيال 🌙\n\n' +
        '• الاسم: ' + name + '\n' +
        '• الجوال: ' + phone + '\n' +
        '• الصنف: ' + service + '\n' +
        (notes ? '• التفاصيل: ' + notes + '\n' : '') +
        '\nبانتظار ردكم، شكرًا.';

      var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
      showToast('تم تجهيز طلبك — جارٍ فتح واتساب…');
      setTimeout(function () { window.open(url, '_blank'); }, 700);
      form.reset();
    });
  }

  /* ---- Footer year (already 2026 static, keep dynamic-safe) ---- */
})();
