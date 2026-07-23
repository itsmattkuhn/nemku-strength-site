// Nemku Strength site — theme persistence, email capture, progress tabs.
(function () {
  var root = document.documentElement;

  // Theme (shared across all pages via localStorage).
  function readTheme() {
    try { return localStorage.getItem('nk-theme') === 'dark' ? 'dark' : 'light'; }
    catch (e) { return 'light'; }
  }
  function applyTheme(t) { root.setAttribute('data-theme', t); }
  applyTheme(readTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var current = readTheme();
    applyTheme(current);

    // Theme toggle buttons.
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-toggle]'), function (btn) {
      btn.addEventListener('click', function () {
        current = current === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('nk-theme', current); } catch (e) {}
        applyTheme(current);
      });
    });

    // Email capture — front-end only; swap form for a success box.
    Array.prototype.forEach.call(document.querySelectorAll('[data-notify]'), function (wrap) {
      var form = wrap.querySelector('form');
      var done = wrap.querySelector('[data-notify-done]');
      if (!form || !done) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (form.querySelector('input[type=email]') || {}).value || '';
        if (!email.trim()) return;
        form.style.display = 'none';
        var help = wrap.querySelector('[data-notify-help]');
        if (help) help.style.display = 'none';
        done.style.display = 'block';
      });
    });

    // Scroll reveal + stat count-up. Skipped entirely under reduced motion,
    // and no-JS visitors never get the hidden .reveal state.
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var counters = document.querySelectorAll('[data-count]');
      Array.prototype.forEach.call(counters, function (el) {
        el.textContent = '0' + (el.getAttribute('data-suffix') || '');
      });
      function runCount(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var t = Math.min((ts - start) / 900, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        // rAF pauses in background tabs — make sure the final value always lands.
        setTimeout(function () { el.textContent = target + suffix; }, 1100);
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-in');
          Array.prototype.forEach.call(entry.target.querySelectorAll('[data-count]'), runCount);
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      Array.prototype.forEach.call(document.querySelectorAll('section, footer'), function (el) {
        el.classList.add('reveal');
        io.observe(el);
      });
    }

    // Progress segmented toggle — flip which screenshot shows (both stay mounted).
    var tablist = document.querySelector('[data-prog]');
    if (tablist) {
      var tabs = tablist.querySelectorAll('[data-prog-tab]');
      var imgs = document.querySelectorAll('[data-prog-img]');
      Array.prototype.forEach.call(tabs, function (tab) {
        tab.addEventListener('click', function () {
          var idx = tab.getAttribute('data-prog-tab');
          Array.prototype.forEach.call(tabs, function (t) {
            t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
          });
          Array.prototype.forEach.call(imgs, function (img) {
            img.style.display = img.getAttribute('data-prog-img') === idx ? 'block' : 'none';
          });
        });
      });
    }
  });
})();
