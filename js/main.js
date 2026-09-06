// ===== MENU MOBILE =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fechar menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== NAVBAR: destacar link ativo ao rolar =====
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--primary)';
    }
  });
});

// ===== FORMULÁRIO DE CONTATO =====
const form = document.getElementById('contato-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !email || !mensagem) {
    feedback.style.color = '#dc2626';
    feedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
    return;
  }

  // Simula envio
  feedback.style.color = '#16a34a';
  feedback.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`;
  form.reset();

  setTimeout(() => { feedback.textContent = ''; }, 5000);
});

// ===== ANIMAÇÃO DE ENTRADA (Intersection Observer) =====
const animatedElements = document.querySelectorAll('.card, .product-card, .stat');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
