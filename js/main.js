// ===== SCROLL SUAVE PARA LINKS INTERNOS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// ===== NAVBAR: destacar link ativo =====
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a:not(.nav-cta)');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 130) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(link => {
    link.style.color = '';
    link.style.background = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--green-dark)';
      link.style.background = 'var(--green-pale)';
    }
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 420);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== REVEAL AO SCROLL (Intersection Observer) =====
// Aguarda a DOM estar completamente pronta para não disparar cedo demais
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

// ===== FADE-IN INICIAL DA PÁGINA (page transition) =====
function initPageFade() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
}

// ===== FORMULÁRIO DE CONTATO =====
function initForm() {
  const form     = document.getElementById('contato-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const nome     = document.getElementById('nome').value.trim();
    const email    = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) {
      feedback.classList.add('error');
      feedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
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
  updateActiveLink();
});
