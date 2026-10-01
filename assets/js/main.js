/**
 * Numan Khan Khilji - Interlock & Paving Contractor
 * Main JavaScript Interactions & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Contractor Contact Info Constant
  const CONTRACTOR_PHONE = '+966 543 574 022';
  const WA_CLEAN_NUMBER = '966543574022';

  /* --------------------------------------------------
     1. Sticky Navigation & Scroll Spy
     -------------------------------------------------- */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleScroll = () => {
    const scrollPos = window.scrollY || window.pageYOffset;

    // Header sticky shadow
    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top visibility
    if (scrollTopBtn) {
      if (scrollPos > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Scroll Spy for Nav Links
    let currentId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });

    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------
     2. Mobile Drawer Navigation
     -------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDrawer = () => {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  /* --------------------------------------------------
     3. Before / After Interactive Paving Slider
     -------------------------------------------------- */
  const compSlider = document.getElementById('beforeAfterSlider');
  const beforeBox = document.getElementById('beforeBox');
  const sliderHandle = document.getElementById('sliderHandle');

  if (compSlider && beforeBox && sliderHandle) {
    let isSliding = false;

    const setPosition = (clientX) => {
      const rect = compSlider.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeBox.style.width = `${percentage}%`;
      sliderHandle.style.left = `${percentage}%`;
    };

    const startSlide = (e) => {
      isSliding = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    };

    const moveSlide = (e) => {
      if (!isSliding) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    };

    const stopSlide = () => {
      isSliding = false;
    };

    compSlider.addEventListener('mousedown', startSlide);
    window.addEventListener('mousemove', moveSlide);
    window.addEventListener('mouseup', stopSlide);

    compSlider.addEventListener('touchstart', startSlide, { passive: true });
    window.addEventListener('touchmove', moveSlide, { passive: true });
    window.addEventListener('touchend', stopSlide);
  }

  /* --------------------------------------------------
     4. Portfolio Filter Logic
     -------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      portfolioItems.forEach((item) => {
        const itemCategories = item.getAttribute('data-category') || '';
        if (filterVal === 'all' || itemCategories.includes(filterVal)) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 30);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* --------------------------------------------------
     5. Portfolio Lightbox Modal
     -------------------------------------------------- */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbCategory = document.getElementById('lbCategory');
  const lbDesc = document.getElementById('lbDesc');
  const lbWaBtn = document.getElementById('lbWaBtn');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeIndex = 0;
  const portfolioCards = Array.from(document.querySelectorAll('.portfolio-inner'));

  const updateLightboxContent = (index) => {
    const card = portfolioCards[index];
    if (!card) return;

    const src = card.getAttribute('data-src');
    const title = card.getAttribute('data-title');
    const category = card.getAttribute('data-category');
    const desc = card.getAttribute('data-desc');

    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = title;
    }
    if (lbTitle) lbTitle.textContent = title;
    if (lbCategory) lbCategory.textContent = category;
    if (lbDesc) lbDesc.textContent = desc;

    if (lbWaBtn) {
      const waMsg = encodeURIComponent(
        `Hello Numan Khan Khilji, I am interested in this paving style: "${title}" (${category}). Could you provide a quote/consultation?`
      );
      lbWaBtn.href = `https://wa.me/${WA_CLEAN_NUMBER}?text=${waMsg}`;
    }
  };

  const openLightbox = (index) => {
    activeIndex = index;
    updateLightboxContent(activeIndex);
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  portfolioCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIndex = (activeIndex - 1 + portfolioCards.length) % portfolioCards.length;
      updateLightboxContent(activeIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIndex = (activeIndex + 1) % portfolioCards.length;
      updateLightboxContent(activeIndex);
    });
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  /* --------------------------------------------------
     6. Quote Form Validation & WhatsApp Generator
     -------------------------------------------------- */
  const quoteForm = document.getElementById('quoteRequestForm');
  const formSuccessBox = document.getElementById('formSuccessBox');
  const successSummaryText = document.getElementById('successSummaryText');
  const successWaLink = document.getElementById('successWaLink');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Inputs
      const fullNameInput = document.getElementById('fullName');
      const phoneInput = document.getElementById('phoneNumber');
      const projectTypeInput = document.getElementById('projectType');
      const locationInput = document.getElementById('projectLocation');
      const messageInput = document.getElementById('projectMessage');
      const directWaCheck = document.getElementById('directWhatsAppCheck');

      // Error Labels
      const nameError = document.getElementById('nameError');
      const phoneError = document.getElementById('phoneError');
      const typeError = document.getElementById('typeError');
      const locError = document.getElementById('locError');
      const msgError = document.getElementById('msgError');

      // Reset errors
      [fullNameInput, phoneInput, projectTypeInput, locationInput, messageInput].forEach((input) => {
        if (input) input.classList.remove('is-invalid');
      });
      [nameError, phoneError, typeError, locError, msgError].forEach((err) => {
        if (err) err.classList.remove('visible');
      });

      // Name Validation
      const fullName = fullNameInput ? fullNameInput.value.trim() : '';
      if (!fullName || fullName.length < 2) {
        if (fullNameInput) fullNameInput.classList.add('is-invalid');
        if (nameError) nameError.classList.add('visible');
        isValid = false;
      }

      // Phone Validation
      const phone = phoneInput ? phoneInput.value.trim() : '';
      if (!phone || phone.length < 7) {
        if (phoneInput) phoneInput.classList.add('is-invalid');
        if (phoneError) phoneError.classList.add('visible');
        isValid = false;
      }

      // Project Type Validation
      const projectType = projectTypeInput ? projectTypeInput.value : '';
      if (!projectType) {
        if (projectTypeInput) projectTypeInput.classList.add('is-invalid');
        if (typeError) typeError.classList.add('visible');
        isValid = false;
      }

      // Location Validation
      const location = locationInput ? locationInput.value.trim() : '';
      if (!location) {
        if (locationInput) locationInput.classList.add('is-invalid');
        if (locError) locError.classList.add('visible');
        isValid = false;
      }

      // Message Validation
      const message = messageInput ? messageInput.value.trim() : '';
      if (!message) {
        if (messageInput) messageInput.classList.add('is-invalid');
        if (msgError) msgError.classList.add('visible');
        isValid = false;
      }

      if (!isValid) return;

      // Prepare Structured WhatsApp Message
      const waText = 
`*NEW QUOTE REQUEST - NUMAN KHAN KHILJI INTERLOCK*
----------------------------------------
*Name:* ${fullName}
*Phone:* ${phone}
*Project Type:* ${projectType}
*Location:* ${location}
*Project Scope / Details:*
${message}
----------------------------------------
_Inquiry via Numan Khan Khilji Business Website_`;

      const encodedMsg = encodeURIComponent(waText);
      const waUrl = `https://wa.me/${WA_CLEAN_NUMBER}?text=${encodedMsg}`;

      // Open WhatsApp directly if checkbox checked
      const shouldOpenWa = directWaCheck ? directWaCheck.checked : true;
      if (shouldOpenWa) {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      // Show Success Box in Form Card
      quoteForm.style.display = 'none';
      if (formSuccessBox) {
        formSuccessBox.style.display = 'block';
        if (successSummaryText) {
          successSummaryText.innerHTML = `
            Thank you, <strong>${fullName}</strong>! Your quote request for <strong>${projectType}</strong> at <strong>${location}</strong> has been prepared. Click below to view or send your message directly to Numan Khan Khilji on WhatsApp.
          `;
        }
        if (successWaLink) {
          successWaLink.href = waUrl;
        }
      }
    });
  }

  // Reset form button
  if (resetFormBtn && quoteForm && formSuccessBox) {
    resetFormBtn.addEventListener('click', () => {
      quoteForm.reset();
      quoteForm.style.display = 'flex';
      formSuccessBox.style.display = 'none';
    });
  }

  /* --------------------------------------------------
     7. Scroll Reveal Animations
     -------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.about-section .section-header, .about-media-col, .about-text-col, .about-stats-row, .pillar-item, .stat-card, .service-card, .why-card, .process-step, .team-card'
  );

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -36px 0px'
    });

    revealTargets.forEach((element) => {
      element.classList.add('reveal-on-scroll');
      revealObserver.observe(element);
    });
  }

});
