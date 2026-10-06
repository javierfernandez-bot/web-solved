/* =========================================================
   Solved Design System — SECCIONES DE CONTENIDO
   Una sola cosa: los controles del carril recortado (patrón 3 de
   ds/sections.css). El resto de los patrones de esa hoja —banda de caso, lista
   de casos, trío y cita— son HTML y CSS y no necesitan script.

   El carril NO depende de esto. Va con scroll nativo y scroll-snap: sin JS
   siguen estando el arrastre, la rueda y el teclado, y las seis tarjetas se
   alcanzan igual. Lo que añade el script son las flechas.

   Por eso .rail__controls viene con [hidden] en el marcado y lo quita este
   script. Es la misma regla que .scene__expand: la afordancia sólo se pinta si
   hace algo. Un par de flechas muertas cuestan más confianza de la que ganan.
   ========================================================= */
(() => {
  'use strict';

  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.rail').forEach((carril) => {
    const pista     = carril.querySelector('.rail__track');
    const controles = carril.querySelector('.rail__controls');
    if (!pista || !controles) return;

    const [atras, alante] = controles.querySelectorAll('.rail__btn');
    if (!atras || !alante) return;

    // Si no hay nada que desplazar —pocas tarjetas, pantalla ancha— no es un
    // carril, y las flechas sobran. Se comprueba otra vez en cada resize.
    const desplazable = () => pista.scrollWidth - pista.clientWidth > 1;

    /* Un clic = una tarjeta. El paso se mide del DOM y no de una constante:
       .rail__track cambia de grid-auto-columns en cada escalón responsive, y
       una constante se desincronizaría con el CSS a la primera. */
    const paso = () => {
      const item = pista.querySelector('.rail__item');
      if (!item) return pista.clientWidth;
      const hueco = parseFloat(getComputedStyle(pista).columnGap) || 0;
      return item.getBoundingClientRect().width + hueco;
    };

    const mover = (signo) => pista.scrollBy({
      left: signo * paso(),
      behavior: quieto ? 'auto' : 'smooth'
    });

    /* Los extremos apagan su flecha. El margen de 1px absorbe los decimales del
       zoom y de las columnas fraccionarias: sin él, la flecha del final se
       queda encendida sobre un resto de medio píxel. */
    const pintar = () => {
      const hay = desplazable();
      controles.hidden = !hay;
      if (!hay) return;
      atras.disabled  = pista.scrollLeft <= 1;
      alante.disabled = pista.scrollLeft >= pista.scrollWidth - pista.clientWidth - 1;
    };

    atras.addEventListener('click',  () => mover(-1));
    alante.addEventListener('click', () => mover(1));

    // Una lectura por fotograma: el evento scroll llega decenas de veces entre
    // repintados y cada lectura de scrollWidth fuerza layout.
    let pendiente = false;
    pista.addEventListener('scroll', () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => { pendiente = false; pintar(); });
    }, { passive: true });

    addEventListener('resize', pintar);
    pintar();
  });
})();

/* =========================================================
   CONMUTADOR DE PANELES (patrón 7 de ds/sections.css)
   El contenido de los tres paneles está entero en el marcado; esto sólo lo
   pliega. Si el script no corre, se ven los tres seguidos —contenido completo,
   sin JS—, que es el estado seguro. Por eso los `hidden` los pone el script.
   ========================================================= */
(() => {
  'use strict';
  document.querySelectorAll('[data-switch]').forEach((bloque) => {
    const tabs    = [...bloque.querySelectorAll('.switch__tab')];
    const paneles = [...bloque.querySelectorAll('.switch__panel')];
    if (tabs.length < 2 || tabs.length !== paneles.length) return;

    const mostrar = (i, mover) => {
      tabs.forEach((t, n) => {
        t.setAttribute('aria-selected', String(n === i));
        t.tabIndex = n === i ? 0 : -1;
      });
      paneles.forEach((p, n) => { p.hidden = n !== i; });
      if (mover) tabs[i].focus();
    };

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => mostrar(i, false));
      // Flechas dentro de la tira, que es lo que espera un tablist.
      t.addEventListener('keydown', (e) => {
        const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!paso) return;
        e.preventDefault();
        mostrar((i + paso + tabs.length) % tabs.length, true);
      });
    });

    mostrar(0, false);
  });
})();

/* =========================================================
   ESCALERA DE PASOS (patrón 8)
   Enciende el riel al entrar en pantalla. Sin observador —navegador viejo— la
   clase se pone igual y el riel queda dibujado, que es el estado bueno.
   ========================================================= */
(() => {
  'use strict';
  const escaleras = document.querySelectorAll('.steps');
  if (!escaleras.length) return;

  if (!('IntersectionObserver' in window)) {
    escaleras.forEach((e) => e.classList.add('is-in'));
    return;
  }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      obs.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -20% 0px' });
  escaleras.forEach((e) => obs.observe(e));
})();


/* =========================================================
   ESCENA CON BOCADILLO (patrón 10)
   Lo único que necesita script: parar el vídeo de fondo si el visitante ha
   pedido menos movimiento. El resto —autoplay, mute, bucle— lo hace el
   marcado. Se para en el fotograma 0, que es el póster, así que no se nota
   que había un vídeo.
   ========================================================= */
(() => {
  'use strict';
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.stage__media video').forEach((v) => {
    v.autoplay = false;
    v.removeAttribute('autoplay');
    v.pause();
    v.currentTime = 0;
  });
})();

/* =========================================================
   EL VÍDEO MANDA EL RELOJ (patrón 10 + pantallas de ds/app.css)
   ---------------------------------------------------------
   Una escena con vídeo en bucle y un bocadillo animado por CSS son dos relojes
   distintos: el vídeo dura 5,04 s y la animación lo que diga su declaración.
   A la primera vuelta se separan y ya no vuelven a coincidir nunca.

   Esto los ata:
     1. Pone --rl-dur a la duración real del vídeo, que es de donde las
        animaciones del bocadillo sacan la suya.
     2. Cada vez que el vídeo da la vuelta —currentTime retrocede— devuelve las
        animaciones a cero.

   No se sincroniza en cada `timeupdate` porque corregir cuatro veces por
   segundo se ve a tirones: basta con reengancharlas en cada vuelta.

   Sin JS todo sigue funcionando: --rl-dur tiene valor de reserva en la hoja y
   las animaciones corren por su cuenta. Sólo se pierde el enganche.
   ========================================================= */
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.stage').forEach((escena) => {
    const video = escena.querySelector('.stage__media video');
    const capa  = escena.querySelector('.stage__bocadillo');
    if (!video || !capa) return;

    const enCero = () => {
      capa.getAnimations({ subtree: true }).forEach((a) => { a.currentTime = 0; });
    };

    const ajusta = () => {
      if (!video.duration || !isFinite(video.duration)) return;
      escena.style.setProperty('--rl-dur', video.duration + 's');
      enCero();
    };

    if (video.readyState >= 1) ajusta();
    video.addEventListener('loadedmetadata', ajusta);

    // La vuelta del bucle no dispara ningún evento propio: se detecta porque el
    // tiempo retrocede.
    let previo = 0;
    video.addEventListener('timeupdate', () => {
      if (video.currentTime < previo) enCero();
      previo = video.currentTime;
    });
    video.addEventListener('play', enCero);
  });
})();

