/* Solved · shared chrome — nav + footer injected into #nav and #footer.
   Plain vanilla JS so every page stays light and directly editable. */
(function () {
  var demo = '#contacto';

  /* ====== HubSpot · formulario embebido ======
     Portal 20010689 (data center na1). Pega tu Form ID de HubSpot abajo
     y se renderizará automáticamente en cada sección de contacto. */
  var HUBSPOT = { region: 'na1', portalId: '20010689', formId: 'f8dcbcf5-52c2-464d-a5b1-84824ce89992' };

  var NAV =
  '<header class="nav"><div class="wrap nav__in">' +
    '<a class="nav__logo" href="index.html"><img src="assets/logotipo-solved.png" alt="Solved"/></a>' +
    '<ul class="nav__links">' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Productos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="auditorias.html"><b>Auditorías</b><span>Checklists proactivas y personalizadas</span></a>' +
          '<a href="incidencias.html"><b>Gestión de incidencias</b><span>Incidencias y acciones correctivas</span></a>' +
          '<a href="dashboard.html"><b>Dashboard</b><span>Datos e informes en tiempo real</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Industrias <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="industria-general.html"><b>Industria general</b><span>Fabricación y procesos</span></a>' +
          '<a href="industria-alimentaria.html"><b>Industria alimentaria</b><span>Seguridad y calidad alimentaria</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__item"><a class="nav__link" href="#">Blog</a></li>' +
    '</ul>' +
    '<a class="btn btn--primary" href="' + demo + '">Solicita una demo</a>' +
  '</div></header>';

  var FOOTER =
  '<footer class="footer"><div class="wrap">' +
    '<div class="footer__in">' +
      '<div class="footer__brand">' +
        '<img class="f-logo" src="assets/logotipo-solved.png" alt="Solved"/>' +
        '<p class="footer__addr">Edificio Angels, Sc Puerto, 13, Poblados Marítimos, 46024 Valencia</p>' +
        '<div class="footer__map"><span>Haz clic para aceptar cookies de marketing y permitir este contenido</span></div>' +
        '<a class="footer__social" href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21H19.6v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/></svg></a>' +
      '</div>' +
      '<div class="footer__col">' +
        '<h4>Solved</h4>' +
        '<ul>' +
          '<li><a href="index.html">Inicio</a></li>' +
          '<li><a href="auditorias.html">Auditorías</a></li>' +
          '<li><a href="incidencias.html">Gestión de incidencias</a></li>' +
          '<li><a href="dashboard.html">Dashboard</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="footer__col">' +
        '<h4>Quick Links</h4>' +
        '<ul>' +
          '<li><a href="#">Política de Cookies</a></li>' +
          '<li><a href="#">Política de privacidad</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="footer__strip"><div class="wrap footer__strip-in">' +
    '<span class="footer__lanzadera">LANZADERA</span>' +
    '<div class="footer__eu">' +
      '<span>GENERALITAT<br/>VALENCIANA</span>' +
      '<span>I·V·F<br/>INSTITUT VALENCIÀ<br/>DE FINANCES</span>' +
      '<span class="euflag">★</span>' +
      '<span>Financiado por<br/>la Unión Europea</span>' +
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

  function inject() {
    var n = document.getElementById('nav');
    if (n) n.innerHTML = NAV;
    var f = document.getElementById('footer');
    if (f) f.innerHTML = FOOTER;
    injectHubSpot();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
