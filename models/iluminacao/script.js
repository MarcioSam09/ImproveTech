/* LAKAZA · demo TechXugo */

(function () {
  'use strict';

  /* ── menu mobile ── */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ── carrossel de modelos ──
     o scroll horizontal é nativo (dedo e trackpad já funcionam).
     As setas só empurram o trilho e refletem onde ele está. */
  var trilho = document.getElementById('trilho');
  var antes = document.getElementById('antes');
  var depois = document.getElementById('depois');

  if (trilho && antes && depois) {
    var passo = function () {
      var card = trilho.querySelector('.produto');
      if (!card) return trilho.clientWidth;
      var gap = parseFloat(getComputedStyle(trilho).columnGap || getComputedStyle(trilho).gap) || 22;
      return card.getBoundingClientRect().width + gap;
    };

    var sincronizar = function () {
      var max = trilho.scrollWidth - trilho.clientWidth;
      // 2px de folga: navegadores arredondam o scrollLeft
      antes.disabled = trilho.scrollLeft <= 2;
      depois.disabled = trilho.scrollLeft >= max - 2;
    };

    antes.addEventListener('click', function () { trilho.scrollBy({ left: -passo(), behavior: 'smooth' }); });
    depois.addEventListener('click', function () { trilho.scrollBy({ left: passo(), behavior: 'smooth' }); });

    trilho.addEventListener('scroll', function () {
      window.requestAnimationFrame(sincronizar);
    }, { passive: true });

    window.addEventListener('resize', sincronizar);
    sincronizar();

    // as imagens mudam a largura do trilho ao carregarem
    trilho.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', sincronizar, { once: true });
    });
  }

  /* ── reveal no scroll ── */
  var els = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('on'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });

  els.forEach(function (el) { io.observe(el); });
})();
