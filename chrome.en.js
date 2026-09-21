/* Solved · shared chrome (English) — nav + footer injected into #nav and #footer.
   Mirrors chrome.js exactly, translated. Every EN page loads this via the
   absolute path /chrome.en.js (not chrome.js) so document.currentScript
   resolves to the true site root regardless of page depth.

   ROOT = true site root (e.g. https://trysolved.com/).
   EN_ROOT = ROOT + 'en/' — used for links to translated pages.
   Shared assets (images, PDFs, HubSpot) are NOT duplicated per language and
   use ROOT directly. */
(function () {
  var ME = document.currentScript;
  var ROOT = (ME && ME.src) ? ME.src.replace(/[?#].*$/, '').replace(/[^/]+$/, '') : '';
  var EN_ROOT = ROOT + 'en/';

  var demo = document.getElementById('contacto') ? '#contacto' : EN_ROOT + '#contacto';

  /* ====== HubSpot · embedded form ======
     Same portal as the Spanish site (20010689, data center na1). The form's
     own field labels are controlled in HubSpot and may still show Spanish
     labels until an English form is created there — out of scope for this
     change. */
  var HUBSPOT = { region: 'na1', portalId: '20010689', formId: 'f8dcbcf5-52c2-464d-a5b1-84824ce89992' };

  // Current path, for the language switch link.
  var path = window.location.pathname;
  var esPath = path.replace(/^\/en\/?/, '/');
  if (esPath === '') esPath = '/';

  var NAV =
  '<header class="nav"><div class="wrap nav__in">' +
    '<a class="nav__logo" href="' + EN_ROOT + '"><img src="' + ROOT + 'assets/logotipo-solved.webp" alt="Solved" width="1975" height="713" decoding="async"/></a>' +
    '<ul class="nav__links">' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Products <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="' + EN_ROOT + 'incidencias/"><b>Issue management</b><span>Log, assign and close issues with a documented trail</span></a>' +
          '<a href="' + EN_ROOT + 'auditorias/"><b>Records &amp; audits</b><span>Controls, checklists and digital audits</span></a>' +
          '<a href="' + EN_ROOT + 'no-conformidades/"><b>Tasks, actions &amp; non-conformities</b><span>Corrective actions and follow-up through to closure</span></a>' +
          '<a href="' + EN_ROOT + 'dashboard/"><b>KPIs &amp; dashboards</b><span>360° real-time view and automatic reports</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Industries <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="' + EN_ROOT + 'industria-general/"><b>General industry</b><span>Manufacturing and processes</span></a>' +
          '<a href="' + EN_ROOT + 'industria-alimentaria/"><b>Food industry</b><span>Food safety and quality</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Resources <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="' + EN_ROOT + 'blog/"><b>Blog</b><span>Articles and guides on quality and industry</span></a>' +
          '<a href="' + EN_ROOT + 'glosario/"><b>Glossary</b><span>Industrial terms explained</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__item nav__item--lang">' +
        '<button class="nav__link" type="button">EN <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu nav__menu--lang">' +
          '<a href="' + esPath + '"><b>Español</b></a>' +
          '<a href="' + window.location.pathname + '" aria-current="true"><b>English</b></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__cta-mobile"><a class="btn btn--primary" href="' + demo + '">Request a demo</a></li>' +
    '</ul>' +
    '<a class="btn btn--primary nav__cta-desktop" href="' + demo + '">Request a demo</a>' +
    '<button class="nav__toggle" type="button" aria-label="Open menu" aria-expanded="false">' +
      '<span></span><span></span><span></span>' +
    '</button>' +
  '</div></header>';

  var FOOTER =
  '<footer class="footer"><div class="wrap">' +
    '<div class="footer__in">' +
      '<div class="footer__brand">' +
        '<img class="f-logo" src="' + ROOT + 'assets/logotipo-solved.webp" alt="Solved" width="1975" height="713" loading="lazy" decoding="async"/>' +
        '<p class="footer__addr">Edificio Angels, Sc Puerto, 13, Poblados Marítimos, 46024 Valencia, Spain</p>' +
        '<iframe class="footer__map" src="https://maps.google.com/maps?q=Edificio%20Angels%2C%20Carrer%20del%20Port%2013%2C%2046024%20Valencia&z=16&output=embed" title="Solved location — Edificio Angels, Valencia" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
        '<a class="footer__social" href="https://www.linkedin.com/company/trysolved" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21H19.6v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/></svg></a>' +
      '</div>' +
      '<div class="footer__col">' +
        '<h4>Solved</h4>' +
        '<ul>' +
          '<li><a href="' + EN_ROOT + '">Home</a></li>' +
          '<li><a href="' + EN_ROOT + 'auditorias/">Records/Checklists</a></li>' +
          '<li><a href="' + EN_ROOT + 'incidencias/">Issue management</a></li>' +
          '<li><a href="' + EN_ROOT + 'dashboard/">Dashboard</a></li>' +
          '<li><a href="' + EN_ROOT + 'blog/">Blog</a></li>' +
          '<li><a href="' + EN_ROOT + 'glosario/">Glossary</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="footer__col">' +
        '<h4>Quick Links</h4>' +
        '<ul>' +
          '<li><a href="' + EN_ROOT + 'politica-de-cookies/">Cookie Policy</a></li>' +
          '<li><a href="' + EN_ROOT + 'politica-de-privacidad/">Privacy Policy</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="footer__strip"><div class="wrap footer__strip-in">' +
    '<img class="footer__lanzadera" src="' + ROOT + 'assets/lanzadera.webp" alt="Lanzadera" width="1280" height="260" loading="lazy" decoding="async"/>' +
    '<div class="footer__eu">' +
      '<img src="' + ROOT + 'assets/ivf-fondo.webp" alt="Funded by the Generalitat Valenciana, IVF (Institut Valencià de Finances) and the European Union" width="2238" height="403" loading="lazy" decoding="async"/>' +
    '</div>' +
  '</div></div>' +
  '<div class="footer__legal"><div class="wrap"><p>VOLTSTONE TECHNOLOGY SERVICES S.L. received a grant from the Generalitat Valenciana (regional government of Valencia, Spain), under the call: "Ayuda destinada a personas emprendedoras y pymes en apoyo al inicio y consolidación de su proyecto empresarial, para el ejercicio 2025 (EMPYME)", file number EMPYME/2025/254, for an amount of €14,995.95.</p></div></div>' +
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
          if (!items[i].querySelector('p')) continue;
          items[i].addEventListener('click', function () {
            for (var j = 0; j < items.length; j++) items[j].classList.remove('bt--active');
            this.classList.add('bt--active');
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

    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
    }

    var triggers = header.querySelectorAll('.nav__item > button.nav__link');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', function () {
        if (!mq.matches) return;
        var item = this.parentNode;
        var wasOpen = item.classList.contains('nav__item--open');
        var items = header.querySelectorAll('.nav__item');
        for (var j = 0; j < items.length; j++) items[j].classList.remove('nav__item--open');
        if (!wasOpen) item.classList.add('nav__item--open');
      });
    }

    mq.addEventListener('change', function (e) {
      if (!e.matches) {
        header.classList.remove('nav--open');
        var op = header.querySelectorAll('.nav__item--open');
        for (var k = 0; k < op.length; k++) op[k].classList.remove('nav__item--open');
        if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); }
      }
    });
  }

  function initCookieBanner() {
    var KEY = 'solved_cookie_consent';
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) return;
    var el = document.createElement('div');
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie notice');
    el.innerHTML =
      '<p class="cookie-banner__text">We use our own and third-party cookies to improve your experience and analyze site usage. You can accept or reject them. More information in our <a href="' + EN_ROOT + 'politica-de-cookies/">Cookie Policy</a>.</p>' +
      '<div class="cookie-banner__actions">' +
        '<button class="btn btn--secondary" type="button" data-cookie="reject">Reject</button>' +
        '<button class="btn btn--primary" type="button" data-cookie="accept">Accept</button>' +
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
