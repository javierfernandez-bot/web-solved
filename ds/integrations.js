/* =========================================================
   Catálogo de integraciones — buscador y filtro por tipo
   Filtra la rejilla que ya está en el HTML. No construye nada: sin JS se ve
   el catálogo entero, que es lo que importa; lo que se pierde es poder
   acotarlo.

   La búsqueda va contra `data-q`, que el generador escribe ya en minúsculas y
   sin tildes e incluye el tipo y los alias (SAP B1, Dynamics NAV, CMMS…). Aquí
   sólo hay que aplanar lo que teclea el usuario.

   El contador NO anuncia el tamaño del catálogo (decisión de negocio: no se
   publica la cifra) — sin filtro dice la frase fija del HTML. Sólo cuando hay
   una búsqueda o una categoría activa pasa a contar los resultados, que es
   información de la propia búsqueda, no del catálogo.
   ========================================================= */
(function () {
  'use strict';

  var grid = document.getElementById('intGrid');
  if (!grid) return;

  var input  = document.getElementById('intQ');
  var count  = document.getElementById('intCount');
  var vacio  = document.getElementById('intEmpty');
  var chips  = [].slice.call(document.querySelectorAll('.int-cat'));
  var items  = [].slice.call(grid.querySelectorAll('.int-item'));
  var cat    = 'all';

  function plano(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function aplicar() {
    var q = input ? plano(input.value) : '';
    var n = 0;

    items.forEach(function (li) {
      var ok = (cat === 'all' || li.dataset.cat === cat) &&
               (q === '' || li.dataset.q.indexOf(q) !== -1);
      li.hidden = !ok;
      if (ok) n++;
    });

    if (count) {
      count.textContent = (q === '' && cat === 'all')
        ? 'Se integra con todos tus sistemas'
        : (n === 1 ? '1 resultado' : n + ' resultados');
    }
    if (vacio) vacio.hidden = n !== 0;
  }

  function marcar(valor) {
    cat = valor;
    chips.forEach(function (o) {
      o.setAttribute('aria-pressed', String((o.dataset.cat || 'all') === valor));
    });
  }

  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      marcar(b.dataset.cat || 'all');
      aplicar();
    });
  });

  if (input) {
    /* Escribir busca en TODO el catálogo: si el filtro de tipo siguiera puesto,
       buscar "maximo" con MES seleccionado devolvería cero y parecería que ese
       sistema no está, cuando está en GMAO. Quien teclea un nombre quiere ese
       nombre, no ese nombre dentro de la categoría que dejó marcada. */
    input.addEventListener('input', function () {
      if (input.value.trim() !== '' && cat !== 'all') marcar('all');
      aplicar();
    });
    /* Enter en un <input type="search"> dentro de un <form> lo enviaría; aquí no
       hay formulario, pero si algún día lo hay, que no recargue la página. */
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
  }

  aplicar();
})();
