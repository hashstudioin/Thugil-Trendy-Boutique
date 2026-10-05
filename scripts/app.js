/* ==========================================================================
   THUGIL TRENDY BOUTIQUE - MAIN APPLICATION LOGIC
   Routing, Gallery Filtering, Lightbox, Booking System & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initRouting();
  initGalleryFilter();
  initLightbox();
  initBookingForm();
  initScrollAnimations();
});

/* ==========================================================================
   1. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.mobile-nav-links a');

  function toggleDrawer(open) {
    if (drawer && backdrop) {
      if (open) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => toggleDrawer(true));
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => toggleDrawer(false));
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });
}

/* ==========================================================================
   3. SEAMLESS CLIENT ROUTING (HOME & DEDICATED SUBPAGES)
   ========================================================================== */
function initRouting() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-links a');
  const pages = document.querySelectorAll('.page-view');

  function handleRoute() {
    const hash = window.location.hash || '#home';
    const targetPageId = 'page-' + hash.replace('#', '').replace('/', '');

    // Check if target subpage exists
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
      pages.forEach(p => p.classList.remove('active'));
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Default to Home page view
      const homePage = document.getElementById('page-home');
      if (homePage) {
        pages.forEach(p => p.classList.remove('active'));
        homePage.classList.add('active');
      }

      // If it's an anchor within the home page, scroll smoothly to that section
      if (hash.startsWith('#') && hash !== '#home') {
        const anchorTarget = document.querySelector(hash);
        if (anchorTarget) {
          setTimeout(() => {
            anchorTarget.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }

    // Update active nav link
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === hash || (hash === '' && href === '#home')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

/* ==========================================================================
   4. GALLERY FILTERING & MASONRY
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filterValue === 'all' || category === filterValue || item.classList.contains(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. LIGHTBOX MODAL & ENQUIRY INTEGRATION
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.lightbox-close');
  const imgEl = modal.querySelector('.lightbox-img');
  const titleEl = modal.querySelector('.lightbox-title');
  const descEl = modal.querySelector('.lightbox-desc');
  const tagEl = modal.querySelector('.lightbox-tag');
  const whatsappCta = modal.querySelector('.lightbox-whatsapp-cta');

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('img');
      const title = item.dataset.title || item.querySelector('.masonry-title')?.textContent || 'Custom Designer Garment';
      const desc = item.dataset.desc || item.querySelector('p')?.textContent || 'Handcrafted bespoke stitching & designer Aari embroidery by Thugil Trendy Boutique.';
      const tag = item.dataset.tag || item.querySelector('.masonry-tag')?.textContent || 'Bespoke Collection';

      if (imgEl && img) imgEl.src = img.src;
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (tagEl) tagEl.textContent = tag;

      if (whatsappCta) {
        const msg = encodeURIComponent(`Hi Thugil Trendy Boutique, I am interested in designing an outfit similar to: "${title}". Please share details.`);
        whatsappCta.href = `https://wa.me/919894510713?text=${msg}`;
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   6. BOOKING FORM & WHATSAPP FORWARDING
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#book-name').value.trim();
    const phone = form.querySelector('#book-phone').value.trim();
    const service = form.querySelector('#book-service').value;
    const date = form.querySelector('#book-date').value;
    const notes = form.querySelector('#book-notes').value.trim();

    if (!name || !phone) {
      alert('Please provide your Name and Contact Phone Number.');
      return;
    }

    const whatsappMessage = 
      `*New Appointment Request - Thugil Trendy Boutique*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `👗 *Service:* ${service}\n` +
      `📅 *Preferred Date/Time:* ${date || 'Flexible'}\n` +
      `📝 *Notes/Requirements:* ${notes || 'Standard custom consultation'}`;

    const encoded = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/919894510713?text=${encoded}`;

    // Success notice in UI
    const successMsg = document.createElement('div');
    successMsg.style.padding = '1.25rem';
    successMsg.style.background = '#E8F5E9';
    successMsg.style.color = '#2E7D32';
    successMsg.style.borderRadius = '6px';
    successMsg.style.marginTop = '1rem';
    successMsg.style.fontWeight = '600';
    successMsg.style.border = '1px solid #A5D6A7';
    successMsg.innerHTML = '✨ Thank you! Opening WhatsApp to confirm your appointment consultation with our master tailor...';

    form.appendChild(successMsg);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      form.reset();
      setTimeout(() => successMsg.remove(), 4000);
    }, 800);
  });
}

/* ==========================================================================
   7. SCROLL INTERSECTION REVEAL & KOLAM ANIMATION
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.service-card, .review-card, .about-value-box, .story-image-stack, .aari-flow-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
