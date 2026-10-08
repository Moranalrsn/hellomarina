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
    if (el.id === 'projects-title') return; // анимируется вместе с первым экраном (CSS)
    if (el.getBoundingClientRect().top < fold) return; // то, что видно сразу, не прячем
    el.classList.add('reveal-wait');
    io.observe(el);
  });
})();

// Карусель мини-концептов: стрелки листают на одну карточку, на краях гаснут
(function () {
  var track = document.querySelector('.concepts-track');
  if (!track) return;
  var btns = document.querySelectorAll('.carousel-btn');
  function step() {
    var card = track.querySelector('.concept');
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
  }
  function update() {
    var max = track.scrollWidth - track.clientWidth - 2;
    btns.forEach(function (b) {
      b.disabled = b.dataset.dir === '-1' ? track.scrollLeft <= 2 : track.scrollLeft >= max;
    });
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' });
    });
  });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
