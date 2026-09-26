// Увеличение картинок в кейсах: клик — на весь экран, ещё клик — в полный размер
(function () {
  var imgs = document.querySelectorAll('.case-cover img, .figure img, .figure-pair img');
  if (!imgs.length) return;
  var lb, big, hint, lastFocus, startY = null;

  function build() {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Увеличенное изображение');
    big = document.createElement('img');
    big.className = 'lb-img';
    var close = document.createElement('button');
    close.className = 'lb-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Закрыть');
    close.innerHTML = '&times;';
    hint = document.createElement('div');
    hint.className = 'lb-hint';
    lb.appendChild(big); lb.appendChild(close); lb.appendChild(hint);
    document.body.appendChild(lb);

    close.addEventListener('click', hide);
    lb.addEventListener('click', function (e) { if (e.target === lb) hide(); });
    big.addEventListener('click', function (e) {
      e.stopPropagation();
      var full = !lb.classList.contains('lb-full');
      lb.classList.toggle('lb-full', full);
      big.style.width = full ? Math.max(big.naturalWidth / 1.4, window.innerWidth * 1.6) + 'px' : '';
      hint.textContent = full ? 'Нажмите на картинку, чтобы уменьшить' : 'Нажмите на картинку, чтобы увеличить';
      lb.scrollTop = 0; lb.scrollLeft = 0;
    });
    lb.addEventListener('touchstart', function (e) {
      startY = (!lb.classList.contains('lb-full') && e.touches.length === 1) ? e.touches[0].clientY : null;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startY !== null && e.changedTouches[0].clientY - startY > 90) hide();
      startY = null;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.parentNode && document.documentElement.classList.contains('lb-lock')) hide();
    });
  }

  function show(src, alt) {
    if (!lb) build();
    lastFocus = document.activeElement;
    lb.classList.remove('lb-full');
    big.style.width = '';
    big.src = src; big.alt = alt || '';
    hint.textContent = 'Нажмите на картинку, чтобы увеличить';
    lb.style.display = '';
    document.documentElement.classList.add('lb-lock');
    requestAnimationFrame(function () { lb.classList.add('lb-open'); });
    lb.querySelector('.lb-close').focus({ preventScroll: true });
  }

  function hide() {
    lb.classList.remove('lb-open');
    document.documentElement.classList.remove('lb-lock');
    setTimeout(function () { if (!lb.classList.contains('lb-open')) lb.style.display = 'none'; }, 260);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  imgs.forEach(function (img) {
    img.classList.add('zoomable');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('title', 'Увеличить');
    img.addEventListener('click', function () { show(img.currentSrc || img.src, img.alt); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(img.currentSrc || img.src, img.alt); }
    });
  });
})();
