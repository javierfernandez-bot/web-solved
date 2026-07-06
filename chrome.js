/* Solved · shared chrome — nav + footer injected into #nav and #footer.
   Plain vanilla JS so every page stays light and directly editable.

   PATH-AWARE: this file may be loaded from the site root (chrome.js) or from a
   nested blog post (../../chrome.js). We derive ROOT from this script's own
   resolved URL so every internal link/asset works at any depth and on any host
   (trysolved.com OR the github.io project page). */
(function () {
  // ---- Root prefix: absolute URL of the folder that contains this script ----
  var ME = document.currentScript;
  var ROOT = (ME && ME.src) ? ME.src.replace(/[?#].*$/, '').replace(/[^/]+$/, '') : '';

  // El CTA de demo apunta al #contacto de la propia página si existe; si no
  // (p. ej. dentro de un post del blog), lleva al contacto de la home.
  var demo = document.getElementById('contacto') ? '#contacto' : ROOT + 'index.html#contacto';

  /* ====== HubSpot · formulario embebido ======
     Portal 20010689 (data center na1). */
  var HUBSPOT = { region: 'na1', portalId: '20010689', formId: 'f8dcbcf5-52c2-464d-a5b1-84824ce89992' };

  var NAV =
  '<header class="nav"><div class="wrap nav__in">' +
    '<a class="nav__logo" href="' + ROOT + 'index.html"><img src="' + ROOT + 'assets/logotipo-solved.webp" alt="Solved" width="1975" height="713" decoding="async"/></a>' +
    '<ul class="nav__links">' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Productos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="' + ROOT + 'auditorias.html"><b>Registros/Checklist</b><span>Checklists proactivas y personalizadas</span></a>' +
          '<a href="' + ROOT + 'incidencias.html"><b>Gestión de incidencias</b><span>Incidencias y acciones correctivas</span></a>' +
          '<a href="' + ROOT + 'dashboard.html"><b>Dashboard</b><span>Datos e informes en tiempo real</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Industrias <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="' + ROOT + 'industria-general.html"><b>Industria general</b><span>Fabricación y procesos</span></a>' +
          '<a href="' + ROOT + 'industria-alimentaria.html"><b>Industria alimentaria</b><span>Seguridad y calidad alimentaria</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Recursos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="' + ROOT + 'blog/"><b>Blog</b><span>Artículos y guías de calidad e industria</span></a>' +
          '<a href="' + ROOT + 'glosario/"><b>Glosario</b><span>Términos industriales explicados</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__cta-mobile"><a class="btn btn--primary" href="' + demo + '">Solicita una demo</a></li>' +
    '</ul>' +
    '<a class="btn btn--primary nav__cta-desktop" href="' + demo + '">Solicita una demo</a>' +
    '<button class="nav__toggle" type="button" aria-label="Abrir menú" aria-expanded="false">' +
      '<span></span><span></span><span></span>' +
    '</button>' +
  '</div></header>';

  var FOOTER =
  '<footer class="footer"><div class="wrap">' +
    '<div class="footer__in">' +
      '<div class="footer__brand">' +
        '<img class="f-logo" src="' + ROOT + 'assets/logotipo-solved.webp" alt="Solved" width="1975" height="713" loading="lazy" decoding="async"/>' +
        '<p class="footer__addr">Edificio Angels, Sc Puerto, 13, Poblados Marítimos, 46024 Valencia</p>' +
        '<iframe class="footer__map" src="https://maps.google.com/maps?q=Edificio%20Angels%2C%20Carrer%20del%20Port%2013%2C%2046024%20Valencia&z=16&output=embed" title="Ubicación de Solved — Edificio Angels, Valencia" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
        '<a class="footer__social" href="https://www.linkedin.com/company/trysolved" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21H19.6v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/></svg></a>' +
      '</div>' +
      '<div class="footer__col">' +
        '<h4>Solved</h4>' +
        '<ul>' +
          '<li><a href="' + ROOT + 'index.html">Inicio</a></li>' +
          '<li><a href="' + ROOT + 'auditorias.html">Registros/Checklist</a></li>' +
          '<li><a href="' + ROOT + 'incidencias.html">Gestión de incidencias</a></li>' +
          '<li><a href="' + ROOT + 'dashboard.html">Dashboard</a></li>' +
          '<li><a href="' + ROOT + 'blog/">Blog</a></li>' +
          '<li><a href="' + ROOT + 'glosario/">Glosario</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="footer__col">' +
        '<h4>Quick Links</h4>' +
        '<ul>' +
          '<li><a href="' + ROOT + 'politica-de-cookies.html">Política de Cookies</a></li>' +
          '<li><a href="' + ROOT + 'politica-de-privacidad.html">Política de privacidad</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="footer__strip"><div class="wrap footer__strip-in">' +
    '<img class="footer__lanzadera" src="' + ROOT + 'assets/lanzadera.webp" alt="Lanzadera" width="1280" height="260" loading="lazy" decoding="async"/>' +
    '<div class="footer__eu">' +
      '<img src="' + ROOT + 'assets/ivf-fondo.webp" alt="Financiado por la Generalitat Valenciana, IVF (Institut Valencià de Finances) y la Unión Europea" width="2238" height="403" loading="lazy" decoding="async"/>' +
    '</div>' +
  '</div></div>' +
  '<div class="footer__legal"><div class="wrap"><p>VOLSTONE TECHNOLOGY SERVICES S.L. ha recibido una subvención por parte de la Generalitat Valenciana, dentro de la convocatoria: "Ayuda destinada a personas emprendedoras y pymes en apoyo al inicio y consolidación de su proyecto empresarial, para el ejercicio 2025 (EMPYME)", con número de expediente EMPYME/2025/254, por un importe de 14.995,95 €.</p></div></div>' +
  '</footer>';

  function buildHsForms() {
    if (!window.hbspt || !window.hbspt.forms) return;
    var holders = document.querySelectorAll('.hs-contact-form');
    for (var i = 0; i < holders.length; i++) {
      if (holders[i].getAttribute('data-hs-done')) continue;
      if (!holders[i].id) holders[i].id = 'hs-form-' + i;
      holders[i].setAttribute('data-hs-done', '1');
      window.hbspt.forms.create({
        region: HUBSPOT.region,
        portalId: HUBSPOT.portalId,
        formId: HUBSPOT.formId,
        target: '#' + holders[i].id
      });
    }
  }

  function injectHubSpot() {
    if (!document.querySelector('.hs-contact-form') || !HUBSPOT.formId) return;
    if (window.hbspt && window.hbspt.forms) { buildHsForms(); return; }
    if (!document.getElementById('hs-embed-script')) {
      var s = document.createElement('script');
      s.id = 'hs-embed-script';
      s.src = 'https://js.hsforms.net/forms/embed/v2.js';
      s.charset = 'utf-8';
      s.onload = buildHsForms;
      document.head.appendChild(s);
    } else {
      var t = setInterval(function () {
        if (window.hbspt && window.hbspt.forms) { clearInterval(t); buildHsForms(); }
      }, 150);
    }
  }

  function initBenefitsToggle() {
    var groups = document.querySelectorAll('.benefits-toggle');
    for (var g = 0; g < groups.length; g++) {
      (function (group) {
        var items = group.querySelectorAll('.bt');
        for (var i = 0; i < items.length; i++) {
          if (!items[i].querySelector('p')) continue; // solo los que tienen descripción
          items[i].addEventListener('click', function () {
            for (var j = 0; j < items.length; j++) items[j].classList.remove('bt--active');
            this.classList.add('bt--active'); // clic = se queda seleccionado
          });
        }
      })(groups[g]);
    }
  }

  function initMobileNav() {
    var header = document.querySelector('.nav');
    if (!header) return;
    var toggle = header.querySelector('.nav__toggle');
    var mq = window.matchMedia('(max-width: 1000px)');

    // Hamburguesa: abre/cierra el panel
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      });
    }

    // Acordeón en móvil: los <button> (Productos, Industrias) despliegan su submenú al tocarlos
    var triggers = header.querySelectorAll('.nav__item > button.nav__link');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', function () {
        if (!mq.matches) return; // en escritorio sigue funcionando con hover
        var item = this.parentNode;
        var wasOpen = item.classList.contains('nav__item--open');
        var items = header.querySelectorAll('.nav__item');
        for (var j = 0; j < items.length; j++) items[j].classList.remove('nav__item--open');
        if (!wasOpen) item.classList.add('nav__item--open');
      });
    }

    // Al volver a escritorio, limpia el estado móvil
    mq.addEventListener('change', function (e) {
      if (!e.matches) {
        header.classList.remove('nav--open');
        var op = header.querySelectorAll('.nav__item--open');
        for (var k = 0; k < op.length; k++) op[k].classList.remove('nav__item--open');
        if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); }
      }
    });
  }

  function initCookieBanner() {
    var KEY = 'solved_cookie_consent';
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) return; // ya eligió antes: no volver a mostrar
    var el = document.createElement('div');
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Aviso de cookies');
    el.innerHTML =
      '<p class="cookie-banner__text">Utilizamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso del sitio. Puedes aceptarlas o rechazarlas. Más información en nuestra <a href="' + ROOT + 'politica-de-cookies.html">Política de Cookies</a>.</p>' +
      '<div class="cookie-banner__actions">' +
        '<button class="btn btn--secondary" type="button" data-cookie="reject">Rechazar</button>' +
        '<button class="btn btn--primary" type="button" data-cookie="accept">Aceptar</button>' +
      '</div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('cookie-banner--in'); });
    el.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      try { localStorage.setItem(KEY, btn.getAttribute('data-cookie')); } catch (e2) {}
      el.classList.remove('cookie-banner--in');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    });
  }

  function inject() {
    var n = document.getElementById('nav');
    if (n) n.innerHTML = NAV;
    var f = document.getElementById('footer');
    if (f) f.innerHTML = FOOTER;
    injectHubSpot();
    initBenefitsToggle();
    initMobileNav();
    initCookieBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
