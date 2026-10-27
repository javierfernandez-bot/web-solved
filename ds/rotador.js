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
   animación larga—. Las dos en milisegundos.

   EN MÓVIL ES UN CARRUSEL, NO UN ACORDEÓN (27 oct 2026). La causa fue un panel
   que no se pintaba en un iPhone real —no reproducible desde aquí, ver el
   comentario de `ds/sections.css`—, y la salida fue cambiar el patrón: los
   cuatro paneles van en fila (ese CSS) y aquí sólo cambia QUÉ CONTROLA que uno
   esté «activo» — en escritorio lo decide el reloj o un clic; en el carrusel,
   qué panel queda centrado tras deslizar. El resto —el riel por `--rot-dur`,
   el reloj de «terminado» por `data-dur», el pausar fuera de pantalla— es el
   mismo mecanismo en los dos modos, factorizado en `marcar()`/`contar()` para
   no mantenerlo duplicado. */
(function () {
  var REDUCIDO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MQ_CARRUSEL = window.matchMedia && window.matchMedia('(max-width:900px)');

  function montar(raiz) {
    var items   = [].slice.call(raiz.querySelectorAll('.rotador__item'));
    var vista   = raiz.querySelector('.rotador__vista');
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

    function duracion(i) {
      var d = parseInt(items[i].getAttribute('data-dur'), 10);
      return d > 0 ? d : espera;
    }

    var finReloj = new Array(items.length).fill(null);
    var actual = 0, reloj = null, visible = true, quieto = false, carrusel = false;

    /* Marca qué capacidad está activa en la lista —rótulo, cuerpo desplegado,
       riel— y arranca su panel. En escritorio esto también oculta el resto de
       paneles; en el carrusel no se oculta ninguno —viven todos en fila, es
       el scroll quien decide cuál se ve—, así que ese `hidden` sólo se toca
       fuera de modo carrusel. */
    function marcar(i) {
      actual = i;
      items.forEach(function (it, j) {
        var btn = it.querySelector('.rotador__btn');
        var cuerpo = it.querySelector('.rotador__cuerpo');
        var on = j === i;
        it.removeAttribute('data-activo');       // reinicia el riel
        if (btn) btn.setAttribute('aria-selected', on ? 'true' : 'false');
        if (btn) btn.tabIndex = on ? 0 : -1;
        if (cuerpo) cuerpo.hidden = !on;
        if (!carrusel) paneles[j].hidden = !on;
        if (on) {
          it.style.setProperty('--rot-dur', (duracion(j) / 1000) + 's');
          void it.offsetWidth; it.setAttribute('data-activo', 'true');
        }
      });
    }

    /* La capacidad vuelve a contarse desde el principio: se quita el
       «terminado» de la vez anterior, se reinician a 0 los fotogramas de
       dentro —si no, un panel ya visto retomaría donde se quedó— y se
       programa cuándo se da por resuelta, en el mismo instante en que su
       propio reloj (`data-dur`) se cumple. */
    function contar(i) {
      var panel = paneles[i];
      clearTimeout(finReloj[i]);
      panel.removeAttribute('data-terminado');
      if (panel.getAnimations) {
        panel.getAnimations({ subtree: true }).forEach(function (a) { a.currentTime = 0; });
      }
      finReloj[i] = setTimeout(function () {
        panel.setAttribute('data-terminado', 'true');
      }, duracion(i));
    }

    function activar(i, porClic) {
      marcar(i);
      contar(i);
      if (porClic) programar();
    }

    function programar() {
      clearTimeout(reloj);
      // El carrusel no avanza solo: lo mueve el dedo, no un reloj.
      if (carrusel || REDUCIDO || !visible || quieto) return;
      reloj = setTimeout(function () { activar((actual + 1) % items.length); programar(); }, duracion(actual));
    }

    function pausar(v) {
      quieto = v;
      raiz.setAttribute('data-pausa', v ? 'true' : 'false');
      if (v) clearTimeout(reloj); else programar();
    }

    // Clic en la lista o flechas de teclado: en escritorio activa la
    // capacidad; en el carrusel desliza su panel al centro, y es el propio
    // scroll —más abajo— quien la marca activa al llegar.
    function irA(i) {
      if (carrusel) paneles[i].scrollIntoView({ behavior: REDUCIDO ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      else activar(i, true);
    }

    items.forEach(function (it, i) {
      var btn = it.querySelector('.rotador__btn');
      if (!btn) return;
      btn.addEventListener('click', function () { irA(i); });
      btn.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
              : e.key === 'ArrowUp'   || e.key === 'ArrowLeft'  ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (i + d + items.length) % items.length;
        irA(n);
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
        // El carrusel no tiene avance automático que parar al salir de
        // pantalla; el pausado de cada panel ya lo hace ds/scene.js por su
        // cuenta (su propio IntersectionObserver, por panel).
        if (carrusel) return;
        if (visible) {
          programar();
          // Se ha perdido de vista y se ha vuelto a encontrar: la capacidad
          // activa se cuenta otra vez desde el principio, no desde donde se
          // quedó.
          if (!antes) activar(actual);
        } else {
          clearTimeout(reloj);
        }
      }, { threshold: 0.25 }).observe(raiz);
    }

    /* EL CARRUSEL: los cuatro paneles van en fila dentro de `.rotador__vista`
       (ds/sections.css, @media max-width:900px) — ninguno se oculta, es la
       posición de scroll quien decide cuál se ve. Qué panel está centrado lo
       dice este observer, con `root` en la propia vista —no en el viewport,
       que no sabe de su scroll horizontal—: al cruzar el 60% de un panel, su
       capacidad se marca activa en la lista y su gesto arranca, igual que al
       elegirla a mano. */
    var obsCarrusel = null;
    function entrarCarrusel() {
      if (carrusel) return;
      carrusel = true;
      clearTimeout(reloj);
      paneles.forEach(function (p) { p.hidden = false; });
      obsCarrusel = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i = paneles.indexOf(e.target);
          if (i !== -1 && i !== actual) { marcar(i); contar(i); }
        });
      }, { root: vista, threshold: 0.6 });
      paneles.forEach(function (p) { obsCarrusel.observe(p); });
      marcar(actual);
      contar(actual);
    }
    function salirCarrusel() {
      if (!carrusel) return;
      carrusel = false;
      if (obsCarrusel) { obsCarrusel.disconnect(); obsCarrusel = null; }
      activar(actual);
      programar();
    }

    if (MQ_CARRUSEL) {
      if (MQ_CARRUSEL.matches) {
        entrarCarrusel();
      } else {
        marcar(0); contar(0); programar();
      }
      // Cruzar el punto de corte en caliente —una tablet que gira, una
      // ventana que se redimensiona en pruebas— cambia de modo sin recargar.
      var alCambiar = function () { if (MQ_CARRUSEL.matches) entrarCarrusel(); else salirCarrusel(); };
      if (MQ_CARRUSEL.addEventListener) MQ_CARRUSEL.addEventListener('change', alCambiar);
      else if (MQ_CARRUSEL.addListener) MQ_CARRUSEL.addListener(alCambiar); // Safari antiguo
    } else {
      marcar(0); contar(0); programar();
    }
  }

  function arrancar() {
    [].slice.call(document.querySelectorAll('.rotador')).forEach(montar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
