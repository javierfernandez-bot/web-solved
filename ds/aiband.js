/* =========================================================
   Solved Design System — BANDA DE IA
   El bucle de la banda: teclea la pregunta, la manda, busca y enseña la
   respuesta con las piezas de las que sale. Cuatro turnos y vuelta a empezar.

   EL SCRIPT NO PINTA NADA
   Todo el contenido —las cuatro preguntas, sus respuestas y sus piezas— está en
   el marcado. Esto sólo enciende y apaga turnos y borra el texto para volver a
   escribirlo. Si el script no corre, ds/aiband.css deja el primer turno
   resuelto y quieto, que sigue contando la historia. Por eso .is-live lo pone
   este fichero: la hoja no puede dar por hecho que hay quien mueva la pieza.

   NO SE MUEVE SI NADIE MIRA
   Se para fuera de pantalla y con la pestaña en segundo plano. Es un bucle
   infinito con tipografía animada: dejarlo corriendo detrás de otra pestaña es
   gastar batería para nadie.

   MOVIMIENTO REDUCIDO
   Ni se arranca. Quien lo pide se queda con la foto fija del primer turno, que
   es exactamente lo que enseña la hoja sin .is-live.

   Requiere ds/aiband.css.
   ========================================================= */
(() => {
  'use strict';

  const banda = document.querySelector('.aiband');
  if (!banda) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const turnos = [...banda.querySelectorAll('.aiband__turn')];
  const leyendas = [...banda.querySelectorAll('.aiband__leg')];
  if (turnos.length < 2) return;

  /* El texto de cada pregunta se guarda antes de vaciar la caja: la fuente es
     el marcado, no una lista aquí dentro. Así se edita la pregunta donde se
     lee, y no en dos sitios. */
  const preguntas = turnos.map((t) => {
    if (t.dataset.tipo === 'propuesta') return '';
    const q = t.querySelector('.aiband__q');
    return q ? q.textContent.trim() : '';
  });

  /* — Compás —
     Los tiempos de un turno, en milisegundos. Están juntos a propósito: es lo
     único que se toca para que la banda vaya más lenta o más rápida.
     El tecleo va a 32 ms por carácter, con una respiración detrás de cada coma
     y de cada signo, que es lo que separa "escribir" de "aparecer de golpe". */
  const TECLA = 32, RESPIRO = 130;
  const ENVIO = 340;      // el dedo antes de mandar
  const BUSCA = 1100;     // lo que dura "buscando en…"
  const LEER  = 4200;     // la respuesta, en pantalla
  const SALIR = 300;      // el turno que se va

  let enPausa = false;

  /* Espera que respeta la pausa: al despertar, si la banda está parada, se
     queda comprobando en vez de seguir. Sin esto, volver a la pestaña después
     de un rato encadenaría de golpe todos los pasos pendientes. */
  const dormir = (ms) => new Promise((listo) => {
    setTimeout(function comprobar() {
      if (!enPausa) return listo();
      setTimeout(comprobar, 200);
    }, ms);
  });

  const pintarLeyenda = (i) => {
    leyendas.forEach((l, n) => l.classList.toggle('is-on', n === i));
  };

  async function escribir(caja, texto) {
    caja.textContent = '';
    for (let i = 0; i < texto.length; i++) {
      caja.textContent += texto[i];
      const pausa = ',;:?¿'.includes(texto[i]) ? RESPIRO : TECLA;
      await dormir(pausa);
    }
  }

  async function turno(i) {
    const t = turnos[i];
    const caja = t.querySelector('.aiband__q');

    /* El turno de propuesta no se teclea: ahí la barra está en reposo —con su
       placeholder— y quien habla es Solved. Por eso ni entra en modo escritura
       ni borra la caja: lo que se lee es la propuesta, debajo. */
    const propuesta = t.dataset.tipo === 'propuesta';

    turnos.forEach((o) => o.classList.remove('is-on', 'is-out', 'is-typing', 'is-sent', 'is-searching', 'is-answer'));
    if (caja && !propuesta) caja.textContent = '';
    t.classList.add('is-on');
    if (!propuesta) t.classList.add('is-typing');
    pintarLeyenda(i);

    await dormir(260);                 // que acabe de entrar antes de teclear
    if (propuesta) {
      await dormir(2000);              // lo que se tarda en leer la propuesta
    } else if (caja) {
      await escribir(caja, preguntas[i]);
    }
    t.classList.remove('is-typing');

    await dormir(ENVIO);
    t.classList.add('is-sent', 'is-searching');

    await dormir(BUSCA);
    t.classList.add('is-answer');

    await dormir(LEER);
    t.classList.add('is-out');
    await dormir(SALIR);
  }

  async function bucle() {
    let i = 0;
    // Sin condición de salida a propósito: la banda vive lo que viva la página,
    // y la pausa —no una parada— es lo que la apaga cuando no se ve.
    for (;;) {
      await turno(i);
      i = (i + 1) % turnos.length;
    }
  }

  /* La pausa tiene dos motivos y un solo interruptor: fuera de pantalla y
     pestaña oculta. Se combinan, que si no, volver a la pestaña con la banda
     fuera de pantalla la pondría a correr sin que nadie la vea. */
  let visible = true, enPantalla = true;
  const revisar = () => { enPausa = !(visible && enPantalla); };

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    revisar();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { enPantalla = e.isIntersecting; revisar(); });
    }, { threshold: 0.15 }).observe(banda);
  }

  banda.classList.add('is-live');
  bucle();
})();

/* =========================================================
   EL VÍDEO DE LA BANDA (patrón `.iavideo`)
   Lo mismo que la banda, pero grabado: el MP4 que sale de
   `npm run render:ia` puesto en una landing.

   EL VÍDEO NO SE DESCARGA HASTA QUE SE VE
   El `src` vive en `data-src` y sólo se pone al entrar en pantalla; hasta
   entonces se ve el póster. Es la misma regla del gate de los casos: con el
   `src` puesto de entrada, un navegador con preload agresivo se trae el
   fichero entero para enseñar una imagen fija.

   MOVIMIENTO REDUCIDO: SE QUEDA EL PÓSTER
   Quien pide que nada se mueva no quiere un bucle infinito de 26 s. El póster
   es el fotograma con la primera respuesta ya puesta, así que sigue contando
   lo que el vídeo cuenta. Un `autoplay` en el marcado no obedece a esa
   preferencia por sí solo: por eso el arranque lo decide este script.

   Requiere `.iavideo` de ds/aiband.css.
   ========================================================= */
(() => {
  'use strict';

  const videos = [...document.querySelectorAll('.iavideo__v[data-src]')];
  if (!videos.length) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Sin observador —navegador viejo— se cargan y se reproducen sin más: es
  // preferible gastar la descarga a dejar la banda quieta para siempre.
  if (!('IntersectionObserver' in window)) {
    videos.forEach((v) => { v.src = v.dataset.src; v.play().catch(() => {}); });
    return;
  }

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        // El play puede fallar (ahorro de batería, política del navegador). Si
        // falla, se queda el póster, que es un estado válido y no un error.
        v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { threshold: 0.2 });

  videos.forEach((v) => obs.observe(v));
})();
