(function () {
  'use strict';

  // Result galleries: native scroll-snap. Buttons and dots are progressive
  // enhancement; swiping works without any JS. One instance per
  // .gallery-section on the page.
  function initGalleries() {
    var sections = document.querySelectorAll('.gallery-section');
    Array.prototype.forEach.call(sections, initGallery);
  }

  function initGallery(section) {
    var gallery = section.querySelector('.gallery');
    if (!gallery) return;
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.gallery-item'));
    var prev = section.querySelector('.gallery-prev');
    var next = section.querySelector('.gallery-next');
    var dots = section.querySelector('.gallery-dots');

    function itemStride() {
      if (items.length < 2) return gallery.clientWidth;
      return items[1].offsetLeft - items[0].offsetLeft;
    }

    function scrollByItems(n) {
      gallery.scrollBy({ left: n * itemStride(), behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { scrollByItems(-1); });
    if (next) next.addEventListener('click', function () { scrollByItems(1); });

    gallery.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByItems(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollByItems(1); }
    });

    if (dots && items.length > 1) {
      items.forEach(function (_, i) {
        var d = document.createElement('span');
        d.className = 'gallery-dot';
        d.addEventListener('click', function () {
          gallery.scrollTo({ left: items[i].offsetLeft - gallery.offsetLeft, behavior: 'smooth' });
        });
        dots.appendChild(d);
      });
      var dotEls = dots.querySelectorAll('.gallery-dot');
      var updateDots = function () {
        // Active dot = item whose left edge is nearest the current scroll
        // position, i.e. the first fully visible card. Works for both the
        // single-card mobile view and the 3-up desktop view.
        var left = gallery.scrollLeft;
        var best = 0, bestDist = Infinity;
        items.forEach(function (it, i) {
          var dist = Math.abs((it.offsetLeft - items[0].offsetLeft) - left);
          if (dist < bestDist) { bestDist = dist; best = i; }
        });
        dotEls.forEach(function (d, i) { d.classList.toggle('is-active', i === best); });
      };
      var ticking = false;
      gallery.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { updateDots(); ticking = false; });
      }, { passive: true });
      updateDots();
    }
  }

  // Play videos only while on screen. Saves battery and data on phones and
  // avoids a dozen decoders running for content the reader cannot see.
  function initLazyVideos() {
    var videos = Array.prototype.slice.call(document.querySelectorAll('video.lazy-video'));
    if (!videos.length) return;
    var tryPlay = function (v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked; poster stays */ });
    };
    if (!('IntersectionObserver' in window)) {
      videos.forEach(tryPlay);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.4) {
          if (v.preload !== 'auto') v.preload = 'auto';
          tryPlay(v);
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: [0, 0.4, 1] });
    videos.forEach(function (v) { io.observe(v); });
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
    initGalleries();
    initLazyVideos();
    initBibtexCopy();
  });
})();
