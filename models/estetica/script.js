// LUANA RIBEIRO · ESTÉTICA AVANÇADA · demo TechXugo

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

// ─────────── Brilho que acompanha o mouse nas linhas de preço ───────────
document.querySelectorAll('.price-row, .lash-row').forEach(row => {
  row.addEventListener('pointermove', e => {
    const rect = row.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    row.style.background =
      `linear-gradient(120deg, rgba(217, 178, 106, 0.12) ${Math.max(x - 25, 0)}%, rgba(217, 178, 106, 0.03) ${x + 25}%)`;
  });
  row.addEventListener('pointerleave', () => { row.style.background = ''; });
});

// ─────────── Fallback pra fotos que não carregarem ───────────
document.querySelectorAll('.img-frame img').forEach(img => {
  img.addEventListener('error', () => {
    img.closest('.img-frame').classList.add('img-fallback');
    img.remove();
  });
});
