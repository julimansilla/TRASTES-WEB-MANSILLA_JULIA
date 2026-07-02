/* ============================================
   EL TALLER — Interacciones
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ---------- Taller interactivo ---------- */
/* ---------- Taller interactivo ---------- */

const workshopData = {
  maderas: {
    number: '01',
    kicker: 'La materia prima',
    title: 'Cada instrumento empieza en la madera.',
    copy:
      'Su densidad, estabilidad, veta y respuesta sonora determinan el carácter de la pieza desde el primer corte.',
    meta: 'Selección · análisis · preparación',

    /*
      Como las maderas están a la izquierda,
      el panel aparece del lado derecho.
    */
    panelPosition: 'right'
  },

  herramientas: {
    number: '02',
    kicker: 'Herramientas de precisión',
    title: 'Control en cada corte.',
    copy:
      'Formones, reglas, calibres y herramientas de banco permiten trabajar cada superficie con seguridad, control y criterio artesanal.',
    meta: 'Talla · medición · terminación',
    panelPosition: 'right'
  },

  mastil: {
    number: '03',
    kicker: 'Mástil y ergonomía',
    title: 'El punto de contacto con el músico.',
    copy:
      'La escala, el perfil y el trasteado definen cómo se siente el instrumento en las manos y cómo responde durante la ejecución.',
    meta: 'Escala · perfil · trasteado',
    panelPosition: 'right'
  },

  cuerpo: {
    number: '04',
    kicker: 'Cuerpo y modelado',
    title: 'Dar forma al instrumento.',
    copy:
      'El cuerpo se corta, talla y vacía según el diseño definido. Cada curva modifica el peso, el equilibrio y la personalidad de la guitarra.',
    meta: 'Diseño · corte · modelado',

    /*
      Como el cuerpo está del lado derecho,
      el panel se mueve hacia la izquierda.
    */
    panelPosition: 'left'
  },

  electronica: {
    number: '05',
    kicker: 'Electrónica y sonido',
    title: 'Construir una voz propia.',
    copy:
      'Micrófonos, potenciómetros, cableado y herrajes completan el instrumento y permiten diseñar su respuesta sonora.',
    meta: 'Micrófonos · circuitos · calibración',
    panelPosition: 'left'
  }
};

const workshopExplorer = document.querySelector(
  '.workshop-explorer'
);

const workshopTriggers = document.querySelectorAll(
  '[data-workshop-target]'
);

const workshopPanel = document.getElementById(
  'workshopPanel'
);

const workshopPanelNumber = document.getElementById(
  'workshopPanelNumber'
);

const workshopPanelKicker = document.getElementById(
  'workshopPanelKicker'
);

const workshopPanelTitle = document.getElementById(
  'workshopPanelTitle'
);

const workshopPanelCopy = document.getElementById(
  'workshopPanelCopy'
);

const workshopPanelMeta = document.getElementById(
  'workshopPanelMeta'
);

const updateWorkshopPanel = (target) => {
  const item = workshopData[target];

  if (!item || !workshopPanel) return;

  /*
    Ocultamos la indicación inicial después
    de la primera interacción.
  */
  if (workshopExplorer) {
    workshopExplorer.classList.add(
      'has-interacted'
    );
  }

  /*
    Sincronizamos hotspots de desktop
    y controles de mobile.
  */
  workshopTriggers.forEach((trigger) => {
    const isSelected =
      trigger.dataset.workshopTarget === target;

    trigger.classList.toggle(
      'is-active',
      isSelected
    );

    trigger.setAttribute(
      'aria-pressed',
      String(isSelected)
    );
  });

  /*
    El panel puede cambiar de lado para no tapar
    el objeto seleccionado.
  */
  workshopPanel.classList.toggle(
    'is-left',
    item.panelPosition === 'left'
  );

  workshopPanel.classList.toggle(
    'is-right',
    item.panelPosition === 'right'
  );

  /*
    Transición breve antes de reemplazar
    los contenidos.
  */
  workshopPanel.classList.add(
    'is-changing'
  );

  window.setTimeout(() => {
    workshopPanelNumber.textContent =
      item.number;

    workshopPanelKicker.textContent =
      item.kicker;

    workshopPanelTitle.textContent =
      item.title;

    workshopPanelCopy.textContent =
      item.copy;

    workshopPanelMeta.textContent =
      item.meta;

    workshopPanel.classList.remove(
      'is-changing'
    );
  }, 170);
};

workshopTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    updateWorkshopPanel(
      trigger.dataset.workshopTarget
    );
  });
});

  /* ---------- Materialidad tabs ---------- */
  const tabs = document.querySelectorAll('.material-tab');
  const panels = document.querySelectorAll('.material-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.material;

      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.material === target));
    });
  });

  /* ---------- Proyectos slider ---------- */
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');

  const scrollByCard = (direction) => {
    const card = track.querySelector('.project-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const distance = card.getBoundingClientRect().width + gap;
    track.scrollBy({ left: distance * direction, behavior: 'smooth' });
  };

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));

/* ============================================
   ACORDEÓN DE MADERAS
   ============================================ */

const woodPanels = document.querySelectorAll('[data-wood-panel]');

woodPanels.forEach((panel) => {
  const button = panel.querySelector('.wood-panel__button');

  button.addEventListener('click', () => {
    /* Cerramos los demás paneles */
    woodPanels.forEach((otherPanel) => {
      const otherButton = otherPanel.querySelector('.wood-panel__button');

      otherPanel.classList.remove('is-active');
      otherButton.setAttribute('aria-expanded', 'false');
    });

    /* Abrimos el panel seleccionado */
    panel.classList.add('is-active');
    button.setAttribute('aria-expanded', 'true');
  });
});


/* ---------- Trastes Private · Visión 2028 ---------- */

const privateStageData = {
  diseno: {
    progress: 20,
    number: '01 / 05',
    kicker: 'Etapa completada',
    title: 'Diseño inicial',
    date: '12 de abril de 2028',
    copy:
      'Se definieron el modelo, la escala, las proporciones y las principales decisiones ergonómicas del instrumento.',
    note:
      'El diseño prioriza una posición cómoda, peso equilibrado y acceso fluido a los últimos trastes.',
    image: 'images/private-diseno.jpg',
    alt: 'Planos y diseño inicial de una guitarra'
  },

  materiales: {
    progress: 40,
    number: '02 / 05',
    kicker: 'Etapa completada',
    title: 'Selección de materiales',
    date: '30 de abril de 2028',
    copy:
      'Se seleccionaron las piezas de madera según estabilidad, veta, densidad y respuesta esperada.',
    note:
      'La combinación elegida integra nogal para el cuerpo y arce para el mástil.',
    image: 'images/private-materiales.jpg',
    alt: 'Selección de maderas para construir una guitarra'
  },

  cuerpo: {
    progress: 68,
    number: '03 / 05',
    kicker: 'Etapa actual',
    title: 'Construcción del cuerpo',
    date: '18 de junio de 2028',
    copy:
      'La pieza fue cortada y comenzó el modelado de contornos. Próximo paso: cavidades, lijado y control de medidas.',
    note:
      'La veta respondió de forma estable durante el corte. Conservaremos su dibujo natural en el acabado final.',
    image: 'images/private-cuerpo.jpg',
    alt: 'Avance de construcción del cuerpo de una guitarra'
  },

  mastil: {
    progress: 82,
    number: '04 / 05',
    kicker: 'Próxima etapa',
    title: 'Mástil y trasteado',
    date: 'Previsto para julio de 2028',
    copy:
      'Se trabajará el perfil del mástil, la escala, la instalación de trastes y el ajuste de cada medida.',
    note:
      'El perfil se definirá a partir de las preferencias de agarre y ejecución del músico.',
    image: 'images/private-mastil.jpg',
    alt: 'Mástil de guitarra durante el proceso de construcción'
  },

  calibracion: {
    progress: 100,
    number: '05 / 05',
    kicker: 'Etapa final',
    title: 'Ensamblado y calibración',
    date: 'Previsto para agosto de 2028',
    copy:
      'El instrumento recibirá hardware, electrónica, cuerdas y los ajustes necesarios para su primera prueba.',
    note:
      'La calibración final definirá altura, entonación, respuesta y comodidad de ejecución.',
    image: 'images/private-calibracion.jpg',
    alt: 'Calibración final de una guitarra terminada'
  }
};

const privateStageButtons = document.querySelectorAll(
  '[data-private-stage]'
);

const privateProgressNumber = document.getElementById(
  'privateProgressNumber'
);

const privateProgressBar = document.getElementById(
  'privateProgressBar'
);

const privateStageImage = document.getElementById(
  'privateStageImage'
);

const privateStageDetail = document.getElementById(
  'privateStageDetail'
);

const privateStageKicker = document.getElementById(
  'privateStageKicker'
);

const privateStageTitle = document.getElementById(
  'privateStageTitle'
);

const privateStageDate = document.getElementById(
  'privateStageDate'
);

const privateStageCopy = document.getElementById(
  'privateStageCopy'
);

const privateStageNote = document.getElementById(
  'privateStageNote'
);

const privateImageCounter = document.querySelector(
  '.private-dashboard__image-counter'
);

const updatePrivateStage = (stageName) => {
  const stage = privateStageData[stageName];

  if (
    !stage ||
    !privateStageImage ||
    !privateStageDetail
  ) {
    return;
  }

  privateStageButtons.forEach((button) => {
    const selected =
      button.dataset.privateStage === stageName;

    button.classList.toggle('is-active', selected);
    button.setAttribute(
      'aria-pressed',
      String(selected)
    );
  });

  privateStageImage.classList.add('is-changing');
  privateStageDetail.classList.add('is-changing');

  window.setTimeout(() => {
    privateProgressNumber.textContent =
      `${stage.progress}%`;

    privateProgressBar.style.width =
      `${stage.progress}%`;

    privateImageCounter.textContent =
      stage.number;

    privateStageKicker.textContent =
      stage.kicker;

    privateStageTitle.textContent =
      stage.title;

    privateStageDate.textContent =
      stage.date;

    privateStageCopy.textContent =
      stage.copy;

    privateStageNote.textContent =
      stage.note;

    privateStageImage.src =
      stage.image;

    privateStageImage.alt =
      stage.alt;

    privateStageImage.classList.remove(
      'is-changing'
    );

    privateStageDetail.classList.remove(
      'is-changing'
    );
  }, 220);
};

privateStageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    updatePrivateStage(
      button.dataset.privateStage
    );
  });
});

});
