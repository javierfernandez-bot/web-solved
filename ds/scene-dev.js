/* =========================================================
   Solved Design System — VALIDADOR DE ESCENAS (sólo desarrollo)

   Ayuda de desarrollo, no un bloqueo: avisa por consola y no toca nada del
   render. En producción no se carga —este fichero sólo se enlaza desde
   guidelines/ y desde las páginas mientras se montan— y aunque se colara,
   la guarda de abajo lo deja mudo fuera de localhost.

   Lo que vigila, que es justo lo que se degrada solo:
     · repartos de columna que no son de la lista
     · rejillas de tres escenas (la regla de amplitud dice cuatro o seis)
     · dos filas de 12 seguidas
     · data-module inventado (y por tanto tarjeta sin tinte)
     · iconos de expandir que no expanden
   ========================================================= */

(() => {
  const h = location.hostname;
  const ENTORNO_DEV =
    location.protocol === 'file:' ||
    h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h.endsWith('.local');
  if (!ENTORNO_DEV) return;

  const MODULOS = ['incidencias', 'acciones', 'checklists', 'activos', 'kpis', 'ia'];
  const SPANS = ['4', '6', '8', '12'];
  // 'fila' no es una proporción: es la escena estrecha de una fila mixta (8+4 o
  // 4+8) que toma el alto de la ancha. Ver ds/scene.css.
  const RATIOS = ['4:3', '1:1', '21:9', 'fila'];
  const REPARTOS = [[6, 6], [4, 4, 4], [8, 4], [4, 8], [12]];

  const aviso = (msg, nodo) => console.warn('[escena] ' + msg, nodo || '');
  const clave = (r) => r.join('+');

  // Reparto permitido más cercano: el que menos piezas hay que mover.
  // Sirve para que el aviso diga qué hacer, no sólo que está mal.
  const masCercano = (fila) => {
    let mejor = null, mejorCoste = Infinity;
    for (const r of REPARTOS) {
      const coste = Math.abs(r.length - fila.length) +
        r.reduce((a, v, i) => a + Math.abs(v - (fila[i] ?? 0)), 0) / 12;
      if (coste < mejorCoste) { mejorCoste = coste; mejor = r; }
    }
    return mejor;
  };

  const revisarRejilla = (rejilla) => {
    const escenas = [...rejilla.children].filter((n) => n.classList.contains('scene'));
    if (!escenas.length) return;

    // — Tres escenas venden corto —
    if (escenas.length === 3) {
      aviso('la rejilla tiene tres escenas. Enseñar tres módulos vende corto: van cuatro o seis.', rejilla);
    }
    if (escenas.length > 6) {
      aviso(`la rejilla tiene ${escenas.length} escenas. Por encima de seis nadie las mira.`, rejilla);
    }

    // — Repartos por filas —
    // Se reproduce la colocación de CSS Grid: una escena que no cabe en lo que
    // queda de fila baja a la siguiente. Contar hasta pasarse de 12 daría filas
    // que el navegador nunca dibuja.
    const filas = [];
    let fila = [], suma = 0;
    for (const e of escenas) {
      const span = Number(e.getAttribute('data-span') || 6);
      if (suma + span > 12) { filas.push(fila); fila = []; suma = 0; }
      fila.push(span); suma += span;
      if (suma === 12) { filas.push(fila); fila = []; suma = 0; }
    }
    if (fila.length) filas.push(fila);

    filas.forEach((f, i) => {
      const suma = f.reduce((a, v) => a + v, 0);
      const valido = REPARTOS.some((r) => r.length === f.length && r.every((v, j) => v === f[j]));
      if (!valido) {
        aviso(
          `fila ${i + 1}: reparto ${clave(f)}${suma !== 12 ? ` (suma ${suma}, no 12)` : ''}. ` +
          `El permitido más cercano es ${clave(masCercano(f))}. ` +
          `Sólo valen 6+6, 4+4+4, 8+4, 4+8 y 12.`,
          rejilla
        );
      }
    });

    // — Dos filas de 12 seguidas —
    for (let i = 1; i < filas.length; i++) {
      if (clave(filas[i]) === '12' && clave(filas[i - 1]) === '12') {
        aviso(`filas ${i} y ${i + 1}: dos escenas de 12 columnas seguidas. Un 12 no puede repetirse.`, rejilla);
        break;
      }
    }
  };

  const revisarEscena = (escena) => {
    const mod = escena.getAttribute('data-module');
    if (!MODULOS.includes(mod)) {
      aviso(
        `data-module="${mod ?? ''}" no existe, así que la escena se queda sin tinte. ` +
        `Los seis son: ${MODULOS.join(', ')}. El tinte lo dicta el módulo y no hay forma de pasarlo a mano.`,
        escena
      );
    }

    const span = escena.getAttribute('data-span');
    if (span && !SPANS.includes(span)) aviso(`data-span="${span}" no es 4, 6, 8 ni 12.`, escena);

    const ratio = escena.getAttribute('data-ratio');
    if (!ratio) aviso('escena sin data-ratio: la altura la fija la proporción, no el contenido.', escena);
    else if (!RATIOS.includes(ratio)) aviso(`data-ratio="${ratio}" no es 4:3, 1:1 ni 21:9.`, escena);

    if (!escena.querySelector('.scene__media')) {
      aviso('escena sin .scene__media: una escena sin fragmento de producto es un rectángulo de color.', escena);
    }

    // — Afordancia falsa —
    const expandir = escena.querySelector('.scene__expand');
    if (expandir && !expandir.hasAttribute('data-expand-target')) {
      aviso(
        'icono de expandir sin data-expand-target: no se pinta. ' +
        'Una afordancia que no hace nada cuesta más confianza de la que gana.',
        expandir
      );
    }

    // — El material de gradiente no entra en una escena —
    if (escena.querySelector('canvas, [class*="weave"], [class*="hero-wave"]')) {
      aviso(
        'hay material de gradiente dentro de una escena. El lienzo es tinte plano: ' +
        'con filamentos dentro, el fragmento deja de leerse.',
        escena
      );
    }
  };

  const revisar = () => {
    document.querySelectorAll('.scene-grid').forEach(revisarRejilla);
    document.querySelectorAll('.scene').forEach(revisarEscena);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', revisar);
  else revisar();
})();
