/**
 * custom-build.js
 * Comportamientos interactivos de la página Custom Build — Trastes
 * Todos los selectores verifican existencia del nodo antes de operar.
 */

/* ============================================================
   UTILIDADES
   ============================================================ */

/** Respeta prefers-reduced-motion para animaciones opcionales */
const prefersReducedMotion = window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

/** Selecciona un elemento con seguridad (null si no existe) */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ============================================================
   1. HEADER: transparente → sólido al hacer scroll
   ============================================================ */
(function initHeader() {
  const header = qs('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  onScroll(); // estado inicial
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ============================================================
   2–5. MENÚ MOBILE ACCESIBLE
   ============================================================ */
(function initMobileMenu() {
  const menuToggle = qs('#menuToggle');
  const nav        = qs('#nav');
  if (!menuToggle || !nav) return;

  function openMenu() {
    nav.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Cierre con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Cierre al tocar un enlace
  qsa('a, button', nav).forEach(el => {
    el.addEventListener('click', closeMenu);
  });
})();


/* ============================================================
   6. SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initReveal() {
  const els = qsa('.reveal');
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* ============================================================
   7. TIMELINE — aparición progresiva de pasos
   ============================================================ */
(function initTimeline() {
  const steps = qsa('.reveal-step');
  if (!steps.length) return;

  if (prefersReducedMotion) {
    steps.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Usamos un único observer; el retraso se aplica via data-step
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const step = parseInt(entry.target.dataset.step ?? 0, 10);
        const delay = step * 120; // ms entre cada paso
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  steps.forEach(el => observer.observe(el));
})();


/* ============================================================
   VIDEO DEL PROCESO
   ============================================================ */

(function initProcessVideo() {
  const video = qs('#processVideo');
  const control = qs('#processVideoControl');

  if (!video || !control) return;

  const pauseIcon = qs(
    '.custom-process__pause-icon',
    control
  );

  const playIcon = qs(
    '.custom-process__play-icon',
    control
  );

  function updateVideoControl() {
    const isPaused = video.paused;

    control.classList.toggle(
      'is-paused',
      isPaused
    );

    control.setAttribute(
      'aria-pressed',
      String(isPaused)
    );

    control.setAttribute(
      'aria-label',
      isPaused
        ? 'Reproducir video'
        : 'Pausar video'
    );

    if (pauseIcon) {
      pauseIcon.setAttribute(
        'aria-hidden',
        String(isPaused)
      );
    }

    if (playIcon) {
      playIcon.setAttribute(
        'aria-hidden',
        String(!isPaused)
      );
    }
  }

  control.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {
        console.warn(
          'El navegador bloqueó la reproducción del video.'
        );
      });
    } else {
      video.pause();
    }

    updateVideoControl();
  });

  video.addEventListener(
    'play',
    updateVideoControl
  );

  video.addEventListener(
    'pause',
    updateVideoControl
  );

  updateVideoControl();
})();
/* ============================================================
   EL RESULTADO — APARICIÓN PROGRESIVA
   ============================================================ */

(function initResultSequence() {
  const section = document.querySelector(
    '.custom-result'
  );

  if (!section) return;

  const steps = [
    ...section.querySelectorAll(
      '[data-result-step]'
    )
  ];

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /*
    La clase is-enhanced activa los estados iniciales
    definidos en CSS. Si JavaScript falla, la sección
    sigue siendo visible normalmente.
  */

  section.classList.add('is-enhanced');

  function showSection() {
    section.classList.add('is-visible');

    steps.forEach((step, index) => {
      window.setTimeout(() => {
        step.classList.add('is-visible');
      }, reduceMotion ? 0 : 220 + index * 140);
    });
  }

  if (reduceMotion) {
    showSection();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        showSection();
        observer.unobserve(section);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  observer.observe(section);
})();

/* ============================================================
   CONFIGURADOR DE MATERIALES
   Madera + acabado + clavijero
   ============================================================ */

(function initConfigurator() {
  const groups = qsa('.custom-config__group');

  const guitarImg = qs('#guitarImg');
  const guitarOverlay = qs('#guitarOverlay');
  const tunerImg = qs('#tunerImg');

  if (!groups.length) return;

  /* ----------------------------------------
     Actualizar el resumen textual
     ---------------------------------------- */

  function updateSummary(summaryId, value) {
    if (!summaryId) return;

    const summaryElement = qs(`#${summaryId}`);

    if (summaryElement) {
      summaryElement.textContent = value;
    }
  }

  /* ----------------------------------------
     Cambiar imagen con una transición
     ---------------------------------------- */

  function changeImage(element, newSource, newAlt = '') {
    if (!element || !newSource) return;

    element.classList.add('is-changing');

    const preloadImage = new Image();

    preloadImage.onload = () => {
      element.src = newSource;

      if (newAlt) {
        element.alt = newAlt;
      }

      requestAnimationFrame(() => {
        element.classList.remove('is-changing');
      });
    };

    preloadImage.onerror = () => {
      console.warn(`No se pudo cargar la imagen: ${newSource}`);
      element.classList.remove('is-changing');
    };

    preloadImage.src = newSource;
  }

  /* ----------------------------------------
     Precargar las imágenes del configurador
     ---------------------------------------- */

  qsa('[data-img]').forEach((button) => {
    const image = new Image();
    image.src = button.dataset.img;
  });

  qsa('[data-tuner-img]').forEach((button) => {
    const image = new Image();
    image.src = button.dataset.tunerImg;
  });

  /* ----------------------------------------
     Activar las opciones
     ---------------------------------------- */

  groups.forEach((group) => {
    const configType = group.dataset.config;
    const summaryId = group.dataset.summary;

    const buttons = qsa('.custom-config__btn', group);

    buttons.forEach((button) => {
      button.addEventListener('click', () => {

        /* Desactivar las otras opciones del grupo */

        buttons.forEach((otherButton) => {
          otherButton.classList.remove('is-selected');
          otherButton.setAttribute('aria-pressed', 'false');
        });

        /* Activar la opción seleccionada */

        button.classList.add('is-selected');
        button.setAttribute('aria-pressed', 'true');

        /* Actualizar ficha resumen */

        updateSummary(
          summaryId,
          button.dataset.value || button.textContent.trim()
        );

        /* Madera: cambiar fotografía principal */

        if (configType === 'wood' && button.dataset.img) {
          changeImage(
            guitarImg,
            button.dataset.img,
            button.dataset.alt
          );
        }

        /* Acabado: cambiar capa visual */

        if (configType === 'finish' && guitarOverlay) {
          const selectedOverlay = button.dataset.overlay || '';

          guitarOverlay.style.background =
            selectedOverlay || 'transparent';

          guitarOverlay.classList.toggle(
            'has-finish',
            Boolean(selectedOverlay)
          );
        }

        /* Clavijero: cambiar detalle ampliado */

        if (
          configType === 'tuner' &&
          button.dataset.tunerImg
        ) {
          changeImage(
            tunerImg,
            button.dataset.tunerImg,
            button.dataset.tunerAlt
          );
        }
      });
    });
  });
})();

/* ============================================================
   GALERÍA DE PROYECTOS
   Carrusel + fichas editoriales
   ============================================================ */

(function initProjectsGallery() {
  const track = qs('#projectsTrack');
  const prevButton = qs('#projPrev');
  const nextButton = qs('#projNext');

  if (!track || !prevButton || !nextButton) return;

  const cards = qsa('[data-project-card]', track);
  const triggers = qsa(
    '.custom-project-card__trigger',
    track
  );

  const mobileQuery = window.matchMedia(
    '(max-width: 640px)'
  );

  let scrollFrame = null;

  /* ----------------------------------------
     Fichas de información
     ---------------------------------------- */

  function closeCard(card) {
    if (!card) return;

    card.classList.remove('is-open');

    const trigger = qs(
      '.custom-project-card__trigger',
      card
    );

    if (trigger) {
      trigger.setAttribute(
        'aria-expanded',
        'false'
      );
    }
  }

  function openCard(card) {
    if (!card) return;

    cards.forEach((otherCard) => {
      if (otherCard !== card) {
        closeCard(otherCard);
      }
    });

    card.classList.add('is-open');

    const trigger = qs(
      '.custom-project-card__trigger',
      card
    );

    if (trigger) {
      trigger.setAttribute(
        'aria-expanded',
        'true'
      );
    }
  }

  triggers.forEach((trigger) => {
    const card = trigger.closest(
      '[data-project-card]'
    );

    trigger.addEventListener('click', () => {
      if (!card) return;

      const isOpen =
        card.classList.contains('is-open');

      if (isOpen) {
        closeCard(card);
      } else {
        openCard(card);
      }
    });
  });

  /*
    Cerrar las fichas al tocar fuera
    de la galería.
  */

  document.addEventListener('click', (event) => {
    const clickedInside =
      event.target.closest('[data-project-card]');

    if (clickedInside) return;

    cards.forEach(closeCard);
  });

  /*
    Escape cierra la ficha activa.
  */

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const openedCard = qs(
      '.custom-project-card.is-open',
      track
    );

    if (!openedCard) return;

    const trigger = qs(
      '.custom-project-card__trigger',
      openedCard
    );

    closeCard(openedCard);

    if (trigger) {
      trigger.focus();
    }
  });

  /*
    Cuando dejamos mobile, cerramos las fichas
    fijadas mediante toque. En desktop vuelve
    a funcionar el hover.
  */

  function handleBreakpointChange(event) {
    if (!event.matches) {
      cards.forEach(closeCard);
    }
  }

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener(
      'change',
      handleBreakpointChange
    );
  } else {
    mobileQuery.addListener(
      handleBreakpointChange
    );
  }

  /* ----------------------------------------
     Carrusel
     ---------------------------------------- */

  function getMaxScroll() {
    return Math.max(
      0,
      track.scrollWidth - track.clientWidth
    );
  }

  function getPaddingLeft() {
    return (
      parseFloat(
        getComputedStyle(track).paddingLeft
      ) || 0
    );
  }

  function getCardPositions() {
    const paddingLeft = getPaddingLeft();

    return cards.map((card) =>
      Math.max(
        0,
        card.offsetLeft - paddingLeft
      )
    );
  }

  function updateControls() {
    const maxScroll = getMaxScroll();
    const tolerance = 4;

    prevButton.disabled =
      track.scrollLeft <= tolerance;

    nextButton.disabled =
      track.scrollLeft >= maxScroll - tolerance;
  }

  function goToNextCard() {
    const positions = getCardPositions();
    const current = track.scrollLeft;

    const nextPosition = positions.find(
      (position) => position > current + 12
    );

    track.scrollTo({
      left:
        nextPosition !== undefined
          ? nextPosition
          : getMaxScroll(),

      behavior: prefersReducedMotion
        ? 'auto'
        : 'smooth'
    });
  }

  function goToPreviousCard() {
    const positions = getCardPositions();
    const current = track.scrollLeft;

    const previousPositions = positions.filter(
      (position) => position < current - 12
    );

    const previousPosition =
      previousPositions.length
        ? previousPositions[
            previousPositions.length - 1
          ]
        : 0;

    track.scrollTo({
      left: previousPosition,

      behavior: prefersReducedMotion
        ? 'auto'
        : 'smooth'
    });
  }

  prevButton.addEventListener(
    'click',
    goToPreviousCard
  );

  nextButton.addEventListener(
    'click',
    goToNextCard
  );

  track.addEventListener(
    'scroll',
    () => {
      if (scrollFrame) return;

      scrollFrame = requestAnimationFrame(() => {
        updateControls();
        scrollFrame = null;
      });
    },
    { passive: true }
  );

  window.addEventListener(
    'resize',
    updateControls
  );

  updateControls();
})();


/* ============================================================
   12. ACORDEÓN DE PREGUNTAS FRECUENTES
   ============================================================ */
(function initAccordion() {
  const accordion = qs('#faqAccordion');
  if (!accordion) return;

  const triggers = qsa('.custom-accordion__trigger', accordion);

  function openItem(trigger) {
    const panelId  = trigger.getAttribute('aria-controls');
    const panel    = qs(`#${panelId}`);
    const iconEl   = qs('.custom-accordion__icon', trigger);
    if (!panel) return;

    trigger.setAttribute('aria-expanded', 'true');
    panel.classList.remove('custom-accordion__panel--closed');
    if (iconEl) iconEl.textContent = '−';
  }

  function closeItem(trigger) {
    const panelId = trigger.getAttribute('aria-controls');
    const panel   = qs(`#${panelId}`);
    const iconEl  = qs('.custom-accordion__icon', trigger);
    if (!panel) return;

    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.add('custom-accordion__panel--closed');
    if (iconEl) iconEl.textContent = '+';
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Cerrar todos
      triggers.forEach(t => {
        if (t !== trigger) closeItem(t);
      });

      // Alternar el actual
      isOpen ? closeItem(trigger) : openItem(trigger);
    });
  });
})();


/* ============================================================
   13. VALIDACIÓN DEL FORMULARIO
   NOTA: Conectar el atributo action del <form> a tu endpoint
   antes de publicar. Este código solo valida en el cliente.
   ============================================================ */
(function initForm() {
  const form = qs('#customForm');
  if (!form) return;

  const emailField      = qs('#field-email',      form);
  const experienceField = qs('#field-experience', form);
  const messageField    = qs('#field-message',    form);
  const acceptField     = qs('#field-accept',     form);
  const statusEl        = qs('#formStatus',        form);

  /** Muestra error en el campo y retorna false */
  function showError(field, errorId, message) {
    const errorEl = qs(`#${errorId}`);
    if (field)   field.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = message;
    return false;
  }

  /** Limpia error de un campo */
  function clearError(field, errorId) {
    const errorEl = qs(`#${errorId}`);
    if (field)   field.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
  }

  /** Validación de email */
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  /** Limpia errores en tiempo real */
  [emailField, experienceField, messageField, acceptField].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
      const errorId = field.getAttribute('aria-describedby');
      if (errorId) clearError(field, errorId);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Email
    if (emailField) {
      clearError(emailField, 'field-email-error');
      if (!emailField.value.trim()) {
        valid = showError(emailField, 'field-email-error', 'El correo es obligatorio.');
      } else if (!isValidEmail(emailField.value.trim())) {
        valid = showError(emailField, 'field-email-error', 'Ingresá un correo válido.');
      }
    }

    // Experiencia
    if (experienceField) {
      clearError(experienceField, 'field-experience-error');
      if (!experienceField.value) {
        valid = showError(experienceField, 'field-experience-error', 'Seleccioná tu nivel de experiencia.');
        valid = false;
      }
    }

    // Mensaje
    if (messageField) {
      clearError(messageField, 'field-message-error');
      if (!messageField.value.trim() || messageField.value.trim().length < 10) {
        valid = showError(messageField, 'field-message-error', 'Contanos brevemente qué querés construir.');
        valid = false;
      }
    }

    // Checkbox
    if (acceptField) {
      clearError(acceptField, 'field-accept-error');
      if (!acceptField.checked) {
        valid = showError(acceptField, 'field-accept-error', 'Necesitamos tu aceptación para continuar.');
        valid = false;
      }
    }

    if (!valid) {
      // Foco en el primer campo inválido
      const firstInvalid = qs('.is-invalid', form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /**
     * NOTA: Cuando conectes el endpoint, reemplazá este bloque
     * por un fetch() hacia tu backend o servicio (ej: FormSubmit,
     * Netlify Forms, tu propio API REST).
     *
     * Ejemplo:
     *   const data = new FormData(form);
     *   fetch('/api/contact', { method: 'POST', body: data })
     *     .then(res => res.ok ? mostrarExito() : mostrarError())
     *     .catch(() => mostrarError());
     */
    if (statusEl) {
      statusEl.textContent =
        '⚠ El formulario no está conectado a un backend. Configurá el endpoint en custom-build.js.';
      statusEl.style.color = 'var(--color-wood-brown)';
    }
  });
})();
