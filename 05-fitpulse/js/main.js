// FitPulse — main.js

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function lockScroll() {
  const y = window.scrollY;
  document.body.dataset.scrollY = y;
  document.body.style.cssText = `position:fixed;top:-${y}px;left:0;right:0;overflow-y:scroll`;
}
function unlockScroll() {
  const y = +(document.body.dataset.scrollY || 0);
  document.body.style.cssText = '';
  window.scrollTo(0, y);
}

function openMenu() {
  navLinks?.classList.add('open');
  navToggle?.classList.add('open');
  nav.classList.add('menu-open');
  lockScroll();
}
function closeMenu() {
  navLinks?.classList.remove('open');
  navToggle?.classList.remove('open');
  nav.classList.remove('menu-open');
  unlockScroll();
}

navToggle?.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => {
  if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Counter animation
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const step = target / (1600 / 16);
    let current = 0;
    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// Reveal on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
    let delay = 0;
    siblings.forEach((s, i) => { if (s === entry.target) delay = i * 100; });
    setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 400));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => revealObserver.observe(r));

// IMC Calculator
const imcForm = document.getElementById('imcForm');
const imcResult = document.getElementById('imcResult');
const imcValue = document.getElementById('imcValue');
const imcLabel = document.getElementById('imcLabel');
const imcCta = document.getElementById('imcCta');

const imcData = [
  { max: 18.5, label: 'Abaixo do peso', color: '#3b82f6', cta: 'Recomendamos o programa de Condicionamento e Saúde para ganho saudável de peso.' },
  { max: 24.9, label: 'Peso normal ✓', color: '#10b981', cta: 'Ótimo! Foque em manter e melhorar com nosso programa de Condicionamento ou Musculação.' },
  { max: 29.9, label: 'Sobrepeso', color: '#f59e0b', cta: 'Nosso programa de Emagrecimento Acelerado é ideal para você. Resultados em 90 dias!' },
  { max: 34.9, label: 'Obesidade Grau I', color: '#f97316', cta: 'O programa Emagrecimento Acelerado com acompanhamento nutricional é a sua melhor opção.' },
  { max: 999, label: 'Obesidade Grau II+', color: '#ef4444', cta: 'Recomendamos fortemente uma avaliação presencial. A transformação começa com o primeiro passo.' },
];

imcForm?.addEventListener('submit', e => {
  e.preventDefault();
  const peso = parseFloat(document.getElementById('peso').value);
  const alturaRaw = parseFloat(document.getElementById('altura').value);
  if (!peso || !alturaRaw) return;
  const altura = alturaRaw / 100;
  const imc = peso / (altura * altura);
  const rounded = imc.toFixed(1);
  const match = imcData.find(d => imc <= d.max) || imcData.at(-1);

  imcValue.textContent = rounded;
  imcValue.style.color = match.color;
  imcLabel.textContent = match.label;
  imcLabel.style.color = match.color;
  imcCta.textContent = match.cta;
  imcResult.style.display = 'block';
  imcResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Phone mask
const telAvaliacao = document.getElementById('telAvaliacao');
telAvaliacao?.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length >= 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length >= 3) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length > 0) v = `(${v}`;
  e.target.value = v;
});

// Avaliação form
document.getElementById('avaliacaoForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Recebemos! Entraremos em contato em breve 💪';
  btn.style.background = '#10b981';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Quero Minha Avaliação Gratuita 💪';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 5000);
});
