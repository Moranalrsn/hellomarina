// Мягкое появление блоков при прокрутке и картинок по мере загрузки
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // картинки: проявляем после загрузки
  document.querySelectorAll('main img').forEach(function (img) {
    if (img.complete && img.naturalWidth) return;
    img.classList.add('img-wait');
    var done = function () { img.classList.remove('img-wait'); img.classList.add('img-in'); };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });

  if (!('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll(
    '.section-title, .project, .about-text p, .job, .cta, ' +
    '.block > .h2, .block-sm > .h3, .prose p, .figure, .figure-pair, .cards-2 .card, .metric, .bullets li, .case-nav'
  );
  var fold = window.innerHeight * 0.95;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      // соседние элементы (карточки в сетке) появляются лесенкой
      var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(siblings, 5) * 70 + 'ms';
      el.classList.add('reveal-in');
      el.classList.remove('reveal-wait');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  targets.forEach(function (el) {
    if (el.getBoundingClientRect().top < fold) return; // то, что видно сразу, не прячем
    el.classList.add('reveal-wait');
    io.observe(el);
  });
})();
