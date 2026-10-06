/* Solved · devuelve el HTML a la serialización de la casa.
   ------------------------------------------------------------------
   cheerio (parse5) reserializa: baja el doctype a mayúsculas, pega
   <html> y <head> en la primera línea, quita la barra de los elementos
   vacíos y expande los de SVG a par de etiquetas. El resultado es HTML
   válido e idéntico al renderizar, pero convierte cualquier cambio de una
   línea en un diff de cientos. Estas páginas se escriben a mano, así que
   el fuente vuelve a su forma antes de guardarse.

   Se valida con scripts/i18n-selftest.mjs: normalizar(cheerio(X)) === X. */

const VACIOS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];
const SVG_VACIOS = ['path', 'rect', 'circle', 'line', 'polyline', 'polygon', 'ellipse', 'stop', 'use', 'animate', 'animateTransform', 'feGaussianBlur', 'feOffset', 'feColorMatrix'];

/* Opciones de salida de cheerio: sin re-escapar & y con los atributos
   booleanos desnudos, que es como están escritos los fuentes. */
export const SALIDA = { xml: { xmlMode: false, decodeEntities: false, selfClosingTags: true } };

/* Serializa un documento cargado y le devuelve la forma de la casa. */
export function serializar($) {
  return normalizar($.html(SALIDA));
}

export function normalizar(html) {
  let s = html;

  // 1. Cabecera: parse5 la deja en una sola línea.
  s = s.replace(/^<!DOCTYPE html><html([^>]*)><head>/i, '<!doctype html>\n<html$1>\n<head>');

  // 2. cheerio cierra los vacíos con espacio (`<meta …  />`); aquí van pegados.
  s = s.replace(/<([a-zA-Z][^<>]*[^\s<>]) \/>/g, '<$1/>');

  // 3. Elementos de SVG sin contenido: <path …></path> → <path …/>
  for (const t of SVG_VACIOS) {
    s = s.replace(new RegExp(`<${t}(\\s[^>]*?)?></${t}>`, 'g'), (m, attrs = '') => `<${t}${attrs || ''}/>`);
  }

  // 3 ter. El espacio duro vuelve a ser entidad: un U+00A0 suelto en el
  //    fuente es un carácter invisible que nadie puede editar a conciencia.
  s = s.replace(/\u00a0/g, '&nbsp;');

  // 3 bis. Atributos vacíos: cheerio los deja desnudos (`alt`) y en el fuente
  //    van con comillas (`alt=""`), que es lo que espera cualquiera que lea
  //    una imagen decorativa.
  s = s.replace(/ (alt|title|value|content|placeholder)(?=[ >/])/g, ' $1=""');

  // 4. El cierre: parse5 pega </body></html> al final sin salto; el fuente los
  //    tiene en su propia línea y termina con salto.
  s = s.replace(/\s*<\/body><\/html>\s*$/, '\n</body>\n</html>\n');

  return s;
}
