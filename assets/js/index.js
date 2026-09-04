(function () {
  'use strict';

  function initCarousel() {
    if (typeof bulmaCarousel === 'undefined') return;
    var el = document.getElementById('results-carousel');
    if (!el) return;
    bulmaCarousel.attach('#results-carousel', {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
      breakpoints: [
        { changePoint: 480, slidesToShow: 1, slidesToScroll: 1 },
        { changePoint: 768, slidesToShow: 2, slidesToScroll: 1 }
      ]
    });
  }

  function initBibtexCopy() {
    var btn = document.getElementById('bibtex-copy');
    var code = document.getElementById('bibtex');
    if (!btn || !code) return;
    btn.addEventListener('click', function () {
      var text = code.textContent;
      var done = function () {
        var label = btn.querySelector('span:last-child');
        var old = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(function () { label.textContent = old; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var range = document.createRange();
        range.selectNodeContents(code);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
        sel.removeAllRanges();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
    initBibtexCopy();
  });
})();
