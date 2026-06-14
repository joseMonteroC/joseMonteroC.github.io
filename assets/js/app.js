/*
  ============================================================
  PORTAFOLIO PROFESIONAL - JOSÉ LUIS MONTERO
  ============================================================
  Archivo: script.js
  Descripción: Toda la lógica e interactividad del portafolio.

  ESTRUCTURA:
  01. Inicialización y estado global
  02. Loader inicial
  03. Tema (Dark / Light Mode)
  04. Navbar (scroll, menú móvil, sección activa)
  05. Typing Effect (hero)
  06. Scroll Reveal (aparición de elementos)
  07. Contadores animados (hero stats)
  08. Barras de habilidades (animación)
  09. Sliders de proyectos
  10. Formulario de contacto (validación)
  11. Botón "Volver Arriba"
  12. Smooth Scroll
  13. Año dinámico en footer
  14. Inicialización principal
  ============================================================
*/

/* ============================================================
  01. INICIALIZACIÓN Y ESTADO GLOBAL
  Variables y estado compartido entre módulos.
============================================================ */

/**
 * Estado global de la aplicación.
 * Centraliza las variables que se usan en múltiples funciones.
 */
const AppState = {
  isDarkMode: false,            // ¿Está activado el modo oscuro?
  isMenuOpen: false,            // ¿Está abierto el menú móvil?
  typingIndex: 0,               // Índice del texto actual en el typing effect
  typingCharIndex: 0,           // Índice del carácter actual
  typingDeleting: false,        // ¿Está borrando o escribiendo?
  countersAnimated: false,      // ¿Ya se animaron los contadores?
  skillsAnimated: false,        // ¿Ya se animaron las barras?
};

/* ============================================================
  02. LOADER INICIAL
  Muestra una pantalla de carga y la oculta al cargar la página.
============================================================ */

/**
 * Inicializa el loader.
 * Espera a que la página cargue completamente y luego
 * oculta el loader con una transición suave.
 */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Escucha el evento 'load' que se dispara cuando TODO está cargado
  // (imágenes, scripts, CSS, etc.)
  window.addEventListener('load', () => {
    // Pequeño delay para que la animación de la barra de progreso termine
    setTimeout(() => {
      loader.classList.add('hidden');

      // Elimina el loader del DOM completamente después de la transición
      // para liberar memoria
      setTimeout(() => {
        loader.remove();
      }, 600); // Debe coincidir con la duración de la transición en CSS
    }, 800);
  });
}

/* ============================================================
  03. TEMA OSCURO / CLARO
  Permite al usuario alternar entre modo claro y oscuro.
  Guarda la preferencia en localStorage para recordarla.
============================================================ */

/**
 * Inicializa el sistema de temas.
 * Lee la preferencia guardada o la preferencia del sistema operativo.
 */
function initTheme() {
  const body = document.body;
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  // Lee la preferencia guardada en localStorage
  // Si no hay ninguna, usa la preferencia del sistema operativo
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Aplica el tema correspondiente
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    enableDarkMode();
  } else {
    enableLightMode();
  }

  // Event listener del botón de cambio de tema
  themeBtn.addEventListener('click', () => {
    if (AppState.isDarkMode) {
      enableLightMode();
    } else {
      enableDarkMode();
    }
  });
}

/**
 * Activa el modo oscuro.
 * Cambia las clases del body y guarda en localStorage.
 */
function enableDarkMode() {
  document.body.classList.remove('light-mode');
  document.body.classList.add('dark-mode');
  AppState.isDarkMode = true;
  localStorage.setItem('portfolio-theme', 'dark');
}

/**
 * Activa el modo claro.
 */
function enableLightMode() {
  document.body.classList.remove('dark-mode');
  document.body.classList.add('light-mode');
  AppState.isDarkMode = false;
  localStorage.setItem('portfolio-theme', 'light');
}

/* ============================================================
  04. NAVBAR
  - Se vuelve opaco al hacer scroll.
  - Menú móvil (hamburguesa).
  - Indica qué sección está visible actualmente.
============================================================ */

/**
 * Inicializa todos los comportamientos del navbar.
 */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const menuBtn  = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!navbar) return;

  /* ---- Efecto de scroll del navbar ---- */
  // Añade la clase 'scrolled' cuando el usuario baja más de 80px
  const handleNavbarScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Ejecuta al inicio por si ya está con scroll

  /* ---- Menú hamburguesa (móvil) ---- */
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      AppState.isMenuOpen = !AppState.isMenuOpen;

      // Alterna la clase 'open' en el botón (anima la X)
      menuBtn.classList.toggle('open', AppState.isMenuOpen);

      // Muestra/oculta el menú
      mobileMenu.style.display = AppState.isMenuOpen ? 'block' : 'none';

      // Actualiza el atributo ARIA para accesibilidad
      menuBtn.setAttribute('aria-expanded', AppState.isMenuOpen.toString());
    });

    // Cierra el menú al hacer click en un link
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---- Indicador de sección activa ---- */
  // Usa IntersectionObserver para detectar qué sección es visible
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Quita la clase 'active' de todos los links
        navLinks.forEach(link => link.classList.remove('active'));

        // Añade 'active' al link que corresponde a la sección visible
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    // La sección se considera "activa" cuando ocupa el 40% del viewport
    threshold: 0.4,
    // Reduce el área de detección al centro de la pantalla
    rootMargin: '-20% 0px -20% 0px',
  });

  sections.forEach(section => sectionObserver.observe(section));

  /**
   * Función auxiliar para cerrar el menú móvil.
   */
  function closeMobileMenu() {
    AppState.isMenuOpen = false;
    if (menuBtn) {
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    if (mobileMenu) mobileMenu.style.display = 'none';
  }
}

/* ============================================================
  05. TYPING EFFECT
  Efecto de escritura y borrado en el título del hero.
  PERSONALIZAR: Cambia los textos del array 'phrases'.
============================================================ */

/**
 * Textos que aparecerán uno a uno en el hero.
 * PERSONALIZAR: Modifica, agrega o quita frases según tu perfil.
 * @type {string[]}
 */
const typingPhrases = [
  'Analista Programador',
  'Desarrollador de Software',
  'Python Developer',
  'Automatizador de Procesos',
  'Solucionador de Problemas',
];

/**
 * Configuración del typing effect.
 * PERSONALIZAR: Ajusta las velocidades en milisegundos.
 */
const typingConfig = {
  typeSpeed:   80,   // Velocidad de escritura (ms por carácter)
  deleteSpeed: 50,   // Velocidad de borrado
  pauseAfterType:  2000,  // Pausa después de escribir
  pauseAfterDelete: 500,  // Pausa después de borrar
};

/**
 * Inicia el efecto de escritura.
 */
function initTypingEffect() {
  const typedTextEl = document.getElementById('typed-text');
  if (!typedTextEl) return;

  /**
   * Función recursiva que maneja el ciclo de escritura/borrado.
   */
  function type() {
    // Obtiene la frase actual
    const currentPhrase = typingPhrases[AppState.typingIndex];

    if (!AppState.typingDeleting) {
      /* --- Modo escritura: agrega un carácter --- */
      typedTextEl.textContent = currentPhrase.substring(0, AppState.typingCharIndex + 1);
      AppState.typingCharIndex++;

      if (AppState.typingCharIndex === currentPhrase.length) {
        // Termino de escribir: pausa y luego empieza a borrar
        AppState.typingDeleting = true;
        setTimeout(type, typingConfig.pauseAfterType);
        return;
      }
    } else {
      /* --- Modo borrado: quita un carácter --- */
      typedTextEl.textContent = currentPhrase.substring(0, AppState.typingCharIndex - 1);
      AppState.typingCharIndex--;

      if (AppState.typingCharIndex === 0) {
        // Terminó de borrar: pasa a la siguiente frase
        AppState.typingDeleting = false;
        AppState.typingIndex = (AppState.typingIndex + 1) % typingPhrases.length;
        setTimeout(type, typingConfig.pauseAfterDelete);
        return;
      }
    }

    // Programa el siguiente ciclo
    const speed = AppState.typingDeleting ? typingConfig.deleteSpeed : typingConfig.typeSpeed;
    setTimeout(type, speed);
  }

  // Inicia el efecto con un pequeño delay
  setTimeout(type, 1000);
}

/* ============================================================
  06. SCROLL REVEAL
  Anima elementos al entrar en el viewport.
  Los elementos con clases .reveal-up, .reveal-left, .reveal-right
  se hacen visibles al hacer scroll.
============================================================ */

/**
 * Inicializa el IntersectionObserver para el scroll reveal.
 */
function initScrollReveal() {
  // Selecciona todos los elementos con clases de reveal
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Añade la clase 'visible' que activa la animación CSS
        entry.target.classList.add('visible');

        // Deja de observar el elemento (la animación solo ocurre una vez)
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Se activa cuando el 15% del elemento es visible
    rootMargin: '0px 0px -50px 0px', // Margen inferior negativo para activar antes del borde
  });

  // Observa cada elemento
  revealElements.forEach(el => revealObserver.observe(el));
}

/* ============================================================
  07. CONTADORES ANIMADOS
  Anima los números en el hero de 0 hasta su valor final.
============================================================ */

/**
 * Anima un número de 0 hasta su valor final.
 * @param {HTMLElement} el - Elemento cuyo texto se va a animar.
 * @param {number} target - Valor final del contador.
 * @param {number} duration - Duración de la animación en ms.
 */
function animateCounter(el, target, duration = 1500) {
  const startTime = performance.now();

  /**
   * Función de animación con requestAnimationFrame para
   * sincronizar con el ciclo de render del navegador.
   * @param {number} currentTime - Tiempo actual del frame.
   */
  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Función de ease-out para que la animación desacelere al final
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    // Actualiza el texto con el valor interpolado
    el.textContent = Math.floor(easedProgress * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Asegura que termine en el valor exacto
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

/**
 * Inicializa los contadores.
 * Los activa cuando el hero entra en el viewport.
 */
function initCounters() {
  const counterEls = document.querySelectorAll('.stat-number[data-target]');
  if (!counterEls.length) return;

  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !AppState.countersAnimated) {
        AppState.countersAnimated = true;

        // Anima cada contador con un pequeño delay entre ellos
        counterEls.forEach((el, index) => {
          const target = parseInt(el.dataset.target, 10);
          // Cada contador empieza 200ms después del anterior
          setTimeout(() => {
            animateCounter(el, target);
          }, index * 200);
        });

        // Deja de observar
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterObserver.observe(heroSection);
}

/* ============================================================
  08. BARRAS DE HABILIDADES
  Anima las barras de progreso cuando entran en pantalla.
============================================================ */

/**
 * Inicializa la animación de las barras de habilidades.
 * Usa IntersectionObserver para activarlas al hacer scroll.
 */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  if (!skillBars.length) return;

  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !AppState.skillsAnimated) {
        AppState.skillsAnimated = true;

        // Anima cada barra con un delay escalonado
        skillBars.forEach((bar, index) => {
          const level = parseInt(bar.dataset.level, 10);
          const fillEl = bar.querySelector('.skill-fill');

          if (!fillEl) return;

          setTimeout(() => {
            // Establece el ancho de la barra al valor real
            // La transición CSS hace la animación suave
            fillEl.style.width = `${level}%`;
          }, index * 150); // 150ms entre cada barra
        });

        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillsObserver.observe(skillsSection);
}

/* ============================================================
  09. SLIDERS DE PROYECTOS
  Slider automático y manual para las imágenes de cada proyecto.
  Cada tarjeta de proyecto tiene su propio slider independiente.
============================================================ */
/**
 * Inicializa el comportamiento de ampliación de imágenes (Lightbox)
 */
function initImageLightbox() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.modal-close');
  
  // Selecciona todas las imágenes que viven dentro de cualquier slider track
  const sliderImages = document.querySelectorAll('.slider-track img');

  if (!modal || !modalImg || !sliderImages.length) return;

  // Al hacer clic en cualquier imagen del slider, la abre en el modal
  sliderImages.forEach(img => {
    // Añadimos un cursor de lupa para que el usuario sepa que es cliqueable
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', (e) => {
      modal.style.display = 'flex';
      modalImg.src = e.target.src;
      modalImg.alt = e.target.alt;
      document.body.style.overflow = 'hidden'; // Bloquea el scroll de la web de fondo
    });
  });

  // Función para cerrar el modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Devuelve el scroll a la web
  }

  // Cerrar al hacer clic en la "X"
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Cerrar al hacer clic en el fondo negro
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Cerrar si presionan la tecla 'Escape'
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
}

// Asegúrate de ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Aquí probablemente ya llamas a tu initProjectSliders();
  initImageLightbox(); 
});

/**
 * Inicializa todos los sliders de proyectos.
 * Busca todas las tarjetas con `.project-slider` y las configura.
 */
function initProjectSliders() {
  const sliders = document.querySelectorAll('.project-slider');

  sliders.forEach(slider => {
    // Busca los elementos del slider dentro de la tarjeta actual
    const track      = slider.querySelector('.slider-track');
    const prevBtn    = slider.querySelector('.slider-prev');
    const nextBtn    = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');
    const images     = slider.querySelectorAll('.slider-track img');

    if (!track || !images.length) return;

    let currentIndex = 0;
    let autoSlideInterval = null;

    /* ---- Crea los puntos indicadores ---- */
    if (dotsContainer) {
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Ver imagen ${i + 1}`);

        // Al hacer click en un punto, va a esa imagen
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    /**
     * Navega a una imagen específica del slider.
     * @param {number} index - Índice de la imagen destino.
     */
    function goToSlide(index) {
      currentIndex = (index + images.length) % images.length;

      // Mueve el track horizontalmente
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Actualiza los puntos
      const dots = dotsContainer?.querySelectorAll('.slider-dot');
      dots?.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    /**
     * Va al siguiente slide.
     */
    function nextSlide() { goToSlide(currentIndex + 1); }

    /**
     * Va al slide anterior.
     */
    function prevSlide() { goToSlide(currentIndex - 1); }

    /* ---- Botones de navegación ---- */
    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide(); // Reinicia el auto-slide al interactuar
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    /* ---- Auto-slide: avanza cada 4 segundos ---- */
    function startAutoSlide() {
      // Solo auto-slide si hay más de una imagen
      if (images.length > 1) {
        autoSlideInterval = setInterval(nextSlide, 20000);
      }
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    /* ---- Pausa el auto-slide al hacer hover ---- */
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', () => startAutoSlide());

    /* ---- Soporte para touch/swipe (móvil) ---- */
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      // Si el swipe es mayor a 50px, cambia de slide
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide(); // Swipe izquierda → siguiente
        } else {
          prevSlide(); // Swipe derecha → anterior
        }
        resetAutoSlide();
      }
    }, { passive: true });

    // Inicia el auto-slide
    startAutoSlide();
  });
}

/* ============================================================
  10. FORMULARIO DE CONTACTO
  Validación en tiempo real y manejo del envío.
============================================================ */

/**
 * Inicializa el formulario de contacto con validaciones.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  /* ---- Validación en tiempo real ---- */
  // Escucha el evento 'blur' (cuando el campo pierde el foco)
  // en cada campo del formulario
  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      // Al escribir, si había un error, lo revisa en tiempo real
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  /* ---- Envío del formulario ---- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del navegador

    // Valida todos los campos antes de enviar
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    /* ---- Estado de carga ---- */
    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('span');
    const originalText = btnText?.textContent;

    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Enviando...';

    try {
      /*
        CÓMO HACER EL FORMULARIO FUNCIONAL:
        
        Opción 1 — Formspree (recomendado, gratuito):
        1. Crea una cuenta en https://formspree.io
        2. Crea un nuevo form y obtén tu ID (ej: "xabcdefg")
        3. Reemplaza la URL de abajo: 'https://formspree.io/f/TU_ID_AQUI'
        4. Descomenta el bloque de código de fetch
        
        Opción 2 — EmailJS:
        Ver documentación en https://emailjs.com

        Por ahora, el formulario simula un envío exitoso.
      */

      // --- DESCOMENTAR PARA USAR CON FORMSPREE ---
      /*
      const formData = new FormData(form);
      const response = await fetch('https://formspree.io/f/TU_ID_AQUI', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Error en el servidor');
      */

      // Simulación de envío (elimina esto cuando conectes el backend)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Éxito
      showFormStatus(statusEl, 'success',
        '✅ ¡Mensaje enviado! Me pondré en contacto contigo pronto.');
      form.reset();

    } catch (error) {
      // Error
      console.error('Error al enviar el formulario:', error);
      showFormStatus(statusEl, 'error',
        '❌ Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      // Restaura el botón
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = originalText;
    }
  });
}

/**
 * Valida un campo individual del formulario.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - El campo a validar.
 * @returns {boolean} - true si es válido, false si hay error.
 */
function validateField(field) {
  const errorEl = field.closest('.form-group')?.querySelector('.form-error');
  let errorMsg = '';

  /* Reglas de validación */
  if (field.required && !field.value.trim()) {
    errorMsg = 'Este campo es obligatorio.';
  } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
    errorMsg = 'Ingresa un correo válido (ej: nombre@dominio.com).';
  } else if (field.minLength > 0 && field.value.length < field.minLength) {
    errorMsg = `Mínimo ${field.minLength} caracteres.`;
  }

  /* Aplica el estado de error/válido */
  if (errorMsg) {
    field.classList.add('error');
    field.classList.remove('valid');
    if (errorEl) errorEl.textContent = errorMsg;
    return false;
  } else {
    field.classList.remove('error');
    if (field.value.trim()) field.classList.add('valid');
    if (errorEl) errorEl.textContent = '';
    return true;
  }
}

/**
 * Valida si un string tiene formato de email válido.
 * @param {string} email - String a validar.
 * @returns {boolean}
 */
function isValidEmail(email) {
  // Expresión regular para validar emails
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Muestra el mensaje de estado del formulario (éxito o error).
 * @param {HTMLElement} el - Elemento donde mostrar el mensaje.
 * @param {'success'|'error'} type - Tipo de mensaje.
 * @param {string} message - Texto del mensaje.
 */
function showFormStatus(el, type, message) {
  if (!el) return;
  el.textContent = message;
  el.className = `form-status ${type}`;

  // Oculta el mensaje automáticamente después de 6 segundos
  setTimeout(() => {
    el.className = 'form-status';
    el.textContent = '';
  }, 6000);
}

/* ============================================================
  11. BOTÓN "VOLVER ARRIBA"
  Aparece cuando el usuario ha bajado más de 400px.
============================================================ */

/**
 * Inicializa el botón de volver arriba.
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  /* ---- Muestra/oculta según scroll ---- */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  /* ---- Acción: scroll al inicio ---- */
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* ============================================================
  12. SMOOTH SCROLL
  Intercepta los clicks en links de ancla (#) para hacer
  scroll suave y ajustar el offset del navbar fijo.
============================================================ */

/**
 * Inicializa el smooth scroll para todos los links de ancla.
 */
function initSmoothScroll() {
  // Selecciona todos los links internos que empiezan con #
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Ignora links que son solo "#" (sin destino)
      if (href === '#') return;

      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();

      // Calcula la posición considerando la altura del navbar
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetPosition = targetEl.getBoundingClientRect().top
        + window.scrollY
        - navbarHeight
        - 16; // 16px extra de respiración

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}

/* ============================================================
  13. AÑO DINÁMICO EN FOOTER
  Actualiza automáticamente el año de copyright.
============================================================ */

/**
 * Inserta el año actual en el footer.
 * Así no hay que actualizarlo manualmente cada año.
 */
function initDynamicYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ============================================================
  14. RE-INICIALIZACIÓN DE ÍCONOS LUCIDE
  Lucide icons se inicializan al cargar la página,
  pero si se agregan íconos dinámicamente (ej: en sliders)
  hay que llamar a createIcons() de nuevo.
============================================================ */

/**
 * Reinicializa los íconos de Lucide.
 * Útil cuando se inyecta HTML dinámicamente.
 */
function refreshIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ============================================================
  INICIALIZACIÓN PRINCIPAL
  Punto de entrada de la aplicación.
  Se ejecuta cuando el DOM está completamente cargado.
============================================================ */

/**
 * Inicializa todos los módulos de la aplicación.
 * Se usa DOMContentLoaded para no esperar a las imágenes.
 */
document.addEventListener('DOMContentLoaded', () => {

  /*
    Orden de inicialización:
    1. Loader (primero para que aparezca lo antes posible)
    2. Tema (para evitar flash de tema incorrecto)
    3. Navbar
    4. Efectos visuales
    5. Interactividad
    6. Utilidades
  */

  initLoader();           // 02. Loader
  initTheme();            // 03. Dark/Light mode
  initNavbar();           // 04. Navbar inteligente
  initTypingEffect();     // 05. Efecto de escritura
  initScrollReveal();     // 06. Animaciones de scroll
  initCounters();         // 07. Contadores animados
  initSkillBars();        // 08. Barras de habilidades
  initProjectSliders();   // 09. Sliders de proyectos
  initContactForm();      // 10. Formulario de contacto
  initBackToTop();        // 11. Botón volver arriba
  initSmoothScroll();     // 12. Scroll suave
  initDynamicYear();      // 13. Año en footer
  refreshIcons();         // 14. Íconos (por si se renderizaron tarde)

  // Log de confirmación en consola (solo en desarrollo)
  // PERSONALIZAR: Puedes eliminar esto en producción
  console.log('%c✅ Portafolio inicializado correctamente', 'color: #2563EB; font-weight: bold;');
  console.log('%cJosé Luis Montero | Desarrollador de Software', 'color: #64748B;');
});

/*
  ============================================================
  CÓMO AGREGAR NUEVAS FUNCIONALIDADES:
  
  1. Crea una nueva función initNuevaFuncionalidad()
  2. Implementa la lógica dentro de ella
  3. Llama a la función dentro del bloque DOMContentLoaded
     al final del archivo
  
  Ejemplo:
  
  function initGalleryModal() {
    // Tu código aquí
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // ... inicializaciones existentes ...
    initGalleryModal(); // <-- Agrega aquí
  });
  ============================================================
*/