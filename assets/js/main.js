// ==========================================================================
// GEO3TECH — main.js
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Ícones Lucide ---------- */
  if (window.lucide) {
    lucide.createIcons();
  } else {
    window.addEventListener('load', () => window.lucide && lucide.createIcons());
  }

  /* ---------- Header: sombra ao rolar ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    });
  });

  /* ---------- Scroll suave para âncoras ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Tema claro / escuro ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const THEME_KEY = 'geo3tech-theme';

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  };

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem(THEME_KEY) || (prefersDark ? 'dark' : 'light');
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  }

  /* ---------- Animação de revelação ao rolar (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Máscara de telefone (Nome, E-mail, Telefone, Mensagem) ---------- */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);

      if (digits.length > 10) {
        digits = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      } else if (digits.length > 5) {
        digits = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (digits.length > 2) {
        digits = digits.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (digits.length > 0) {
        digits = digits.replace(/(\d{0,2})/, '($1');
      }

      phoneInput.value = digits.trim();
    });
  }

  /* ---------- Envio do formulário de contato ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
          formStatus.classList.add('is-success');
          form.reset();
        } else {
          throw new Error('Falha no envio');
        }
      } catch (err) {
        formStatus.textContent = 'Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp.';
        formStatus.classList.add('is-error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
        if (window.lucide) lucide.createIcons();
      }
    });
  }

});