/* ============================================================
  01. INICIALIZACIÓN Y ESTADO GLOBAL
  Variables y estado compartido entre módulos.
============================================================ */

const AppState = {
  isDarkMode: false,
  isMenuOpen: false,
  typingIndex: 0,
  typingCharIndex: 0,
  typingDeleting: false,
  countersAnimated: false,
  skillsAnimated: false,
};

/* ============================================================
  02. LOADER INICIAL
============================================================ */

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');

      setTimeout(() => {
        loader.remove();
      }, 600);
    }, 800);
  });
}

       /* =============================================
                  MODAL DE DESCARGA DE CV
       ================================================ */
       
    const cvModal = document.getElementById("cvModal");
    const closeCvModal = document.getElementById("closeCvModal");

    const openCvButtons = document.querySelectorAll(".open-cv-modal");

    openCvButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            cvModal.classList.add("active");
        });
    });

    closeCvModal.addEventListener("click", () => {
        cvModal.classList.remove("active");
    });

    cvModal.addEventListener("click", (e) => {
        if (e.target === cvModal) {
            cvModal.classList.remove("active");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cvModal.classList.remove("active");
        }
    });

/* ============================================================
  03. TEMA OSCURO / CLARO
============================================================ */

function initTheme() {
  const body = document.body;
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    enableDarkMode();
  } else {
    enableLightMode();
  }

  themeBtn.addEventListener('click', () => {
    if (AppState.isDarkMode) {
      enableLightMode();
    } else {
      enableDarkMode();
    }
  });
}

function enableDarkMode() {
  document.body.classList.remove('light-mode');
  document.body.classList.add('dark-mode');
  AppState.isDarkMode = true;
  localStorage.setItem('portfolio-theme', 'dark');
}

function enableLightMode() {
  document.body.classList.remove('dark-mode');
  document.body.classList.add('light-mode');
  AppState.isDarkMode = false;
  localStorage.setItem('portfolio-theme', 'light');
}

/* ============================================================
  04. NAVBAR
============================================================ */

function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const menuBtn  = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!navbar) return;

  const handleNavbarScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); 

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      AppState.isMenuOpen = !AppState.isMenuOpen;

      menuBtn.classList.toggle('open', AppState.isMenuOpen);

      mobileMenu.style.display = AppState.isMenuOpen ? 'block' : 'none';

      menuBtn.setAttribute('aria-expanded', AppState.isMenuOpen.toString());
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));

        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '-20% 0px -20% 0px',
  });

  sections.forEach(section => sectionObserver.observe(section));

  function closeMobileMenu() {
    AppState.isMenuOpen = false;
    if (menuBtn) {
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    if (mobileMenu) mobileMenu.style.display = 'none';
  }
}

document.addEventListener("DOMContentLoaded", () => {

    const lines = document.querySelectorAll(".code-line");

    const positions = [];

    lines.forEach((_, i) => {

        const top = ((i + 1) / (lines.length + 1)) * 100;

        let left;

        if (i % 2 === 0) {
            left = 5 + Math.random() * 10;
        }
        else {
            left = 75 + Math.random() * 10;
        }

        positions.push({
            top,
            left,
            side: i % 2 === 0 ? "left" : "right"
        });
    });

    lines.forEach((line, i) => {
        line.style.top = positions[i].top + "%";
        line.style.left = positions[i].left + "%";
    });

    setInterval(() => {

        const side = Math.random() < 0.5 ? "left" : "right";

        const indexes = positions
            .map((pos, index) => ({ pos, index }))
            .filter(item => item.pos.side === side)
            .map(item => item.index);

        if (indexes.length < 2) return;

        const a = indexes[Math.floor(Math.random() * indexes.length)];

        let b;
        do {
            b = indexes[Math.floor(Math.random() * indexes.length)];
        } while (a === b);

        [positions[a], positions[b]] = [positions[b], positions[a]];

        positions[a].side = side;
        positions[b].side = side;

        lines.forEach((line, i) => {
            line.style.top = positions[i].top + "%";
            line.style.left = positions[i].left + "%";
        });

    }, 5000);

});

/* ============================================================
  05. TYPING EFFECT
============================================================ */

const typingPhrases = [
  'Analista Programador',
  'Desarrollador de Software',
  'Python Developer',
  'Automatizador de Procesos',
  'Solucionador de Problemas',
];

const typingConfig = {
  typeSpeed:   80,
  deleteSpeed: 50,
  pauseAfterType:  2000,
  pauseAfterDelete: 500,
};

function initTypingEffect() {
  const typedTextEl = document.getElementById('typed-text');
  if (!typedTextEl) return;

  function type() {
    const currentPhrase = typingPhrases[AppState.typingIndex];

    if (!AppState.typingDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, AppState.typingCharIndex + 1);
      AppState.typingCharIndex++;

      if (AppState.typingCharIndex === currentPhrase.length) {
        AppState.typingDeleting = true;
        setTimeout(type, typingConfig.pauseAfterType);
        return;
      }
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, AppState.typingCharIndex - 1);
      AppState.typingCharIndex--;

      if (AppState.typingCharIndex === 0) {
        AppState.typingDeleting = false;
        AppState.typingIndex = (AppState.typingIndex + 1) % typingPhrases.length;
        setTimeout(type, typingConfig.pauseAfterDelete);
        return;
      }
    }

    const speed = AppState.typingDeleting ? typingConfig.deleteSpeed : typingConfig.typeSpeed;
    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
}

/* ============================================================
  06. SCROLL REVEAL
============================================================ */

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ============================================================
  07. CONTADORES ANIMADOS
============================================================ */

function animateCounter(el, target, duration = 1500) {
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.floor(easedProgress * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counterEls = document.querySelectorAll('.stat-number[data-target]');
  if (!counterEls.length) return;

  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !AppState.countersAnimated) {
        AppState.countersAnimated = true;

        counterEls.forEach((el, index) => {
          const target = parseInt(el.dataset.target, 10);
          setTimeout(() => {
            animateCounter(el, target);
          }, index * 200);
        });

        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterObserver.observe(heroSection);
}

/* ============================================================
  08. BARRAS DE HABILIDADES
============================================================ */

function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  if (!skillBars.length) return;

  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !AppState.skillsAnimated) {
        AppState.skillsAnimated = true;

        skillBars.forEach((bar, index) => {
          const level = parseInt(bar.dataset.level, 10);
          const fillEl = bar.querySelector('.skill-fill');

          if (!fillEl) return;

          setTimeout(() => {
            fillEl.style.width = `${level}%`;
          }, index * 150);
        });

        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillsObserver.observe(skillsSection);
}

/* ============================================================
  09. SLIDERS DE PROYECTOS
============================================================ */
function initImageLightbox() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.modal-close');
  
  const sliderImages = document.querySelectorAll('.slider-track img');

  if (!modal || !modalImg || !sliderImages.length) return;

  sliderImages.forEach(img => {
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', (e) => {
      modal.style.display = 'flex';
      modalImg.src = e.target.src;
      modalImg.alt = e.target.alt;
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initImageLightbox(); 
});

function initProjectSliders() {
  const sliders = document.querySelectorAll('.project-slider');

  sliders.forEach(slider => {
    const track      = slider.querySelector('.slider-track');
    const prevBtn    = slider.querySelector('.slider-prev');
    const nextBtn    = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');
    const images     = slider.querySelectorAll('.slider-track img');

    if (!track || !images.length) return;

    let currentIndex = 0;
    let autoSlideInterval = null;

    if (dotsContainer) {
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Ver imagen ${i + 1}`);

        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      currentIndex = (index + images.length) % images.length;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      const dots = dotsContainer?.querySelectorAll('.slider-dot');
      dots?.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }


    function nextSlide() { goToSlide(currentIndex + 1); }


    function prevSlide() { goToSlide(currentIndex - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide(); 
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    function startAutoSlide() {
      if (images.length > 1) {
        autoSlideInterval = setInterval(nextSlide, 20000);
      }
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', () => startAutoSlide());

    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoSlide();
      }
    }, { passive: true });

    startAutoSlide();
  });
}

/* ============================================================
  10. FORMULARIO DE CONTACTO
============================================================ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('span');
    const originalText = btnText?.textContent;

    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Enviando...';

    try {
      const formspreeURL = form.dataset.formspree;

      if (!formspreeURL) {
        throw new Error('No se encontró la URL de Formspree en el formulario.');
      }

      const formData = new FormData(form);

      const response = await fetch(formspreeURL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.errors?.[0]?.message || 'Error del servidor');
      }

      showFormStatus(
        statusEl,
        'success',
        '✅ ¡Mensaje enviado! Me pondré en contacto contigo pronto.'
      );
      form.reset();

      inputs.forEach(input => input.classList.remove('valid'));

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      showFormStatus(
        statusEl,
        'error',
        '❌ Hubo un error al enviar. Intenta de nuevo o escríbeme directo a jose.monterocontreras99@gmail.com'
      );

    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = originalText;
    }
  });
}

function validateField(field) {
  const errorEl = field.closest('.form-group')?.querySelector('.form-error');
  let errorMsg = '';

  if (field.required && !field.value.trim()) {
    errorMsg = 'Este campo es obligatorio.';
  } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
    errorMsg = 'Ingresa un correo válido (ej: nombre@dominio.com).';
  } else if (field.minLength > 0 && field.value.length < field.minLength) {
    errorMsg = `Mínimo ${field.minLength} caracteres.`;
  }

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormStatus(el, type, message) {
  if (!el) return;
  el.textContent = message;
  el.className = `form-status ${type}`;

  setTimeout(() => {
    el.className = 'form-status';
    el.textContent = '';
  }, 6000);
}

/* ============================================================
  11. BOTÓN "VOLVER ARRIBA"
============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* ============================================================
  12. SMOOTH SCROLL
============================================================ */

function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href === '#') return;

      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetPosition = targetEl.getBoundingClientRect().top
        + window.scrollY
        - navbarHeight
        - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}

/* ============================================================
  13. AÑO DINÁMICO EN FOOTER
============================================================ */

function initDynamicYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ============================================================
  14. RE-INICIALIZACIÓN DE ÍCONOS LUCIDE
============================================================ */

function refreshIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ============================================================
  INICIALIZACIÓN PRINCIPAL
============================================================ */

document.addEventListener('DOMContentLoaded', () => {


  initLoader();
  initTheme();
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initProjectSliders();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
  initDynamicYear();
  refreshIcons();

  console.log('%c✅ Portafolio inicializado correctamente', 'color: #2563EB; font-weight: bold;');
  console.log('%cJosé Luis Montero | Desarrollador de Software', 'color: #64748B;');
});
