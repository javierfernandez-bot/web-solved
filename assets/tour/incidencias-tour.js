/* ============================================================
   Tour Incidencias — demo guiada (vanilla, sin dependencias)
   Reimplementación fiel del componente Claude Design .dc
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('svt');
  if (!root) return;

  var q = function (sel) { return root.querySelector(sel); };
  var ref = function (name) { return root.querySelector('[data-svt="' + name + '"]'); };

  var el = {
    fit: q('.svt-fit'),
    stage: ref('stage'),
    zoom: ref('zoom'),
    main: ref('main'),
    url: ref('url'),
    screens: { list: q('[data-screen="list"]'), picker: q('[data-screen="picker"]'), form: q('[data-screen="form"]') },
    addBtn: q('[data-tour="addBtn"]'),
    recRow: q('[data-tour="recRow"]'),
    submitBtn: q('[data-tour="submitBtn"]'),
    newRow: q('.svt-newrow'),
    push: ref('push'),
    openCount: root.querySelectorAll('[data-svt="openCount"],[data-svt="openCount2"],[data-svt="openCount3"]'),
    typed: ref('typed'),
    cursor: ref('cursor'),
    descBox: ref('descBox'),
    dateFilled: ref('dateFilled'),
    dateEmpty: ref('dateEmpty'),
    photoFilled: ref('photoFilled'),
    photoEmpty: ref('photoEmpty'),
    cover: ref('cover'),
    close: root.querySelector('.svt-close'),
    coachLayer: ref('coachLayer'),
    kicker: ref('kicker'),
    message: ref('message'),
    dots: ref('dots'),
    pause: ref('pause'),
    prog: ref('prog'),
    done: ref('done')
  };

  var STEPS = [
    { target: 'addBtn',      url: 'app.trysolved.com/incidents',                          msg: 'Pulsa Añadir Incidencia para empezar.' },
    { target: 'catCards',    url: 'app.trysolved.com/incidents/create-incident-byTags',   msg: 'Elige la plantilla para este tipo de incidencia.' },
    { target: 'submitBtn',   url: 'app.trysolved.com/incidents/create-incident-byTags',   msg: 'Rellena los campos y pulsa Enviar.' },
    { target: 'managerPush', url: 'app.trysolved.com/incidents',                          msg: 'Solved avisa al responsable al instante con una notificación push.' }
  ];
  var DURATIONS = [4600, 4800, 5600, 5400];
  var ZOOMS = [1.34, 1.24, 1, 1.32];
  var FORM_DESC = 'Fuga de aceite en cinta transportadora L3 — derrame en zona de envasado.';

  var st = { step: 0, paused: false, done: false, started: false, scale: 1 };
  var T = {}; // timers

  var PLAY = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>';
  var PAUSE = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';

  function clearT() { for (var k in T) clearTimeout(T[k]); }

  /* ---------- responsive scale ---------- */
  var sectionEl = root.closest('section');
  var headEl = sectionEl ? sectionEl.querySelector('.section-head') : null;

  function applyHeight() {
    // offsetHeight is the UNSCALED border-box; reserve its scaled height so
    // following content is never overlapped and the card is never clipped.
    root.style.height = (el.fit.offsetHeight * st.scale) + 'px';
  }
  function navHeight() {
    var n = document.querySelector('.nav');
    if (n) { var h = n.getBoundingClientRect().height; if (h > 0 && h < 200) return h; }
    return 88; // fixed nav fallback
  }
  function fit() {
    var natural = el.fit.offsetHeight; // unscaled height of (strip +) card

    // Fullscreen player: scale the mock to fill the viewport (both axes).
    if (root.classList.contains('is-fs')) {
      var vw = window.innerWidth, vh = window.innerHeight;
      var s = Math.min((vw - 24) / 1160, (vh - 88) / natural);
      s = Math.max(0.1, s);
      st.scale = s;
      el.fit.style.transformOrigin = 'center center';
      el.fit.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
      root.style.height = '';
      return;
    }

    var wScale = root.clientWidth / 1160;
    // Height budget: the whole section (heading + component) must fit within
    // 95% of the viewport AND fully below the fixed nav, so that jumping to the
    // #demo-guiada anchor never cuts the title. Scale the component to fit.
    var hScale = 1;
    if (sectionEl && natural > 0) {
      var cs = getComputedStyle(sectionEl);
      var overhead = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      if (headEl) {
        var hc = getComputedStyle(headEl);
        overhead += headEl.offsetHeight + parseFloat(hc.marginBottom);
      }
      var nav = navHeight(), topGap = 16, bottomGap = 16;
      // Land the anchor scroll just below the fixed nav.
      sectionEl.style.scrollMarginTop = (nav + topGap) + 'px';
      var budget = Math.min(0.95 * window.innerHeight, window.innerHeight - nav - topGap - bottomGap);
      hScale = (budget - overhead) / natural;
    }
    var s = Math.max(0.1, Math.min(1, wScale, hScale));
    st.scale = s;
    el.fit.style.transform = 'scale(' + s + ')';
    el.fit.style.transformOrigin = 'top center';
    applyHeight();
  }

  /* ---------- dots ---------- */
  function renderDots() {
    var html = '';
    for (var i = 0; i < STEPS.length; i++) {
      var c = 'svt-dot-i';
      if (i === st.step) c += ' svt-dot-i--on';
      else if (i < st.step) c += ' svt-dot-i--done';
      html += '<span class="' + c + '"></span>';
    }
    el.dots.innerHTML = html;
  }

  /* ---------- progress bar ---------- */
  function restartProgress() {
    var dur = DURATIONS[st.step] || 3200;
    el.prog.classList.remove('is-run');
    void el.prog.offsetWidth; // reflow
    el.prog.style.animationDuration = (dur / 1000) + 's';
    el.prog.classList.add('is-run');
    el.prog.style.animationPlayState = st.paused ? 'paused' : 'running';
  }

  /* ---------- zoom ---------- */
  function resetZoom() {
    el.zoom.classList.remove('is-zoom');
    el.zoom.style.transformOrigin = '50% 50%';
    el.zoom.style.transform = 'scale(1)';
  }
  function zoomIn() {
    if (st.done) return;
    var z = ZOOMS[st.step] || 1;
    if (z === 1) return;
    var meta = STEPS[st.step];
    var target = el.stage.querySelector('[data-tour="' + meta.target + '"]');
    if (!target) return;
    // measure in local (unscaled) stage coords
    var prev = el.zoom.style.transform;
    el.zoom.style.transform = 'none';
    var sr = el.stage.getBoundingClientRect();
    var r = target.getBoundingClientRect();
    el.zoom.style.transform = prev;
    var s = st.scale || 1;
    var ocx = (r.left - sr.left) / s + (r.width / s) / 2;
    var ocy = (r.top - sr.top) / s + (r.height / s) / 2;
    el.zoom.classList.add('is-zoom');
    el.zoom.style.transformOrigin = ocx + 'px ' + ocy + 'px';
    el.zoom.style.transform = 'scale(' + z + ')';
  }
  function scheduleZoom() {
    clearTimeout(T.zi); clearTimeout(T.zi2);
    resetZoom();
    setPress(false);
    T.zi = setTimeout(function () { if (!st.done && !st.paused) zoomIn(); }, 2000);
    T.zi2 = setTimeout(function () { if (!st.done) setPress(true); }, 3300);
  }

  /* ---------- pressed / acted visuals ---------- */
  function setPress(on) {
    el.addBtn.classList.toggle('is-press', on && st.step === 0);
    el.recRow.classList.toggle('is-press', on && st.step === 1);
  }

  /* ---------- auto advance ---------- */
  function scheduleAdvance() {
    clearTimeout(T.auto);
    if (st.paused || st.done) return;
    var dur = DURATIONS[st.step] || 3200;
    T.auto = setTimeout(next, dur);
  }

  /* ---------- form fill (step 2) ---------- */
  function scrollToEl(sel, offset) {
    var main = el.main; if (!main) return;
    var t = main.querySelector(sel); if (!t) return;
    var mr = main.getBoundingClientRect(), tr = t.getBoundingClientRect();
    main.scrollTo({ top: main.scrollTop + (tr.top - mr.top) / (st.scale || 1) - (offset || 20), behavior: 'smooth' });
  }
  function setTyped(v) {
    el.typed.textContent = v;
    el.descBox.classList.toggle('is-typed', v.length > 0);
    el.cursor.classList.toggle('is-on', st.step === 2 && v.length < FORM_DESC.length);
  }
  function setDate(f) { el.dateFilled.hidden = !f; el.dateEmpty.hidden = f; }
  function setPhoto(f) {
    el.photoFilled.hidden = !f; el.photoEmpty.hidden = f;
    el.submitBtn.classList.toggle('is-press', f && st.step === 2);
  }
  function startFormFill() {
    clearTimeout(T.ff);
    setTyped(''); setDate(false); setPhoto(false);
    if (el.main) el.main.scrollTop = 0;
    setTimeout(function () { scrollToEl('[data-fill="desc"]'); }, 60);
    var full = FORM_DESC;
    function type(i) {
      if (st.step !== 2 || st.done) return;
      if (st.paused) { T.ff = setTimeout(function () { type(i); }, 140); return; }
      setTyped(full.slice(0, i));
      if (i < full.length) T.ff = setTimeout(function () { type(i + 1); }, 30);
      else T.ff = setTimeout(fillDate, 480);
    }
    T.ff = setTimeout(function () { type(1); }, 520);
  }
  function fillDate() {
    if (st.step !== 2 || st.done) return;
    if (st.paused) { T.ff = setTimeout(fillDate, 140); return; }
    setDate(true); scrollToEl('[data-fill="date"]');
    T.ff = setTimeout(fillPhoto, 650);
  }
  function fillPhoto() {
    if (st.step !== 2 || st.done) return;
    if (st.paused) { T.ff = setTimeout(fillPhoto, 140); return; }
    setPhoto(true); scrollToEl('[data-fill="photo"]');
    T.ff = setTimeout(function () { scrollToEl('[data-fill="submit"]', 150); }, 820);
  }

  /* ---------- render a step ---------- */
  function applyStep() {
    var s = st.step, meta = STEPS[s];
    var isList = (s === 0 || s === 3), isPicker = (s === 1), isForm = (s === 2);
    el.screens.list.hidden = !isList;
    el.screens.picker.hidden = !isPicker;
    el.screens.form.hidden = !isForm;

    el.url.textContent = meta.url;
    el.newRow.hidden = (s !== 3);
    el.push.hidden = (s !== 3);
    var oc = (s === 3) ? 5 : 4;
    for (var i = 0; i < el.openCount.length; i++) el.openCount[i].textContent = oc;

    // reset dynamic visuals
    el.addBtn.classList.remove('is-press');
    el.recRow.classList.remove('is-press');
    el.submitBtn.classList.remove('is-press');
    if (!isForm) { clearTimeout(T.ff); setTyped(''); setDate(false); setPhoto(false); if (el.main) el.main.scrollTop = 0; }

    el.kicker.textContent = 'Paso ' + (s + 1) + ' de ' + STEPS.length;
    el.message.textContent = meta.msg;
    renderDots();
    renderPause();

    root.classList.toggle('svt-started', st.started);
    if (el.cover) el.cover.hidden = st.started;
    el.coachLayer.hidden = st.done || !st.started;
    el.done.hidden = !st.done;

    // Nothing animates until the user presses "Ver demo".
    if (!st.started) { clearT(); resetZoom(); return; }

    scheduleZoom();
    scheduleAdvance();
    restartProgress();
    if (isForm) startFormFill();
  }

  function renderPause() {
    el.pause.innerHTML = (st.paused ? PLAY : PAUSE) + (st.paused ? 'Reanudar' : 'Pausar');
  }

  /* ---------- transitions ---------- */
  function next() {
    var s = st.step;
    if (s === 0) {
      el.addBtn.classList.add('is-press');
      clearTimeout(T.np);
      T.np = setTimeout(function () { el.addBtn.classList.remove('is-press'); st.step = 1; applyStep(); }, 360);
      return;
    }
    if (s >= STEPS.length - 1) {
      st.done = true;
      clearT();
      el.coachLayer.hidden = true;
      el.done.hidden = false;
      resetZoom();
      return;
    }
    st.step = s + 1;
    applyStep();
  }

  function start() {
    st.started = true;
    // Freeze the section height first (before it leaves the flow) so the page
    // behind the fullscreen player doesn't jump.
    if (sectionEl) sectionEl.style.minHeight = sectionEl.offsetHeight + 'px';
    root.classList.add('is-fs');
    document.documentElement.classList.add('svt-fs-lock');
    document.body.classList.add('svt-fs-lock');
    if (el.cover) el.cover.hidden = true;
    fit();
    restart();
  }

  function exitFullscreen() {
    root.classList.remove('is-fs');
    document.documentElement.classList.remove('svt-fs-lock');
    document.body.classList.remove('svt-fs-lock');
    if (sectionEl) sectionEl.style.minHeight = '';
    clearT();
    st.started = false; st.done = false; st.paused = false; st.step = 0;
    resetZoom();
    applyStep(); // back to the inline poster (cover shown)
    fit();
  }

  function restart() {
    clearT();
    st.step = 0; st.done = false; st.paused = false; st.started = true;
    applyStep();
  }

  function togglePause() {
    st.paused = !st.paused;
    renderPause();
    if (st.paused) {
      clearTimeout(T.auto);
      el.prog.style.animationPlayState = 'paused';
    } else {
      restartProgress();
      scheduleAdvance();
      // resume zoom if it hasn't fired yet
      if (!el.zoom.classList.contains('is-zoom')) { clearTimeout(T.zi); T.zi = setTimeout(function () { if (!st.done && !st.paused) zoomIn(); }, 400); }
    }
  }

  /* ---------- events ---------- */
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'start') start();
    else if (act === 'close') exitFullscreen();
    else if (act === 'next') { if (!st.started) { start(); return; } clearTimeout(T.auto); next(); }
    else if (act === 'restart') restart();
    else if (act === 'pause') togglePause();
  });

  // External triggers (hero button, etc.) open the fullscreen demo.
  var openers = document.querySelectorAll('[data-svt-open]');
  for (var oi = 0; oi < openers.length; oi++) {
    openers[oi].addEventListener('click', function (e) { e.preventDefault(); start(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-fs')) exitFullscreen();
  });

  var raf;
  window.addEventListener('resize', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
  window.addEventListener('load', fit);
  // Re-fit whenever the card's box or the heading settles (late CSS, web
  // fonts, decoded images, heading rewrap) — bulletproofs against FOUC and
  // keeps the 95vh cap accurate.
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(function () { fit(); });
    ro.observe(el.fit);
    if (headEl) ro.observe(headEl);
  }

  // boot
  fit();
  applyStep();
  setTimeout(fit, 300);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
