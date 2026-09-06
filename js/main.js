// ===== MOMENTUM SCROLL — roda do mouse com inércia/aceleração =====
// Captura o wheel event e aplica física de velocidade + fricção
(function () {
  let velocity    = 0;
  let targetY     = window.scrollY;
  let rafId       = null;
  const FRICTION   = 0.86;   // decaimento por frame (menor = para mais rápido)
  const MULTIPLIER = 3.2;    // sensibilidade da roda

  function lerp(a, b, t) { return a + (b - a) * t; }

  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  function getMaxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  function tick() {
    velocity *= FRICTION;
    targetY  += velocity;
    targetY   = clamp(targetY, 0, getMaxScroll());

    const current = window.scrollY;
    const next    = lerp(current, targetY, 0.12);
    window.scrollTo(0, next);

    if (Math.abs(velocity) > 0.4 || Math.abs(next - targetY) > 0.8) {
      rafId = requestAnimationFrame(tick);
    } else {
      window.scrollTo(0, targetY);
      rafId = null;
    }
  }

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    // Normaliza delta para trackpad e mouse
    const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
    velocity   += delta * MULTIPLIER;
    targetY     = clamp(window.scrollY + velocity, 0, getMaxScroll());

    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: false });
})();

// ===== SMOOTH SCROLL — para links internos e scroll-to-top =====
function smoothScrollTo(destY, duration) {
  const startY    = window.scrollY;
  const distance  = destY - startY;
  const startTime = performance.now();

  function easeInOutQuart(t) {
    return t < 0.5
      ? 8 * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutQuart(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ===== SCROLL SUAVE PARA LINKS INTERNOS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH  = document.querySelector('header').offsetHeight;
    const destY = target.getBoundingClientRect().top + window.scrollY - navH;
    smoothScrollTo(destY, 900);
  });
});

// ===== MENU MOBILE =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelector('i').className = 'fas fa-bars';
  });
});

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
scrollTopBtn.addEventListener('click', () => smoothScrollTo(0, 900));

// ===== NAVBAR: link ativo + visibilidade do botão scroll-to-top =====
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a:not(.nav-cta)');

function updateUI() {
  const scrollY = window.scrollY;
  scrollTopBtn.classList.toggle('visible', scrollY > 420);

  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 130) current = s.getAttribute('id');
  });
  navItems.forEach(link => {
    link.style.color      = '';
    link.style.background = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color      = 'var(--green-dark)';
      link.style.background = 'var(--green-pale)';
    }
  });
}

window.addEventListener('scroll', updateUI, { passive: true });

// ===== REVEAL AO SCROLL =====
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

// ===== FADE-IN INICIAL DA PÁGINA =====
function initPageFade() {
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));
}

// ===== FORMULÁRIO DE CONTATO =====
function initForm() {
  const form     = document.getElementById('contato-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.className   = 'form-feedback';
    feedback.textContent = '';

    const nome     = document.getElementById('nome').value.trim();
    const email    = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) {
      feedback.classList.add('error');
      feedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.classList.add('error');
      feedback.textContent = 'Por favor, insira um e-mail válido.';
      return;
    }

    feedback.textContent = `Obrigado, ${nome}! Entraremos em contato em breve.`;
    form.reset();
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => { feedback.textContent = ''; feedback.style.opacity = '1'; }, 400);
    }, 5000);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initPageFade();
  initReveal();
  initForm();
  updateUI();
});
