// ===== MENU MOBILE =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
});

// Fechar menu ao clicar em link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelector('i').className = 'fas fa-bars';
  });
});

// ===== NAVBAR: destacar link ativo ao rolar =====
const sections = document.querySelectorAll('section[id]');
const links     = document.querySelectorAll('.nav-links a');

function setActiveLink() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  links.forEach(link => {
    link.style.color = '';
    link.style.background = '';
    const href = link.getAttribute('href');
    if (href === `#${current}` && !link.classList.contains('nav-cta')) {
      link.style.color = 'var(--green-dark)';
      link.style.background = 'var(--green-pale)';
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== FORMULÁRIO DE CONTATO =====
const form     = document.getElementById('contato-form');
const feedback = document.getElementById('form-feedback');

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    feedback.classList.add('error');
    feedback.textContent = 'Por favor, insira um e-mail válido.';
    return;
  }

  feedback.textContent = `✓ Obrigado, ${nome}! Entraremos em contato em breve.`;
  form.reset();

  setTimeout(() => { feedback.textContent = ''; }, 6000);
});

// ===== ANIMAÇÃO DE ENTRADA (Intersection Observer) =====
const animItems = document.querySelectorAll(
  '.card, .product-card, .stat-box, .hero-card, .contato-form-wrapper, .sobre-text'
);

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animItems.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  io.observe(el);
});
