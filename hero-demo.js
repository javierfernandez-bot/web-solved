/* Home hero — demo animada "Crear incidencia" (2 pantallas: lista → formulario).
   Añade clases de estado a #solvedDemo. Respeta prefers-reduced-motion. */
(function () {
  var demo = document.getElementById('solvedDemo');
  if (!demo) return;
  var typedEl = demo.querySelector('.demo__screen--form .demo__typed');
  var text = typedEl ? typedEl.getAttribute('data-text') : '';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ALL = ['s-press', 's-form', 's-cat', 's-desc', 's-prio', 's-evid', 's-submit', 's-send', 's-done'];

  function clearAll() {
    ALL.forEach(function (c) { demo.classList.remove(c); });
    if (typedEl) typedEl.textContent = '';
  }
  function at(ms, fn) { setTimeout(fn, ms); }
  function type(cb) {
    var i = 0;
    (function tick() {
      typedEl.textContent = text.slice(0, i); i++;
      if (i <= text.length) setTimeout(tick, 42); else setTimeout(cb, 450);
    })();
  }

  function run() {
    clearAll();
    at(1700, function () {                         // se ve la lista
      demo.classList.add('s-press');               // "toca" Crear incidencia (tap visible)
      at(620, function () {
        demo.classList.remove('s-press');
        demo.classList.add('s-form');              // desliza al formulario
        at(730, function () {
          demo.classList.add('s-cat');             // categoría
          at(650, function () {
            demo.classList.add('s-desc');          // descripción (se teclea)
            type(function () {
              demo.classList.add('s-prio');        // prioridad Alta
              at(650, function () {
                demo.classList.add('s-evid');      // evidencia (foto botella)
                at(820, function () {
                  demo.classList.add('s-submit');  // aparece botón enviar
                  at(680, function () {
                    demo.classList.add('s-send');  // "pulsa" enviar
                    at(260, function () {
                      demo.classList.add('s-done'); // éxito
                      at(2200, function () { at(650, run); });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  if (reduce) {                                    // estático: formulario relleno
    if (typedEl) typedEl.textContent = text;
    ['s-form', 's-cat', 's-desc', 's-prio', 's-evid', 's-submit'].forEach(function (c) { demo.classList.add(c); });
    return;
  }
  run();
})();
