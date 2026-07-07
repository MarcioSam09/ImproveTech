// ÁUREA JOALHERIA · demo Improve Tech

// ─────────── Header muda ao rolar ───────────
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ─────────── Menu mobile ───────────
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─────────── Revelar elementos ao entrar na tela ───────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─────────── Contadores animados ───────────
const animateCount = el => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();

  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statsObserver.observe(el));

// ─────────── Filtro das coleções ───────────
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.filter;

    cards.forEach(card => {
      const show = cat === 'todas' || card.dataset.cat === cat;

      if (show) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.scale = '0.96';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.scale = '1';
        }));
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ─────────── Slider de depoimentos ───────────
const track = document.getElementById('sliderTrack');
const slides = track.querySelectorAll('.slide');
const dotsWrap = document.getElementById('sliderDots');
let current = 0;
let autoplay;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
  dotsWrap.appendChild(dot);
});

const dots = dotsWrap.querySelectorAll('button');

function goTo(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

function restartAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(() => goTo(current + 1), 5500);
}

restartAutoplay();

// Pausa o autoplay quando o mouse está em cima
const slider = document.getElementById('slider');
slider.addEventListener('mouseenter', () => clearInterval(autoplay));
slider.addEventListener('mouseleave', restartAutoplay);

// Swipe no mobile
let touchStartX = 0;
slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
slider.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 50) goTo(current + (delta < 0 ? 1 : -1));
  restartAutoplay();
}, { passive: true });

// ─────────── FAQ: só um item aberto por vez ───────────
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});

// ─────────── Fallback pra fotos que não carregarem ───────────
document.querySelectorAll('.img-frame img').forEach(img => {
  img.addEventListener('error', () => {
    img.closest('.img-frame').classList.add('img-fallback');
    img.remove();
  });
});
