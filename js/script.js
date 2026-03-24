/**
 * script.js – Portfólio Felipe Magni Calabres
 * Funcionalidades: menu responsivo, scroll suave, tema claro/escuro,
 * validação de formulário e feedback visual.
 * HTML5 + CSS3 + JavaScript vanilla – sem frameworks.
 */

/* ============================================================
   1. UTILITÁRIOS
============================================================ */

/**
 * Retorna o elemento pelo seletor (atalho de querySelector).
 * @param {string} selector
 * @param {Element} [parent=document]
 * @returns {Element|null}
 */
const $ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Retorna todos os elementos pelo seletor.
 * @param {string} selector
 * @param {Element} [parent=document]
 * @returns {NodeList}
 */
const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

/* ============================================================
   2. NAVBAR – sombra ao rolar
============================================================ */
(function initNavbarScroll() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  // Verifica o estado inicial (caso a página já esteja no meio do scroll ao carregar)
  onScroll();
})();

/* ============================================================
   3. MENU HAMBÚRGUER (mobile)
============================================================ */
(function initHamburger() {
  const hamburger = $('#hamburger');
  const navMenu   = $('#nav-menu');
  if (!hamburger || !navMenu) return;

  /**
   * Alterna a visibilidade do menu mobile.
   * @param {boolean} [force] – define o estado explicitamente.
   */
  function toggleMenu(force) {
    const isOpen = force !== undefined ? force : !hamburger.classList.contains('open');

    hamburger.classList.toggle('open', isOpen);
    navMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  // Clique no botão hambúrguer
  hamburger.addEventListener('click', () => toggleMenu());

  // Fecha o menu ao clicar em qualquer link de navegação
  $$('.nav-link', navMenu).forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  // Fecha ao clicar fora do menu
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });
})();

/* ============================================================
   4. LINK ATIVO NA NAVBAR (Intersection Observer)
============================================================ */
(function initActiveNavLink() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove a classe ativa de todos os links
          navLinks.forEach(link => link.classList.remove('active'));

          // Adiciona a classe no link correspondente à seção visível
          const activeLink = $(`a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    {
      // Considera a seção ativa quando está no centro da tela
      rootMargin: '-40% 0px -55% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
})();

/* ============================================================
   5. ALTERNÂNCIA DE TEMA (claro / escuro)
============================================================ */
(function initThemeToggle() {
  const btn      = $('#theme-toggle');
  const themeIcon = $('#theme-icon');
  const body     = document.body;
  if (!btn) return;

  // Recupera preferência salva ou usa a preferência do sistema
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  btn.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-theme');
    applyTheme(isDark ? 'light' : 'dark');
  });

  /**
   * Aplica o tema e salva a preferência.
   * @param {'light'|'dark'} theme
   */
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    body.classList.toggle('dark-theme', isDark);
    body.classList.toggle('light-theme', !isDark);
    const iconSun = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    const iconMoon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    if (themeIcon) themeIcon.innerHTML = isDark ? iconSun : iconMoon;
    btn.setAttribute('aria-label', isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro');
    localStorage.setItem('portfolio-theme', theme);
  }
})();

/* ============================================================
   6. BOTÃO "VOLTAR AO TOPO"
============================================================ */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   7. ANO ATUAL NO RODAPÉ
============================================================ */
(function setFooterYear() {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ============================================================
   8. VALIDAÇÃO E ENVIO DO FORMULÁRIO
============================================================ */
(function initContactForm() {
  const form       = $('#contato-form');
  const successMsg = $('#form-success');
  const btnEnviar  = $('#btn-enviar');
  if (!form) return;

  /**
   * Referências dos campos do formulário.
   */
  const fields = {
    nome:     { input: $('#nome',     form), error: $('#nome-erro',     form) },
    email:    { input: $('#email',    form), error: $('#email-erro',    form) },
    mensagem: { input: $('#mensagem', form), error: $('#mensagem-erro', form) },
  };

  /* ---- Validação individual de campo ---- */

  /**
   * Valida o campo Nome.
   * Regras: não pode ser vazio, mínimo 3 caracteres.
   * @returns {string} mensagem de erro ou string vazia se válido
   */
  function validateNome() {
    const val = fields.nome.input.value.trim();
    if (!val) return 'Por favor, informe seu nome.';
    if (val.length < 3) return 'O nome deve ter ao menos 3 caracteres.';
    return '';
  }

  /**
   * Valida o campo E-mail.
   * Regras: não pode ser vazio, deve ter formato válido de e-mail.
   * @returns {string}
   */
  function validateEmail() {
    const val = fields.email.input.value.trim();
    if (!val) return 'Por favor, informe seu e-mail.';
    // Expressão regular para formato básico de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(val)) return 'Informe um e-mail válido (ex: nome@dominio.com).';
    return '';
  }

  /**
   * Valida o campo Mensagem.
   * Regras: não pode ser vazio, mínimo 10 caracteres.
   * @returns {string}
   */
  function validateMensagem() {
    const val = fields.mensagem.input.value.trim();
    if (!val) return 'Por favor, escreva sua mensagem.';
    if (val.length < 10) return 'A mensagem deve ter ao menos 10 caracteres.';
    return '';
  }

  // Mapa de validadores por campo
  const validators = {
    nome:     validateNome,
    email:    validateEmail,
    mensagem: validateMensagem,
  };

  /**
   * Exibe ou remove o estado de erro de um campo.
   * @param {string} fieldName
   * @param {string} errorMsg – string vazia para remover o erro
   */
  function setFieldState(fieldName, errorMsg) {
    const { input, error } = fields[fieldName];
    const group = input.closest('.form-group');

    if (errorMsg) {
      group.classList.add('has-error');
      error.textContent = errorMsg;
      input.setAttribute('aria-invalid', 'true');
    } else {
      group.classList.remove('has-error');
      error.textContent = '';
      input.removeAttribute('aria-invalid');
    }
  }

  /**
   * Valida um único campo e atualiza o estado visual.
   * @param {string} fieldName
   * @returns {boolean} true se válido
   */
  function validateField(fieldName) {
    const errorMsg = validators[fieldName]();
    setFieldState(fieldName, errorMsg);
    return errorMsg === '';
  }

  /* ---- Validação em tempo real (blur) ---- */
  Object.keys(fields).forEach(name => {
    fields[name].input.addEventListener('blur', () => validateField(name));
    // Remove o erro assim que o usuário começa a digitar novamente
    fields[name].input.addEventListener('input', () => {
      const group = fields[name].input.closest('.form-group');
      if (group.classList.contains('has-error')) validateField(name);
    });
  });

  /* ---- Submissão do formulário ---- */
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Esconde a mensagem de sucesso anterior, se existir
    if (successMsg) successMsg.hidden = true;

    // Valida todos os campos
    let isValid = true;
    Object.keys(fields).forEach(name => {
      if (!validateField(name)) isValid = false;
    });

    if (!isValid) {
      // Foca o primeiro campo inválido para acessibilidade
      const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* ----- Simulação de envio (sem backend) ----- */

    // Feedback visual: desabilita o botão e mostra estado de carregamento
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 6px;"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg> Enviando...';

    // Simula latência de rede (800ms)
    setTimeout(() => {
      // Limpa o formulário
      form.reset();

      // Remove estados de erro residuais
      Object.keys(fields).forEach(name => setFieldState(name, ''));

      // Exibe mensagem de sucesso
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -4px; margin-right: 4px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Mensagem enviada com sucesso!';
        // Rola suavemente até a mensagem de sucesso
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Restaura o botão
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar Mensagem';

      // Oculta a mensagem de sucesso após 5 segundos
      setTimeout(() => {
        if (successMsg) successMsg.hidden = true;
      }, 5000);
    }, 800);
  });
})();

/* ============================================================
   9. ANIMAÇÃO DE ENTRADA POR SCROLL (Intersection Observer)
   Elementos com a classe .reveal ganham a animação ao entrar no viewport
============================================================ */
(function initRevealOnScroll() {
  // Adiciona a classe 'reveal' em todos os cards e itens da timeline
  const targets = $$('.info-card, .project-card, .timeline-card, .contato-info, .contato-form');

  targets.forEach(el => el.classList.add('reveal'));

  // Adiciona o CSS necessário para a animação via JavaScript
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Para de observar após a primeira vez (performance)
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach(el => observer.observe(el));
})();
