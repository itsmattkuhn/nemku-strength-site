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
