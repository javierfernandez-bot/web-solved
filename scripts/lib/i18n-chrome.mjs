/* Solved · traducción de chrome.js.
   ------------------------------------------------------------------
   La nav y el pie no están en el HTML: los inyecta chrome.js con literales de
   cadena. Son, por tanto, el texto que más se repite del sitio —sale en las
   más de 700 páginas— y el único que el catálogo no veía, porque i18n-extract
   lee HTML. De ahí este módulo: saca las cadenas del JS para que entren en el
   contrato (i18n/es.json) y las vuelve a meter traducidas.

   No se parsea JavaScript: se trabaja sobre los literales de comilla simple,
   que es como está escrito el fichero entero. Si algún día chrome.js pasa a
   plantillas con acentos graves, esto hay que rehacerlo. */
import { esTraducible } from './i18n-dom.mjs';

const ATRIBUTOS = ['alt', 'aria-label', 'title', 'placeholder'];

/* Fuera comentarios: llevan apóstrofos en castellano y se colarían como
   literales a medias. */
function sinComentarios(js) {
  return js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
}

/* Los literales de comilla simple del fichero, en orden. */
function literales(js) {
  return [...sinComentarios(js).matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map((m) => m[1]);
}

/* Las cadenas traducibles de chrome.js: el texto entre etiquetas, los
   atributos que lee una persona y los que se ponen con setAttribute.

   Se mira literal a literal, no sobre la concatenación de todos: al pegarlos
   se forman parejas `>…<` que cruzan trozos de código —selectores, nombres de
   evento— y entraban en el catálogo cadenas como
   `button.nav__linkclicknav__item--open…`. Cada literal trae su HTML entero:
   lo único que parte una cadena en dos es ROOT, y ROOT va siempre dentro de un
   atributo, nunca en mitad de un texto. */
export function cadenasDeChrome(js) {
  const fuera = new Set();
  const mirar = (t) => { const s = (t || '').replace(/\s+/g, ' ').trim(); if (esTraducible(s)) fuera.add(s); };

  for (const lit of literales(js)) {
    if (!/[<>]/.test(lit)) continue;
    for (const m of lit.matchAll(/>([^<>]+)</g)) mirar(m[1]);
    for (const attr of ATRIBUTOS) {
      for (const m of lit.matchAll(new RegExp(`${attr}="([^"]*)"`, 'g'))) mirar(m[1]);
    }
  }

  // setAttribute('aria-label', 'Abrir menú') y su versión con ternario.
  const args = new RegExp(`setAttribute\\(\\s*'(?:${ATRIBUTOS.join('|')})'\\s*,([^;]*?)\\)`, 'g');
  for (const m of sinComentarios(js).matchAll(args)) {
    for (const lit of m[1].matchAll(/'((?:[^'\\\n]|\\.)*)'/g)) mirar(lit[1]);
  }

  return [...fuera];
}

/* Devuelve chrome.js con las rutas y los textos del idioma pedido.
   `rutas` es el mapa de i18n/config.mjs ya resuelto: { slugEs: slugDestino }. */
export function traducirChrome(js, { dic, rutas }) {
  // 1. Rutas. El literal NO termina donde acaba el slug —sigue con
  //    '">texto</a>'—, así que se busca por prefijo, sin la comilla de cierre.
  //    Buscarlo con la comilla es lo que dejaba la nav inglesa apuntando a
  //    /en/incidencias/, que no existe.
  for (const [slugEs, slugDestino] of Object.entries(rutas)) {
    if (!slugEs || slugEs === slugDestino) continue;
    js = js.split(`ROOT + '${slugEs}`).join(`ROOT + '${slugDestino}`);
  }

  // 2. Textos, de más largo a más corto para que uno corto no se coma un trozo
  //    de otro que lo contiene.
  /* Todo lo que se sustituye cae DENTRO de un literal de comilla simple, así
     que la traducción se escapa siempre: sin esto, «dates d'expiration» cierra
     la cadena en mitad de la nav y el fichero deja de ser JavaScript válido.
     Pasó con el francés y el italiano a la primera. */
  const escapar = (t) => t.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const escaparRegex = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const es of Object.keys(dic).sort((a, b) => b.length - a.length)) {
    const t = dic[es];
    if (!t || t === es) continue;
    const seguro = escapar(t);
    // `>texto<` con los espacios que haya alrededor: la nav escribe
    // `>Productos <svg…`, y buscando la pareja pegada se quedaba sin traducir
    // justo el primer nivel del menú.
    js = js.replace(new RegExp(`>(\\s*)${escaparRegex(es)}(\\s*)<`, 'g'), `>$1${seguro}$2<`);
    for (const attr of ATRIBUTOS) js = js.split(`${attr}="${es}"`).join(`${attr}="${seguro}"`);
    js = js.split(`'${es}'`).join(`'${seguro}'`);
  }
  return js;
}
