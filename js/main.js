/* ============================================
   main.js — Gallery, Navigation, Share
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================
  // Nav scroll shadow
  // ============================================
  const nav = document.getElementById('nav');

  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  }

  // ============================================
  // Photo Gallery — Load from photos.json
  // ============================================
  var galleryGrid = document.getElementById('galleryGrid');
  var galleryEmpty = document.getElementById('galleryEmpty');

  function loadGallery() {
    if (!galleryGrid) return;

    fetch('photos/photos.json')
      .then(function (response) {
        if (!response.ok) throw new Error('No photos.json found');
        return response.json();
      })
      .then(function (photos) {
        if (!Array.isArray(photos) || photos.length === 0) return;

        // Hide the "coming soon" message
        if (galleryEmpty) galleryEmpty.style.display = 'none';

        // Build gallery items
        photos.forEach(function (photo) {
          var link = document.createElement('a');
          link.href = 'photos/' + photo.src;
          link.classList.add('gallery__item', 'glightbox');
          link.setAttribute('data-glightbox', 'title: ' + (photo.alt || ''));

          var img = document.createElement('img');
          img.src = 'photos/' + photo.src;
          img.alt = photo.alt || 'Photo of Ashish';
          img.loading = 'lazy';

          link.appendChild(img);
          galleryGrid.appendChild(link);
        });

        // Initialize GLightbox after images are added
        if (typeof GLightbox !== 'undefined') {
          GLightbox({ selector: '.glightbox' });
        }
      })
      .catch(function () {
        // photos.json not found or empty — keep the "coming soon" message
      });
  }

  loadGallery();

  // ============================================
  // Share Button
  // ============================================
  var shareBtn = document.getElementById('shareBtn');

  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var shareData = {
        title: 'Help Ashish Pokharel – Support His Recovery',
        text: 'Ashish recently suffered a stroke and is recovering. His family needs support — donate, volunteer, or send supplies.',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(function () {
          // User cancelled or share failed — no action needed
        });
      } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(function () {
          shareBtn.textContent = '✅ Link Copied!';
          setTimeout(function () {
            shareBtn.textContent = '📤 Share';
          }, 2000);
        }).catch(function () {
          // Clipboard failed — prompt user
          window.prompt('Copy this link to share:', window.location.href);
        });
      }
    });
  }

})();
