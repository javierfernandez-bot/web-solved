/* Solved · Rotador de capacidades (patrón 12 de ds/sections.css).

   Pliega lo que el marcado ya trae entero: sin este script se ven las cuatro
   capacidades abiertas y los cuatro paneles apilados, que es una página larga
   pero correcta. Por eso los `hidden` los pone él y no el HTML.

   Tres cosas que no son adorno:
   · Se para al pasar el ratón o al entrar el foco. Una lista que salta mientras
     alguien la lee es una lista que nadie lee.
   · Se para cuando la sección no está en pantalla. Un `setTimeout` corriendo
     sobre una animación que nadie ve gasta batería en el móvil, que es donde
     se lee la mitad del sitio.
   · Con `prefers-reduced-motion` no avanza solo. Los botones siguen ahí: se
     pierde el automatismo, no el contenido.

   El riel de avance lo pinta el CSS con una animación de duración
   `--rot-dur`; aquí sólo se dice cuál es el item activo y se reinicia la
   animación quitando y devolviendo el atributo.

   Duración: `data-intervalo` en el contenedor para todas, y `data-dur` en un
   `.rotador__item` para la que necesite más —una capacidad cuya pantalla es una
   animación larga—. Las dos en milisegundos. */
(function () {
  var REDUCIDO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function montar(raiz) {
    var items   = [].slice.call(raiz.querySelectorAll('.rotador__item'));
    var paneles = [].slice.call(raiz.querySelectorAll('.rotador__vista > .scene'));
    if (items.length < 2 || items.length !== paneles.length) return;

    /* Una capacidad cuenta su gesto una vez, no en bucle — puesto aquí y no en
       CSS a propósito: sin este script no hay `hidden` que alternar (las
       cuatro capacidades se ven abiertas y apiladas) y capar ahí la vuelta a
       una sola las dejaría corriendo una vez y quietas para siempre en vez
       del bucle de toda la vida, que es el estado seguro sin JS. Con el
       script montado, cae por herencia sobre cualquier `.scene` de dentro. */
    raiz.style.setProperty('--iter', '1');

    var espera = parseInt(raiz.getAttribute('data-intervalo'), 10) || 7000;

    /* CADA CAPACIDAD PUEDE DURAR LO SUYO (`data-dur`, en ms, en el item).
       El intervalo común vale mientras las pantallas cuenten lo mismo en el
       mismo tiempo, y dejó de valer en cuanto una de ellas fue una animación de
       tres actos: el montaje de la plantilla dura 21 s y el rotador la cortaba
       a los 7, así que de los tres caminos que promete el rótulo se veía uno.
       Alargar el intervalo de todas habría dejado las otras tres —que se
       resuelven en menos de siete segundos— paradas y esperando.
       El riel de avance se pinta con la duración del item activo, no con una
       del contenedor: si no, la barra llega al final y la capacidad sigue ahí,
       que es peor que no tener barra. */
    function duracion(i) {
      var d = parseInt(items[i].getAttribute('data-dur'), 10);
      return d > 0 ? d : espera;
    }

    /* Un temporizador de «terminado» por panel, aparte del que avanza de
       capacidad (`reloj`, más abajo): una cosa es CUÁNDO SE PASA a la
       siguiente capacidad y otra CUÁNDO SE DA POR ACABADA la que se ve — la
       segunda no se para al pasar el ratón, la primera sí (`pausar`, más
       abajo). Sin este segundo reloj, una capacidad vista más tiempo del que
       dura su gesto —parado el avance con el ratón encima— se quedaría
       corriendo en bucle otra vez, que es justo lo que el acordeón no tiene
       que hacer. */
    var finReloj = new Array(items.length).fill(null);

    var actual = 0, reloj = null, visible = true, quieto = false;

    function activar(i, porClic) {
      actual = i;
      items.forEach(function (it, j) {
        var btn = it.querySelector('.rotador__btn');
        var cuerpo = it.querySelector('.rotador__cuerpo');
        var on = j === i;
        it.removeAttribute('data-activo');       // reinicia el riel
        if (btn) btn.setAttribute('aria-selected', on ? 'true' : 'false');
        if (btn) btn.tabIndex = on ? 0 : -1;
        if (cuerpo) cuerpo.hidden = !on;
        paneles[j].hidden = !on;
        if (on) {
          it.style.setProperty('--rot-dur', (duracion(j) / 1000) + 's');
          void it.offsetWidth; it.setAttribute('data-activo', 'true');

          /* La capacidad vuelve a contarse desde el principio: se quita el
             «terminado» de la vez anterior, se reinician a 0 los fotogramas
             de dentro —si no, un panel ya visto retomaría donde se quedó, no
             empezaría de cero— y se programa cuándo se da por resuelta, en
             el mismo instante en que su propio reloj (`data-dur`) se cumple. */
          clearTimeout(finReloj[j]);
          paneles[j].removeAttribute('data-terminado');
          if (paneles[j].getAnimations) {
            paneles[j].getAnimations({ subtree: true }).forEach(function (a) { a.currentTime = 0; });
          }
          finReloj[j] = setTimeout(function () {
            paneles[j].setAttribute('data-terminado', 'true');
          }, duracion(j));
        } else {
          clearTimeout(finReloj[j]);
        }
      });
      if (porClic) programar();
    }

    function programar() {
      clearTimeout(reloj);
      if (REDUCIDO || !visible || quieto) return;
      reloj = setTimeout(function () { activar((actual + 1) % items.length); programar(); }, duracion(actual));
    }

    function pausar(v) {
      quieto = v;
      raiz.setAttribute('data-pausa', v ? 'true' : 'false');
      if (v) clearTimeout(reloj); else programar();
    }

    items.forEach(function (it, i) {
      var btn = it.querySelector('.rotador__btn');
      if (!btn) return;
      btn.addEventListener('click', function () { activar(i, true); });
      btn.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
              : e.key === 'ArrowUp'   || e.key === 'ArrowLeft'  ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (i + d + items.length) % items.length;
        activar(n, true);
        items[n].querySelector('.rotador__btn').focus();
      });
    });

    raiz.addEventListener('mouseenter', function () { pausar(true); });
    raiz.addEventListener('mouseleave', function () { pausar(false); });
    raiz.addEventListener('focusin',    function () { pausar(true); });
    raiz.addEventListener('focusout',   function (e) {
      if (!raiz.contains(e.relatedTarget)) pausar(false);
    });

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entradas) {
        var antes = visible;
        visible = entradas[0].isIntersecting;
        if (visible) {
          programar();
          // Se ha perdido de vista y se ha vuelto a encontrar: la capacidad
          // activa se cuenta otra vez desde el principio, no desde donde se
          // quedó. `activar` ya limpia su propio reloj de «terminado» y
          // reinicia los fotogramas, así que basta con volver a llamarla.
          if (!antes) activar(actual);
        } else {
          clearTimeout(reloj);
        }
      }, { threshold: 0.25 }).observe(raiz);
    }

    activar(0);
    programar();
  }

  function arrancar() {
    [].slice.call(document.querySelectorAll('.rotador')).forEach(montar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
