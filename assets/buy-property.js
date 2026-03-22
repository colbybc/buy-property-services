/**
 * Buy Property Services - Custom JavaScript
 * ==========================================
 * Vanilla JS only (no jQuery). All functionality wrapped in DOMContentLoaded.
 * Uses requestAnimationFrame for scroll-based handlers to avoid jank.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================================
     1. SCROLL REVEAL ANIMATION
     Uses IntersectionObserver to watch elements with .reveal-on-scroll class.
     When an element enters the viewport (10% visible), it gets the .revealed
     class added, which you can target in CSS for fade-in/slide-up animations.
  ========================================================================== */

  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    // If IntersectionObserver isn't supported, reveal everything immediately
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Stop observing once revealed (animation only happens once)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach(function (el) {
      // Check if element is already in viewport on page load
      var rect = el.getBoundingClientRect();
      var inViewport =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      if (inViewport) {
        el.classList.add('revealed');
      } else {
        observer.observe(el);
      }
    });
  }

  initScrollReveal();


  /* ==========================================================================
     2. HEADER SCROLL EFFECT
     Adds .header--scrolled class to the site header when the user scrolls
     past 50px. Removes it when they scroll back to the top.
     Uses requestAnimationFrame to throttle the scroll handler.
  ========================================================================== */

  function initHeaderScroll() {
    var header = document.querySelector('.section-header');
    if (!header) return;

    var scrollThreshold = 50;
    var ticking = false;

    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Run once on load in case page is already scrolled (e.g. browser back)
    updateHeader();
  }

  initHeaderScroll();


  /* ==========================================================================
     3. SELLING / RENTING TOGGLE
     Handles clicks on .hero-toggle-btn buttons (e.g. "Buy" vs "Rent" tabs
     on the homepage hero). Adds .active to the clicked button and removes
     it from the sibling button. You can extend this later to show/hide
     different service category grids.
  ========================================================================== */

  function initHeroToggle() {
    var toggleButtons = document.querySelectorAll('.hero-toggle-btn');
    if (!toggleButtons.length) return;

    toggleButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Remove .active from all sibling toggle buttons
        toggleButtons.forEach(function (sibling) {
          sibling.classList.remove('active');
        });
        // Add .active to the clicked button
        btn.classList.add('active');

        // Future: show/hide service categories based on data attribute
        // var category = btn.dataset.category; // e.g. "selling" or "renting"
        // document.querySelectorAll('.service-category').forEach(function(cat) {
        //   cat.hidden = cat.dataset.category !== category;
        // });
      });
    });
  }

  initHeroToggle();


  /* ==========================================================================
     4. SMOOTH SCROLL FOR ANCHOR LINKS
     Intercepts clicks on any <a> whose href starts with "#" and smoothly
     scrolls to the target element instead of jumping instantly.
  ========================================================================== */

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      // Ignore empty hash links (href="#")
      if (targetId === '#' || targetId.length < 2) return;

      var targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  }

  initSmoothScroll();


  /* ==========================================================================
     5. MOBILE BOTTOM SHEET CART
     Simple bottom-sheet behavior for .cart-bottom-sheet element.
     - Listens for [data-open-cart-sheet] clicks to slide the sheet up.
     - Listens for [data-close-cart-sheet] clicks (or overlay tap) to close.
     - Adds/removes .cart-bottom-sheet--open class for CSS transitions.
  ========================================================================== */

  function initBottomSheetCart() {
    var sheet = document.querySelector('.cart-bottom-sheet');
    if (!sheet) return;

    var overlay = sheet.querySelector('.cart-bottom-sheet__overlay');

    function openSheet() {
      sheet.classList.add('cart-bottom-sheet--open');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeSheet() {
      sheet.classList.remove('cart-bottom-sheet--open');
      document.body.style.overflow = '';
    }

    // Open triggers
    document.querySelectorAll('[data-open-cart-sheet]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openSheet();
      });
    });

    // Close triggers (close button inside the sheet)
    document.querySelectorAll('[data-close-cart-sheet]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        closeSheet();
      });
    });

    // Close when tapping the overlay background
    if (overlay) {
      overlay.addEventListener('click', closeSheet);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('cart-bottom-sheet--open')) {
        closeSheet();
      }
    });
  }

  initBottomSheetCart();


  /* ==========================================================================
     6. SERVICE CARD HOVER - SUBTLE PARALLAX TILT
     On desktop, adds a very subtle 3D tilt effect to .glass-card elements
     when the mouse moves over them. Max rotation is 2-3 degrees.
     Disabled on touch devices to avoid weird behavior.
  ========================================================================== */

  function initCardTilt() {
    // Skip on touch devices (no hover anyway)
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    var cards = document.querySelectorAll('.glass-card');
    if (!cards.length) return;

    var maxTilt = 3; // Maximum tilt in degrees

    cards.forEach(function (card) {
      var ticking = false;
      var currentX = 0;
      var currentY = 0;

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        // Calculate mouse position relative to card center (-0.5 to 0.5)
        currentX = (e.clientX - rect.left) / rect.width - 0.5;
        currentY = (e.clientY - rect.top) / rect.height - 0.5;

        if (!ticking) {
          requestAnimationFrame(function () {
            // rotateY for horizontal movement, rotateX for vertical (inverted)
            var rotateX = -(currentY * maxTilt * 2);
            var rotateY = currentX * maxTilt * 2;
            card.style.transform =
              'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.01)';
            ticking = false;
          });
          ticking = true;
        }
      });

      card.addEventListener('mouseleave', function () {
        // Smoothly reset the card to its original position
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  initCardTilt();

});
