document.addEventListener('DOMContentLoaded', function () {

  // Scroll Reveal
  var reveals = document.querySelectorAll('.reveal-on-scroll');
  if (reveals.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (el) {
      var delay = el.dataset.revealDelay;
      if (delay) el.style.transitionDelay = delay + 'ms';
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  // Header Scroll — adds scrolled class for shadow/color transition
  var header = document.querySelector('.section-header');
  if (header) {
    var ticking = false;
    function updateHeader() {
      var scrolled = window.scrollY > 50;
      header.classList.toggle('header--scrolled', scrolled);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  // Stat Counters
  function animateCounter(el) {
    var raw = el.dataset.target || '';
    var numMatch = raw.match(/[\d,\.]+/);
    if (!numMatch) return;
    var numIndex = raw.indexOf(numMatch[0]);
    var prefix = raw.substring(0, numIndex);
    var suffix = raw.substring(numIndex + numMatch[0].length);
    var numStr = numMatch[0].replace(/,/g, '');
    var target = parseFloat(numStr);
    if (isNaN(target)) return;
    var isFloat = numStr.indexOf('.') !== -1;
    var decimals = isFloat ? (numStr.split('.')[1] || '').length : 0;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = target * ease;
      var display = isFloat ? current.toFixed(decimals) : Math.floor(current).toLocaleString();
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-counter').forEach(function(el) {
    counterObserver.observe(el);
  });

  // Scroll Progress Bar
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  var progressTicking = false;
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    progressTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!progressTicking) {
      requestAnimationFrame(updateProgress);
      progressTicking = true;
    }
  }, { passive: true });
  updateProgress();

  // Smooth Scroll
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

});
