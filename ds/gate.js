/* =========================================================
   Solved Design System — GATE DE VÍDEO
   Lo que abre el vídeo de una landing de caso cuando alguien deja su correo, y
   lo que se lo deja abierto si ya lo dejó otro día.

   UN GATE POR PÁGINA
   Se busca `.gate` y se coge el primero. No es pereza: el embebido de HubSpot
   avisa del envío con un postMessage que NO dice de qué formulario viene, así
   que con dos gates en la misma página el envío de uno abriría los dos vídeos.
   Cada caso tiene su landing y su formulario, y así la señal es inequívoca.

   POR QUÉ ESCUCHA UN `message` Y NO UN CALLBACK
   El formulario lo monta chrome.js, que es genérico y sirve a todo el sitio;
   pasarle un callback sólo para estas páginas lo ataría a ellas. El embebido de
   HubSpot publica cada evento del formulario con postMessage sobre la ventana
   de arriba, así que aquí se escucha eso y las dos piezas no se conocen.

   EL VÍDEO NO SE DESCARGA HASTA QUE SE ABRE
   El `src` vive en `data-src` hasta ese momento. Con el vídeo puesto de
   entrada, un navegador con preload agresivo se trae 20 MB para enseñar un
   póster.

   Requiere ds/gate.css.
   ========================================================= */
(() => {
  'use strict';

  const gate = document.querySelector('.gate');
  if (!gate) return;

  /* La marca de "ya lo dejó", una por caso: quien vio el de Carnavi no ha
     pedido el de Panificadora, y darle los dos por dejar un correo convertiría
     dos formularios en uno mal contado. Va con try/catch porque en navegación
     privada de algunos navegadores localStorage existe pero lanza al escribir,
     y quedarse sin abrir el vídeo por eso sería absurdo. */
  const LLAVE = 'solved:casos-video:' + (gate.getAttribute('data-caso') || 'general');
  const recordar = () => { try { localStorage.setItem(LLAVE, '1'); } catch (e) {} };
  const recordado = () => { try { return localStorage.getItem(LLAVE) === '1'; } catch (e) { return false; } };

  let abierto = false;

  function abrir({ reproducir }) {
    if (abierto) return;
    abierto = true;

    const video = gate.querySelector('.gate__video');
    if (video) {
      const src = video.getAttribute('data-src');
      if (src && !video.src) video.src = src;
      video.controls = true;
      // Sólo arranca solo si el gesto viene de enviar el formulario: al que
      // vuelve otro día no se le pone un vídeo a sonar de golpe. Con sonido,
      // así que puede fallar por la política de autoplay del navegador — de ahí
      // el catch: si no puede, se queda con los controles a la vista, que es lo
      // que pasaría de todas formas.
      if (reproducir) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
    }

    gate.setAttribute('data-open', '');
  }

  // Vuelta de otro día: abierto y quieto, sin pasar por el formulario.
  if (recordado()) abrir({ reproducir: false });

  /* El botón del póster cerrado no abre nada: lleva al formulario, que es lo
     único que abre. Y además del scroll deja el foco allí, porque un scroll sin
     foco obliga a quien navega con teclado a recorrerse la página otra vez.

     HubSpot pinta su formulario dentro de un <iframe> de hsforms.net, así que
     desde aquí NO se puede enfocar el campo del correo: es otro documento y de
     otro origen. Lo que sí se puede es enfocar el propio iframe, y desde ahí el
     primer tabulador ya cae dentro del formulario. El querySelector del input
     se queda por delante por si algún día se sirve el formulario en crudo. */
  const btn = gate.querySelector('.gate__open');
  if (btn) btn.addEventListener('click', () => {
    const caja = gate.querySelector('.gate__ask');
    if (!caja) return;
    caja.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => {
      const destino = caja.querySelector('input[type="email"], input') || caja.querySelector('iframe');
      if (destino) destino.focus({ preventScroll: true });
    }, 400);
  });

  addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || d.type !== 'hsFormCallback') return;
    if (d.eventName !== 'onFormSubmitted') return;
    recordar();
    abrir({ reproducir: true });
  });

  /* Rescate. Si a los seis segundos el hueco del formulario sigue vacío, es que
     el embebido de HubSpot no ha llegado —lo habitual es un bloqueador de
     anuncios—. No se abre el vídeo por las bravas: se enseña una salida, que es
     lo honesto cuando el formulario que pides no se puede rellenar.
     Con HubSpot en pie el hueco tiene dentro un <iframe>, así que la cuenta de
     hijos distingue las dos situaciones sin tener que mirar dentro. */
  setTimeout(() => {
    if (abierto) return;
    const hueco = gate.querySelector('.hs-contact-form');
    if (hueco && hueco.childElementCount === 0) gate.setAttribute('data-form', 'fallido');
  }, 6000);
})();
