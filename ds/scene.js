/* =========================================================
   Solved Design System — ESCENA INTERACTIVA
   Dos cosas, y sólo dos: el halo del borde que sigue al cursor, y la apertura
   del diálogo de la escena.

   Nada de esto es imprescindible para que la sección funcione. Sin JS, las
   escenas se ven enteras con su tinte y su fragmento, y el diálogo sigue
   siendo alcanzable —es un <dialog> con su contenido en el HTML, indexable y
   enlazable—. El script añade; no sostiene.
   ========================================================= */
(() => {
  'use strict';

  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     HALO DEL BORDE
     Se escribe la posición del ratón en dos variables CSS y el resto lo hace
     la transición de ds/scene.css. Aquí no se anima nada a mano: si el halo se
     moviera desde JS habría que sincronizar el easing con el CSS y se
     desincronizaría a la primera.

     Los eventos van sobre la escena y no sobre document: un mousemove global
     en una página con seis tarjetas dispara seis veces por pixel.
     --------------------------------------------------------- */
  const seguirCursor = (escena) => {
    const halo = escena.querySelector('.scene__glow');
    if (!halo || quieto) return;

    let pendiente = false, ultimo = null;

    escena.addEventListener('pointermove', (e) => {
      ultimo = e;
      if (pendiente) return;
      pendiente = true;
      // Una escritura por fotograma. Sin esto se tocan las variables CSS
      // decenas de veces entre repintados, y cada toque invalida el estilo.
      requestAnimationFrame(() => {
        pendiente = false;
        const r = escena.getBoundingClientRect();
        halo.style.setProperty('--glow-x', (ultimo.clientX - r.left) + 'px');
        halo.style.setProperty('--glow-y', (ultimo.clientY - r.top) + 'px');
      });
    });
  };

  /* ---------------------------------------------------------
     DIÁLOGO
     El destino lo declara el marcado en .scene__expand[data-expand-target],
     que es el contrato que ya tenía el componente: la afordancia sólo se pinta
     si expande de verdad. Aquí no se inventa ninguna otra vía.
     --------------------------------------------------------- */
  const abrirDialogo = (escena) => {
    const disparador = escena.querySelector('.scene__expand[data-expand-target]');
    if (!disparador) return;

    const dlg = document.getElementById(disparador.dataset.expandTarget);
    if (!dlg || typeof dlg.showModal !== 'function') return;

    escena.setAttribute('aria-haspopup', 'dialog');
    escena.setAttribute('aria-expanded', 'false');

    // El nombre accesible del botón es su propio título. Sin esto, un lector de
    // pantalla anuncia "botón" y punto: el h3 está dentro, pero el marcado no
    // dice que sea la etiqueta.
    const titulo = escena.querySelector('.scene__title');
    if (titulo) {
      // Sufijo propio: el diálogo ya usa "<id>-t" para su <h2>, y dos ids
      // iguales dejarían el aria-labelledby apuntando a cualquiera de los dos.
      if (!titulo.id) titulo.id = (dlg.id || 'escena') + '-card-t';
      escena.setAttribute('aria-labelledby', titulo.id);
    }

    escena.addEventListener('click', () => {
      dlg.showModal();
      escena.setAttribute('aria-expanded', 'true');
      // El foco entra en el diálogo, pero al cerrar tiene que volver a la
      // tarjeta desde la que se abrió, no al principio de la página.
      dlg.addEventListener('close', () => {
        escena.setAttribute('aria-expanded', 'false');
        escena.focus();
      }, { once: true });
    });

    dlg.querySelectorAll('[data-dialog-close]').forEach((b) =>
      b.addEventListener('click', () => dlg.close())
    );

    // Clic en el fondo. El <dialog> recibe el evento del ::backdrop como si
    // fuera suyo, así que se compara contra su propia caja: fuera de ella,
    // el clic ha sido en el velo.
    dlg.addEventListener('click', (e) => {
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const dentro = e.clientX >= r.left && e.clientX <= r.right &&
                     e.clientY >= r.top  && e.clientY <= r.bottom;
      if (!dentro) dlg.close();
    });
  };

  /* ---------------------------------------------------------
     PAUSA FUERA DE PANTALLA, Y VUELTA DESDE EL PRINCIPIO
     Las pantallas de dentro de las tarjetas se animan en bucle. Una tarjeta
     que no se ve no tiene por qué estar repintando, así que al salir del
     viewport se le marca data-offscreen y ds/scene.css pone --play en
     `paused`.

     Se marca lo OCULTO y no lo visible a propósito: si el script no carga,
     ninguna escena lleva el atributo, --play se queda en `running` y todo se
     mueve igual. Al revés —marcando lo visible— sin JS no se movería nada.

     Y AL VOLVER, SE REINICIA, NO SE REANUDA. `--play:paused` por sí solo deja
     el bucle donde estaba —pausado a los 3 de un ciclo de 8, seguiría a los 3
     al volver—, y lo que se pide es que una escena vista a medias, perdida de
     vista y recuperada, se cuente otra vez desde el principio. Por eso, justo
     cuando una escena que ANTES estaba marcada `data-offscreen` deja de
     estarlo, se ponen a 0 los fotogramas de todo lo de dentro
     (`getAnimations().currentTime`) antes de que `--play` vuelva a `running`.
     La primera vez que una escena entra en pantalla no cuenta como «vuelta»
     —no llevaba el atributo— y no se toca: ya empieza desde donde la cargó el
     navegador, que es su principio de verdad. */
  const pausarFuera = (escenas) => {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        const volvia = e.target.hasAttribute('data-offscreen');
        const fuera = !e.isIntersecting;
        e.target.toggleAttribute('data-offscreen', fuera);
        if (!fuera && volvia && e.target.getAnimations) {
          e.target.getAnimations({ subtree: true }).forEach((a) => { a.currentTime = 0; });
        }
      });
      // Un margen generoso: la animación arranca antes de que la tarjeta
      // asome, no cuando ya está a la vista y se nota el tirón.
    }, { rootMargin: '200px' });
    escenas.forEach((s) => obs.observe(s));
  };

  const escenas = document.querySelectorAll('.scene');
  escenas.forEach((escena) => {
    seguirCursor(escena);
    abrirDialogo(escena);
  });
  pausarFuera(escenas);
})();
