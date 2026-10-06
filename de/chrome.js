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
  var demo = document.getElementById('contacto') ? '#contacto' : ROOT + '#contacto';

  /* ====== HubSpot · formularios embebidos ======
     Portal 20010689 (data center na1).

     Hay dos formularios y no uno: el de contacto pide lo de siempre, y el de
     /casos-de-exito/ pide sólo el correo para abrir los vídeos. Pedir nombre,
     empresa y teléfono para ver dos minutos de vídeo es lo que hace que nadie
     los vea.

     El de vídeo va por idioma: `formIdVideo` es un mapa y se elige con el lang
     del documento. Este fichero se copia igual a /en/ /fr/ /it/ /de/ —el
     traductor sólo toca literales con etiquetas—, así que el mapa entero viaja
     a los cinco y cada página coge el suyo.

     Los cinco son formularios independientes, no traducciones de HubSpot: su
     «Crear traducción» pierde la casilla obligatoria de política de privacidad,
     así que cada idioma es un clon del español con las etiquetas, el botón, el
     mensaje y el enlace a su política traducidos a mano.

     Si algún idioma se quedara sin id, cae al español: el gate abre y el lead
     entra bien etiquetado como vídeo, sólo que el formulario se ve en español.
     Y si `formIdVideo` quedara sin ninguno, se sirve el de contacto: la página
     funciona entera, pero el lead entra etiquetado como petición de contacto,
     que no es lo que ha pedido el visitante. */
  var HUBSPOT = {
    region: 'na1',
    portalId: '20010689',
    formId: 'f8dcbcf5-52c2-464d-a5b1-84824ce89992',
    formIdVideo: {
      es: '4043166a-b523-4b6a-bd98-6a45e494bafd',
      en: '8cf7e45a-be2c-4abc-9c38-d859c819cc8f',
      fr: 'fe48b6ff-8465-4ff7-831a-b118c9a66304',
      it: '874a77f5-849b-4002-9aa3-f82b1a77715a',
      de: 'd13de153-a6ba-4f5c-8569-2f1785dbb71e'
    }
  };

  /* El id de vídeo del idioma de la página, con el español de reserva. */
  function formVideo() {
    var lang = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2);
    return HUBSPOT.formIdVideo[lang] || HUBSPOT.formIdVideo.es || '';
  }

  var NAV =
  '<header class="nav"><div class="wrap nav__in">' +
    '<a class="nav__logo" href="' + ROOT + '"><img src="' + '/assets/logotipo-solved.webp" alt="Solved" width="1975" height="713" decoding="async"/></a>' +
    '<ul class="nav__links">' +
      // Productos: estructura de mega-menú calcada de mitti.com/es (menú
      // «Plataforma») — la lista de módulos arriba y, debajo, IA e
      // Integraciones como bloque destacado con icono y flecha, no como dos
      // filas más de la lista. Es la pieza que en Mitti son «IA de Mitti» y
      // «Ver todas las integraciones».
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Produkte <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu nav__menu--mega">' +
          '<div class="nav__mega-cols">' +
            '<a href="' + ROOT + 'stoerungsmanagement/"><b>Störungen</b></a>' +
            '<a href="' + ROOT + 'digitale-checklisten/"><b>Aufzeichnungen</b></a>' +
            '<a href="' + ROOT + 'korrekturmassnahmen/"><b>Aufgaben</b></a>' +
            '<a href="' + ROOT + 'dashboards/"><b>KPIs</b></a>' +
            '<a href="' + ROOT + 'dokumentenmanagement/"><b>Dokumentenverwaltung</b></a>' +
            '<a href="' + ROOT + 'anlagenverwaltung/"><b>Anlagenverwaltung</b></a>' +
          '</div>' +
          '<div class="nav__mega-blocks">' +
            '<a class="nav__mega-block nav__mega-block--ia" href="' + ROOT + 'ki/">' +
              '<span class="nav__mega-block__lava" aria-hidden="true"></span>' +
              '<span class="nav__mega-block__ico" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false">' +
                '<linearGradient id="navIaGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A855F7"/><stop offset=".52" stop-color="#D34F9D"/><stop offset="1" stop-color="#1FD6F5"/></linearGradient>' +
                '<path fill="url(#navIaGrad)" d="M12 1.4c.62 5.62 4.56 9.56 10.18 10.18v.84c-5.62.62-9.56 4.56-10.18 10.18h-.84C10.54 17 6.6 13.04.98 12.42v-.84C6.6 10.96 10.54 7.02 11.16 1.4z"/>' +
              '</svg></span>' +
              '<span class="nav__mega-block__txt"><b>KI</b></span>' +
              '<span class="nav__mega-block__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
            '</a>' +
            '<a class="nav__mega-block nav__mega-block--int" href="' + ROOT + 'integrationen/">' +
              '<span class="nav__mega-block__lava" aria-hidden="true"></span>' +
              '<span class="nav__mega-block__ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><path d="M9.1 9.1l5.8 5.8"/></svg></span>' +
              '<span class="nav__mega-block__txt"><b>Integrationen</b></span>' +
              '<span class="nav__mega-block__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</li>' +
      // Casos de uso: la lista de sectores y normas a la izquierda, y a la
      // derecha dos fichas de caso de éxito con foto — el mismo reparto que
      // el menú «Soluciones» de Mitti, que lleva sus casos de cliente al
      // lateral en vez de mezclarlos con la lista. El fondo es una foto de
      // ambiente de la industria de cada cliente (no su cara, que es la del
      // vídeo) más su logo, para que se lea la industria de un vistazo.
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Anwendungsfälle <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu nav__menu--mega nav__menu--split">' +
          '<div class="nav__mega-cols">' +
            '<a href="' + ROOT + 'fertigungsindustrie/"><b>Fertigungsindustrie</b></a>' +
            '<a href="' + ROOT + 'lebensmittelindustrie/"><b>Lebensmittelindustrie</b></a>' +
            '<a href="' + ROOT + 'software-gmao/"><b>Instandhaltung</b></a>' +
            '<a href="' + ROOT + 'software-calidad/"><b>Qualität und Zertifizierungen</b></a>' +
          '</div>' +
          '<div class="nav__mega-side">' +
            '<a class="nav__mega-case" href="' + ROOT + 'fallstudien/carnavi/" style="background-image:url(\'' + '/assets/sala-despiece-cerdo.webp\')">' +
              '<img class="nav__mega-case__logo" src="' + '/assets/clients-color/carnavi.webp" alt="Carnavi" width="120" height="46" loading="lazy" decoding="async">' +
              '<span class="nav__mega-case__tag">Erfolgsgeschichte</span>' +
              '<span class="nav__mega-case__title">Zwei Stunden täglich für die manuelle Erfassung von Störungen</span>' +
            '</a>' +
            '<a class="nav__mega-case" href="' + ROOT + 'fallstudien/panificadora-alcala/" style="background-image:url(\'' + '/assets/panaderia-industrial-hornos.webp\')">' +
              '<img class="nav__mega-case__logo" src="' + '/assets/clients-color/panificadora-alcala.webp" alt="Panificadora de Alcalá" width="120" height="46" loading="lazy" decoding="async">' +
              '<span class="nav__mega-case__tag">Erfolgsgeschichte</span>' +
              '<span class="nav__mega-case__title">Von zwei auf fünf Werke, mit Aufzeichnungen noch auf Papier</span>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</li>' +
      '<li class="nav__item">' +
        '<button class="nav__link" type="button">Ressourcen <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="nav__menu">' +
          '<a href="' + ROOT + 'fallstudien/"><b>Fallstudien</b></a>' +
          '<a href="' + ROOT + 'blog/"><b>Blog</b></a>' +
          '<a href="' + ROOT + 'glossar/"><b>Glossar</b></a>' +
        '</div>' +
      '</li>' +
      '<li class="nav__cta-mobile"><a class="btn btn--primary" href="' + demo + '">Demo anfordern</a></li>' +
    '</ul>' +
    '<a class="btn btn--primary nav__cta-desktop" href="' + demo + '">Demo anfordern</a>' +
    '<button class="nav__toggle" type="button" aria-label="Menü öffnen" aria-expanded="false">' +
      '<span></span><span></span><span></span>' +
    '</button>' +
  '</div></header>';

  var FOOTER =
  '<footer class="footer"><div class="wrap">' +
    '<div class="footer__in">' +
      '<div class="footer__brand">' +
        '<img class="f-logo" src="' + '/assets/logotipo-solved.webp" alt="Solved" width="1975" height="713" loading="lazy" decoding="async"/>' +
        '<p class="footer__addr">Edificio Angels, Sc Puerto, 13, Poblados Marítimos, 46024 Valencia</p>' +
        '<iframe class="footer__map" src="https://maps.google.com/maps?q=Edificio%20Angels%2C%20Carrer%20del%20Port%2013%2C%2046024%20Valencia&z=16&output=embed" title="Standort von Solved — Edificio Angels, Valencia" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
        '<a class="footer__social" href="https://www.linkedin.com/company/trysolved" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21H19.6v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/></svg></a>' +
      '</div>' +
      '<div class="footer__col">' +
        '<h4>Solved</h4>' +
        '<ul>' +
          '<li><a href="' + ROOT + '">Start</a></li>' +
          '<li><a href="' + ROOT + 'digitale-checklisten/">Aufzeichnungen/Checklisten</a></li>' +
          '<li><a href="' + ROOT + 'stoerungsmanagement/">Störungsmanagement</a></li>' +
          '<li><a href="' + ROOT + 'dokumentenmanagement/">Dokumentenverwaltung</a></li>' +
          '<li><a href="' + ROOT + 'anlagenverwaltung/">Anlagenverwaltung</a></li>' +
          '<li><a href="' + ROOT + 'dashboards/">Dashboard</a></li>' +
          '<li><a href="' + ROOT + 'ki/">KI</a></li>' +
          '<li><a href="' + ROOT + 'integrationen/">Integrationen</a></li>' +
          '<li><a href="' + ROOT + 'fallstudien/">Fallstudien</a></li>' +
          '<li><a href="' + ROOT + 'blog/">Blog</a></li>' +
          '<li><a href="' + ROOT + 'glossar/">Glossar</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="footer__col">' +
        '<h4>Nützliche Links</h4>' +
        '<ul>' +
          '<li><a href="' + ROOT + 'cookie-richtlinie/">Cookie-Richtlinie</a></li>' +
          '<li><a href="' + ROOT + 'datenschutzerklaerung/">Datenschutzerklärung</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="footer__strip"><div class="wrap footer__strip-in">' +
    '<img class="footer__lanzadera" src="' + '/assets/lanzadera.webp" alt="Lanzadera" width="1280" height="260" loading="lazy" decoding="async"/>' +
    '<div class="footer__eu">' +
      '<img src="' + '/assets/ivf-fondo.webp" alt="Gefördert von der Generalitat Valenciana, IVF (Institut Valencià de Finances) und der Europäischen Union" width="2238" height="403" loading="lazy" decoding="async"/>' +
    '</div>' +
  '</div></div>' +
  '<div class="footer__legal"><div class="wrap"><p>VOLTSTONE TECHNOLOGY SERVICES S.L. ha recibido una subvención por parte de la Generalitat Valenciana, dentro de la convocatoria: "Ayuda destinada a personas emprendedoras y pymes en apoyo al inicio y consolidación de su proyecto empresarial, para el ejercicio 2025 (EMPYME)", con número de expediente EMPYME/2025/254, por un importe de 14.995,95 €.</p></div></div>' +
  '</footer>';

  /* ====== El formulario de HubSpot, con la estética del sitio ======
     HubSpot pinta el formulario DENTRO DE UN IFRAME, así que ninguna hoja de la
     página lo alcanza: por eso se veía como HubSpot y no como Solved. Lo que sí
     se puede es entrar, porque el iframe es `about:blank` —el embed v2 escribe
     dentro en vez de cargar una URL— y eso lo deja en el MISMO ORIGEN. Aquí se
     le meten dos cosas: la tipografía del sitio y `ds/hsform.css`.

     Las rutas van ABSOLUTAS (`ROOT`, que sale del src de este script): dentro de
     `about:blank` una ruta relativa no resuelve contra nada.

     TRES CAUTELAS, y las tres han hecho falta:
     · Todo va en try/catch. Si algún día HubSpot sirve el iframe desde su
       dominio, el navegador bloquea el acceso y lanza; el formulario tiene que
       seguir funcionando sin vestir, que es exactamente lo que había antes.
     · La hoja se inyecta una vez por iframe (`data-vestido`): `onFormReady`
       puede dispararse más de una vez.
     · El alto lo lleva HubSpot midiendo su contenido, y nuestras reglas cambian
       ese alto DESPUÉS de que él mida. Por eso se observa el cuerpo del iframe y
       se le pone el alto que ocupa: sin esto, el botón se queda cortado por
       abajo. */
  function vestir(form) {
    try {
      var doc = (form && form.ownerDocument) || null;
      if (!doc || !doc.head || doc.documentElement.getAttribute('data-vestido')) return;
      doc.documentElement.setAttribute('data-vestido', '1');

      var fuente = doc.createElement('link');
      fuente.rel = 'stylesheet';
      fuente.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&display=swap';
      doc.head.appendChild(fuente);

      var hoja = doc.createElement('link');
      hoja.rel = 'stylesheet';
      hoja.href = ROOT + 'ds/hsform.css?v=20260910a';
      doc.head.appendChild(hoja);

      var marco = doc.defaultView && doc.defaultView.frameElement;
      if (!marco) return;
      var ajusta = function () {
        /* Se mide el FORMULARIO, no el cuerpo del iframe: el cuerpo trae el aire
           de HubSpot y dejaba un palmo en blanco debajo del botón, dentro de la
           tarjeta. Si el formulario ya se ha mandado, lo que hay es el mensaje
           de gracias, así que se mide lo que haya. */
        var pieza = doc.querySelector('form') || doc.querySelector('.submitted-message') || doc.body;
        var alto = pieza ? Math.ceil(pieza.getBoundingClientRect().height) : 0;
        if (alto) marco.style.height = alto + 'px';
      };
      hoja.addEventListener('load', ajusta);
      if (doc.defaultView.ResizeObserver && doc.body) {
        new doc.defaultView.ResizeObserver(ajusta).observe(doc.body);
        doc.defaultView.addEventListener('resize', ajusta);
      } else {
        setTimeout(ajusta, 300);
        setTimeout(ajusta, 1200);
      }
    } catch (e) { /* iframe de otro origen: el formulario se queda sin vestir */ }
  }

  function buildHsForms() {
    if (!window.hbspt || !window.hbspt.forms) return;
    var holders = document.querySelectorAll('.hs-contact-form');
    for (var i = 0; i < holders.length; i++) {
      if (holders[i].getAttribute('data-hs-done')) continue;
      if (!holders[i].id) holders[i].id = 'hs-form-' + i;
      holders[i].setAttribute('data-hs-done', '1');
      // data-hs-form="video" pide el formulario corto del gate de vídeo; sin
      // atributo —o sin id todavía para ese formulario— va el de contacto.
      var quiereVideo = holders[i].getAttribute('data-hs-form') === 'video';
      window.hbspt.forms.create({
        region: HUBSPOT.region,
        portalId: HUBSPOT.portalId,
        formId: (quiereVideo && formVideo()) ? formVideo() : HUBSPOT.formId,
        target: '#' + holders[i].id,
        onFormReady: vestir
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
        toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
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
        if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Menü öffnen'); }
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
    el.setAttribute('aria-label', 'Cookie-Hinweis');
    el.innerHTML =
      '<p class="cookie-banner__text">Wir verwenden eigene Cookies und Cookies von Dritten, um Ihre Erfahrung zu verbessern und die Nutzung der Website zu analysieren. Sie können sie annehmen oder ablehnen. Weitere Informationen in unserer <a href="' + ROOT + 'cookie-richtlinie/">Cookie-Richtlinie</a>.</p>' +
      '<div class="cookie-banner__actions">' +
        '<button class="btn btn--secondary" type="button" data-cookie="reject">Ablehnen</button>' +
        '<button class="btn btn--primary" type="button" data-cookie="accept">Akzeptieren</button>' +
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

/* ====== VÍDEOS DE AMBIENTE, QUE NO SE DESCARGAN HASTA QUE SE VEN ======
   El bloque de contacto lleva un vídeo en bucle en vez de una foto. Con el
   `src` puesto de entrada, un navegador con preload agresivo se trae el fichero
   en las 75 páginas que llevan ese bloque, y está al final de la página. Así
   que el `src` vive en `data-lazy` y se pone al asomar.

   Con `prefers-reduced-motion` no se pone nunca: se queda el póster, que es un
   fotograma del propio vídeo y cuenta lo mismo. Es la misma regla que ya sigue
   el vídeo de la banda de IA en ds/aiband.js. */
(function () {
  var videos = [].slice.call(document.querySelectorAll('video[data-lazy]'));
  if (!videos.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var arranca = function (v) {
    if (!v.src) v.src = v.getAttribute('data-lazy');
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  };
  if (!window.IntersectionObserver) { videos.forEach(arranca); return; }
  var ojo = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) { if (e.target.src) e.target.pause(); return; }
      arranca(e.target);
    });
  }, { rootMargin: '200px' });
  videos.forEach(function (v) { ojo.observe(v); });
})();


/* ====== APARICIÓN DE SECCIONES ======================================
   La entrada de las piezas al entrar en pantalla: opacidad y catorce píxeles
   de subida, escalonadas dentro de su propia fila. Es lo único que se mueve a
   nivel de página; todo lo demás que se anima en este sitio —la onda del hero,
   la banda de IA, las pantallas de producto, el rotador— se anima solo y por
   dentro.

   VIVE AQUÍ, EN `chrome.js`, Y NO EN UN FICHERO DE `ds/`, por una razón: es el
   único script que cargan las 702 páginas, incluidas las del blog y el
   glosario, que se regeneran solas. Un `<script>` nuevo habría que meterlo en
   cada HTML y en la plantilla del blog, y el de las páginas anidadas va por
   ruta relativa. Aquí llega a todo y sobrevive a los rebuilds. Al traductor no
   le afecta: no hay literales con etiquetas.

   ¡OJO CON DÓNDE SE PEGA! `build:i18n` corta este fichero por la cabecera del
   selector de idioma —la que empieza por «Selector de idioma»— y reescribe de
   ahí para abajo. Lo que se añada DESPUÉS de esa cabecera desaparece en el
   siguiente build; este bloque va antes, y por eso sobrevive. Y con la cabecera
   pasa lo mismo dentro de un comentario: escribirla entera aquí partía este
   fichero por la mitad en el build. Se nombra, no se copia.

   TRES REGLAS QUE SON EL COMPONENTE, no detalles de implementación:

   1. Sólo se esconde lo que ya está fuera de pantalla. Lo que se ve al cargar
      no se toca: ni parpadea, ni retrasa el LCP, ni depende de que este script
      llegue. Si el JS falla, la página se ve entera —el estado oculto lo pone
      él, no una hoja de estilos.
   2. Se anima el contenido, no la caja. La misma distinción que el resto del
      sistema: nada de escalas ni de rebotes; catorce píxeles y medio segundo.
   3. Con `prefers-reduced-motion` no se hace nada en absoluto. Ni observa, ni
      esconde: la página queda estática y completa.

   Lo que NO entra, y está elegido: el hero (ya tiene su onda y es el LCP), la
   composición de planta (su panel lleva `backdrop-filter`, y un ancestro
   transformado lo rompe mientras dura la animación), las pantallas de producto
   por dentro y los paneles del rotador, que tienen la suya. */
(function () {
  var REDUCIDO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCIDO || !window.IntersectionObserver) return;

  /* Las piezas que aparecen. Todas comprobadas contra el marcado del sitio: una
     lista con selectores que no existen se lee como si el efecto estuviera y no
     está. */
  var PIEZAS = [
    '.section-head > h2', '.section-head > p',
    '.ds-stats > .ds-stat',
    '.scene-grid > .scene', '.scene-grid > .aiband',
    '.reasons > div', '.trio > div',
    '.card', '.blog-card', '.shot', '.quote', '.faq__item', '.rotador'
  ].join(',');

  var FUERA = '.ds-hero, .compo, .rotador__vista, .app, .device, .nav, .footer';

  function montar() {
    var vistos = [];
    var alto = window.innerHeight || 0;

    [].slice.call(document.querySelectorAll(PIEZAS)).forEach(function (el) {
      if (el.closest(FUERA)) return;
      // Ya visible al cargar: se queda como está. Ésta es la regla 1.
      if (el.getBoundingClientRect().top < alto * 0.92) return;
      // El escalonado es por fila —el índice va en el padre— y se corta a los
      // seis: en una rejilla de doce tarjetas, la última entraría casi un
      // segundo después que la primera y eso ya no se lee como una entrada.
      var padre = el.parentNode;
      var i = padre.__revI || 0;
      padre.__revI = i + 1;
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transitionProperty = 'opacity, transform';
      el.style.transitionDuration = '.52s';
      el.style.transitionTimingFunction = 'cubic-bezier(.2,.7,.3,1)';
      el.style.transitionDelay = (Math.min(i, 5) * 0.07) + 's';
      el.style.willChange = 'opacity, transform';
      vistos.push(el);
    });

    if (!vistos.length) return;

    function revelar(el) {
      ojo.unobserve(el);
      el.style.opacity = '';
      el.style.transform = '';
      // Al acabar se limpia todo: la pieza vuelve a ser una pieza normal y no
      // se queda con una capa de composición abierta para siempre.
      setTimeout(function () {
        el.style.transitionProperty = '';
        el.style.transitionDuration = '';
        el.style.transitionTimingFunction = '';
        el.style.transitionDelay = '';
        el.style.willChange = '';
      }, 1000);
    }

    // `threshold: 0` a propósito: con un umbral por encima de cero, una pieza
    // cuya imagen aún no ha cargado mide cero de alto, no llega al umbral y se
    // queda escondida a la vista de todos. Pasó en el índice del blog.
    var ojo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) revelar(e.target); });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

    vistos.forEach(function (el) { ojo.observe(el); });

    // Red de seguridad: cuando ha cargado todo —imágenes incluidas— la maqueta
    // se ha movido, y lo que haya quedado escondido dentro de la ventana se
    // enseña sin esperar a que el usuario baje. Una pieza invisible es peor que
    // una pieza sin animar.
    window.addEventListener('load', function () {
      setTimeout(function () {
        vistos.forEach(function (el) {
          if (el.style.opacity !== '0') return;
          var c = el.getBoundingClientRect();
          if (c.top < (window.innerHeight || 0) && c.bottom > 0) revelar(el);
        });
      }, 300);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

/* ====== Selector de idioma ======
   Se construye con los <link rel="alternate" hreflang> que ya lleva la página,
   así que apunta siempre a la traducción exacta de ESTA página y no a la home
   del idioma, que es el error clásico y el que hace que Google trate las
   versiones como duplicados sueltos. */
(function () {
  var NOMBRES = {"es":"Español","en":"English","fr":"Français","it":"Italiano","de":"Deutsch","pt-PT":"Português"};

/* El resto de chrome.js pinta la nav en DOMContentLoaded, así que esto tiene
   que esperar igual: montado a la primera no encontraba .nav__links y salía sin
   hacer nada, que es como el selector estuvo invisible en los cinco idiomas. */
function montarSelector() {
  var actual = document.documentElement.lang || 'es';
  var alt = [].slice.call(document.querySelectorAll('link[rel="alternate"][hreflang]'))
    .filter(function (l) { return l.hreflang !== 'x-default' && NOMBRES[l.hreflang]; });
  if (alt.length < 2) return;

  var nav = document.querySelector('.nav__links');
  if (!nav) return;

  var li = document.createElement('li');
  li.className = 'nav__item nav__item--lang';
  var opciones = alt.map(function (l) {
    var activo = l.hreflang === actual ? ' aria-current="true"' : '';
    // Sólo la ruta: los hreflang son absolutos contra trysolved.com —tienen que
    // serlo— y usarlos tal cual sacaba del sitio a quien mirase la web en local
    // o en la página de github.io. Es la misma razón por la que chrome.js
    // deriva ROOT en vez de escribir el dominio.
    var ruta = l.href;
    try { ruta = new URL(l.href, location.href).pathname; } catch (e) {}
    return '<a href="' + ruta + '" lang="' + l.hreflang + '"' + activo + '>' +
           NOMBRES[l.hreflang] + '</a>';
  }).join('');
  li.innerHTML =
    '<button class="nav__link" type="button" aria-label="' + NOMBRES[actual] + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
        '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/>' +
      '</svg> ' + actual.toUpperCase() +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>' +
    '</button>' +
    '<div class="nav__menu nav__menu--lang">' + opciones + '</div>';

  var cta = nav.querySelector('.nav__cta-mobile');
  if (cta) nav.insertBefore(li, cta); else nav.appendChild(li);
}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montarSelector);
  else montarSelector();
})();
