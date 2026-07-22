// ==========================================================
// TechXugo: Landing Page
// ==========================================================

// Habilita os estados "escondido antes do reveal" só quando o JS roda
document.body.classList.add('js');

// ---------- Header: borda ao rolar ----------
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---------- Menu mobile ----------
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ---------- Hero: palavra rotativa (efeito máquina de escrever) ----------
const palavras = ['vender.', 'aparecer.', 'funcionar.', 'converter.'];
const rotator = document.querySelector('.rotator');
let palavraIdx = 0;
let charIdx = 0;
let apagando = false;

function digitar() {
  const palavra = palavras[palavraIdx];

  if (!apagando) {
    charIdx++;
    rotator.textContent = palavra.slice(0, charIdx);
    if (charIdx === palavra.length) {
      apagando = true;
      setTimeout(digitar, 2200); // pausa com a palavra completa
      return;
    }
    setTimeout(digitar, 90);
  } else {
    charIdx--;
    rotator.textContent = palavra.slice(0, charIdx);
    if (charIdx === 0) {
      apagando = false;
      palavraIdx = (palavraIdx + 1) % palavras.length;
    }
    setTimeout(digitar, 45);
  }
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  rotator.textContent = palavras[0];
} else {
  digitar();
}

// ---------- Hero: glow segue o mouse ----------
const hero = document.querySelector('.hero');
const glow = document.querySelector('.hero-glow');

if (!reduceMotion && glow) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left - 280;
    const y = e.clientY - rect.top - 280;
    glow.style.transform = `translate(${x - rect.width * 0.3}px, ${y + 120}px)`;
  });
}

// ---------- Reveal on scroll ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---------- Profundímetro: preenche e mostra "profundidade" ao rolar ----------
const profundimetro = document.querySelector('.profundimetro');
const profFill = document.querySelector('.prof-fill');
const profLabel = document.querySelector('.prof-label');
const secoesClaras = document.querySelectorAll('.section-light, .diferencial');

if (profundimetro && profFill && profLabel) {
  const atualizarProfundidade = () => {
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = alturaTotal > 0 ? Math.min(1, Math.max(0, window.scrollY / alturaTotal)) : 0;
    const metros = (progresso * 100).toFixed(1).replace('.', ',');
    profFill.style.transform = `scaleY(${progresso})`;
    profLabel.textContent = `${metros} m`;

    // contraste: escurece o medidor ao passar pelas seções claras (cream) ou volt
    const centroY = window.innerHeight / 2;
    let sobreClaro = false;
    secoesClaras.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top <= centroY && r.bottom >= centroY) sobreClaro = true;
    });
    profundimetro.classList.toggle('on-light', sobreClaro);
  };
  window.addEventListener('scroll', atualizarProfundidade, { passive: true });
  window.addEventListener('resize', atualizarProfundidade);
  atualizarProfundidade();
}

// ---------- Portfólio: tilt sutil nos frames ----------
const caseVisual = document.querySelector('.case-visual');

if (!reduceMotion && caseVisual) {
  const browserFrame = caseVisual.querySelector('.browser-frame');
  const phoneFrame = caseVisual.querySelector('.phone-frame');

  caseVisual.addEventListener('mousemove', (e) => {
    const rect = caseVisual.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    browserFrame.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    phoneFrame.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(30px)`;
  });

  caseVisual.addEventListener('mouseleave', () => {
    browserFrame.style.transform = '';
    phoneFrame.style.transform = '';
  });
}
