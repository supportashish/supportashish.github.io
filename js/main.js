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

        // These photos go first in the grid
        var priorityFiles = [
          '5f1337d2-7227-43e1-b5d8-4727b3e2503c.jpeg',
          '598c23bb-4524-4f91-8a3c-49a61f17eab1.jpeg',
          '764dbae0-8705-4024-9dac-8408efb13539.jpeg',
          '1190725738164238141.jpg',
          '1930232854322823112.jpg',
          'bff7c8af-6fdf-46a4-aff4-cb50866682a1.jpeg',
          'FE73196B-DC0A-4F78-A7B8-D593EF11F331_1_105_c.jpeg',
          'DBF28861-4092-4D83-9C0A-E76A18F5F622_1_105_c.jpeg',
          '43054b14-4010-4440-af0f-2f7e9f86d48c.jpeg'
        ];

        // Sort: priority photos first (in order), then the rest
        var priority = [];
        var rest = [];
        priorityFiles.forEach(function (f) {
          var match = photos.find(function (p) { return p.src === f; });
          if (match) priority.push(match);
        });
        photos.forEach(function (p) {
          if (priorityFiles.indexOf(p.src) === -1) rest.push(p);
        });
        var sorted = priority.concat(rest);

        if (sorted.length > 0) {
          if (galleryEmpty) galleryEmpty.style.display = 'none';
        }

        // Build gallery items
        sorted.forEach(function (photo) {
          var link = document.createElement('a');
          link.classList.add('gallery__item', 'glightbox');

          if (photo.type === 'video') {
            link.href = 'photos/' + photo.src;
            link.setAttribute('data-glightbox', 'type: video');

            var videoThumb = document.createElement('div');
            videoThumb.classList.add('gallery__video-thumb');
            videoThumb.innerHTML = '<span class="gallery__play-icon">&#9654;</span>';

            var video = document.createElement('video');
            video.src = 'photos/' + photo.src;
            video.muted = true;
            video.preload = 'metadata';
            videoThumb.insertBefore(video, videoThumb.firstChild);

            link.appendChild(videoThumb);
          } else {
            link.href = 'photos/' + photo.src;

            var img = document.createElement('img');
            img.src = 'photos/' + photo.src;
            img.alt = photo.alt || 'Photo of Ashish';
            img.loading = 'lazy';

            link.appendChild(img);
          }

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
  // Encouragement Form Toggle
  // ============================================
  var encouragementToggle = document.getElementById('encouragementToggle');
  var encouragementForm = document.getElementById('encouragementForm');

  if (encouragementToggle && encouragementForm) {
    encouragementToggle.addEventListener('click', function () {
      var isHidden = encouragementForm.classList.contains('encouragement__form--hidden');
      if (isHidden) {
        encouragementForm.classList.remove('encouragement__form--hidden');
        encouragementToggle.textContent = 'Close Form';
      } else {
        encouragementForm.classList.add('encouragement__form--hidden');
        encouragementToggle.textContent = 'Send a Message';
      }
    });
  }

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
