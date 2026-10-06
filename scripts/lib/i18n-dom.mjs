/* Solved · recorrido común de cadenas traducibles.
   ------------------------------------------------------------------
   Un solo recorrido para extraer (scripts/i18n-extract.mjs) y para inyectar
   (scripts/build-i18n.mjs). Si los dos no recorrieran EXACTAMENTE lo mismo,
   el catálogo tendría claves que no se usan y páginas con cadenas sin
   traducir, así que vive aquí y no duplicado en cada script. */

/* Clases cuyo contenido es el NOMBRE del icono, no texto: la fuente Material
   Symbols usa ligaduras, así que <span class="ms">bar_chart</span> pinta un
   gráfico. Traducirlo deja la palabra escrita en crudo en mitad de la pantalla.
   `.ms` la define assets/tour/incidencias-tour.css; `.material-symbols-outlined`,
   solved.css. */
const CLASES_ICONO = /(^|\s)(ms|material-symbols(-outlined)?)(\s|$)/;

// Nada de lo que hay dentro de estas etiquetas es texto de la página.
// `title` está aquí porque el paso 1 ya lo visita por su cuenta: sin esta línea
// el recorrido de nodos de texto lo visitaba una segunda vez y, al inyectar, esa
// segunda visita veía el título YA traducido y lo contaba como cadena que falta
// —una por página, 22 fantasmas que tapaban las que faltaran de verdad—.
const ETIQUETAS_OPACAS = new Set(['script', 'style', 'noscript', 'svg', 'code', 'pre', 'template', 'title']);

// Atributos visibles para la persona o para el lector de pantalla.
const ATRIBUTOS = ['alt', 'title', 'placeholder', 'aria-label', 'aria-description', 'aria-placeholder'];

// <meta> cuyo content es copy. El resto (theme-color, robots, viewport…) no.
const METAS = [
  ['name', 'description'],
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['property', 'og:image:alt'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['name', 'twitter:image:alt'],
];

// Claves de JSON-LD cuyo valor es prosa. Las demás (@type, url, item…) son
// datos o URLs: las URLs las reescribe build-i18n, no el traductor.
const CLAVES_JSONLD = new Set(['name', 'description', 'text', 'headline', 'alternateName', 'articleBody', 'caption', 'jobTitle']);

// Cadenas que se dejan igual en todos los idiomas: marca, siglas de norma,
// nombres propios y todo lo que no lleve una sola letra.
const INTRADUCIBLES = new Set([
  'Solved', 'HubSpot', 'LinkedIn', 'YouTube', 'WhatsApp', 'Excel', 'SAP', 'ERP', 'GMAO', 'MES',
  'IFS', 'BRC', 'APPCC', 'HACCP', 'ISO', 'ISO 9001', 'ISO 22000', 'ISO 14001', 'FSSC 22000',
  'KPI', 'KPIs', 'QR', 'PDF', 'CSV', 'API', 'AI POWERED', 'Lanzadera',
]);

export function esTraducible(texto) {
  const t = (texto || '').trim();
  if (!t) return false;
  if (INTRADUCIBLES.has(t)) return false;
  if (!/\p{L}/u.test(t)) return false;              // sin letras: cifras, símbolos
  if ([...t].length < 2) return false;              // inicial de avatar, viñeta
  if (/^[A-Z0-9]+([_-][A-Z0-9]+)+$/.test(t)) return false; // códigos: UTD26_164_PAR
  if (/^[\d\s.,:%€+\-–—/]+$/.test(t)) return false; // «2.000», «−70 %», «24/7»
  return true;
}

function dentroDeOpaca($, nodo) {
  for (let p = nodo.parent; p; p = p.parent) {
    if (p.name && ETIQUETAS_OPACAS.has(p.name)) return true;
    if (p.attribs && (p.attribs.translate === 'no' || p.attribs['data-i18n'] === 'skip')) return true;
    // Los iconos de Material Symbols son ligaduras: el texto ES el nombre del
    // icono ("bar_chart"). Traducirlo deja un hueco en blanco en la pantalla.
    if (p.attribs && CLASES_ICONO.test(p.attribs.class || '')) return true;
  }
  return false;
}

/* Recorre el documento y llama a `visita(texto, aplicar)` por cada cadena.
   `aplicar(nuevo)` escribe la traducción en el sitio exacto del que salió, así
   que el llamador puede extraer (ignorando `aplicar`) o traducir. */
export function recorrer($, visita) {
  const ver = (texto, aplicar) => {
    if (!esTraducible(texto)) return;
    visita(texto.replace(/\s+/g, ' ').trim(), aplicar);
  };

  // 1. <title>
  const $title = $('head > title');
  if ($title.length) ver($title.text(), (v) => $title.text(v));

  // 2. <meta> de copy
  for (const [attr, valor] of METAS) {
    $(`meta[${attr}="${valor}"]`).each((_, el) => {
      const $el = $(el);
      ver($el.attr('content'), (v) => $el.attr('content', v));
    });
  }

  // 3. Nodos de texto del cuerpo
  $('*').contents().each((_, nodo) => {
    if (nodo.type !== 'text') return;
    if (dentroDeOpaca($, nodo)) return;
    const bruto = nodo.data || '';
    if (!esTraducible(bruto)) return;
    // Se conservan los espacios de los extremos: quitarlos pega palabras
    // cuando el texto convive con <b> o <a> dentro del mismo párrafo.
    const izq = bruto.match(/^\s*/)[0];
    const der = bruto.match(/\s*$/)[0];
    ver(bruto, (v) => { nodo.data = izq + v + der; });
  });

  // 4. Atributos visibles
  $(`[${ATRIBUTOS.join('],[')}]`).each((_, el) => {
    const $el = $(el);
    for (const attr of ATRIBUTOS) {
      const v = $el.attr(attr);
      if (v !== undefined) ver(v, (nuevo) => $el.attr(attr, nuevo));
    }
  });

  // 5. value de botones y campos (no el de los <option> ocultos ni inputs
  //    técnicos: sólo donde el valor se ve).
  $('input[type="submit"],input[type="button"],button[value],option').each((_, el) => {
    const $el = $(el);
    const v = $el.attr('value');
    if (v !== undefined) ver(v, (nuevo) => $el.attr('value', nuevo));
  });

  // 6. JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    const $el = $(el);
    let datos;
    try { datos = JSON.parse($el.text()); } catch { return; }
    let tocado = false;
    const paseo = (obj) => {
      if (Array.isArray(obj)) return obj.forEach(paseo);
      if (!obj || typeof obj !== 'object') return;
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string' && CLAVES_JSONLD.has(k)) {
          ver(v, (nuevo) => { obj[k] = nuevo; tocado = true; });
        } else if (typeof v === 'object') paseo(v);
      }
    };
    paseo(datos);
    if (tocado) $el.text(JSON.stringify(datos));
  });
}

/* Igual que `recorrer`, pero sólo devuelve las cadenas. */
export function extraer($) {
  const fuera = [];
  recorrer($, (texto) => fuera.push(texto));
  return fuera;
}

export { CLAVES_JSONLD, INTRADUCIBLES };
