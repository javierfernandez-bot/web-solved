#!/usr/bin/env node
/* Solved · extrae el catálogo de cadenas de las páginas comerciales.
   ------------------------------------------------------------------
   Salida: i18n/es.json — la lista de cadenas españolas únicas, con las
   páginas donde sale cada una. Es el contrato: las claves de en/fr/it/de.json
   son exactamente estas cadenas.

   Uso:  npm run i18n:extract
   Al ejecutarlo se refresca también el informe de cobertura de cada idioma. */

import { load } from 'cheerio';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extraer } from './lib/i18n-dom.mjs';
import { cadenasDeChrome } from './lib/i18n-chrome.mjs';
import { cargarCatalogo } from './lib/i18n-catalogo.mjs';
import { PAGINAS_CATALOGO, TARGETS } from '../i18n/config.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const catalogo = new Map(); // cadena -> Set(rutas)

const anotar = (cadena, ruta) => {
  if (!catalogo.has(cadena)) catalogo.set(cadena, new Set());
  catalogo.get(cadena).add(ruta);
};

for (const { archivo, ruta } of PAGINAS_CATALOGO) {
  const abs = path.join(RAIZ, archivo);
  if (!existsSync(abs)) { console.warn(`  · falta ${archivo}`); continue; }
  const $ = load(readFileSync(abs, 'utf8'), { decodeEntities: false });
  for (const cadena of extraer($)) anotar(cadena, ruta);
}

/* La nav, el pie y el aviso de cookies no están en ningún HTML: los escribe
   chrome.js. Es el texto que más se repite del sitio —sale en las más de 700
   páginas— y hasta septiembre de 2026 se quedaba fuera del catálogo, así que
   la nav traducida salía a medias en castellano. */
for (const cadena of cadenasDeChrome(readFileSync(path.join(RAIZ, 'chrome.js'), 'utf8'))) {
  anotar(cadena, 'chrome.js');
}

// Orden estable: por primera aparición en el orden de PAGINAS_CATALOGO, y
// dentro de eso alfabético. Así el diff de un cambio de copy es legible.
const cadenas = [...catalogo.keys()];
const salida = {
  generado: new Date().toISOString().slice(0, 10),
  total: cadenas.length,
  cadenas: cadenas.map((c) => ({ es: c, en: [...catalogo.get(c)] })),
};
writeFileSync(path.join(RAIZ, 'i18n/es.json'), JSON.stringify(salida, null, 2) + '\n');
console.log(`i18n/es.json · ${cadenas.length} cadenas únicas de ${PAGINAS_CATALOGO.length} páginas`);

// Cobertura por idioma
const { porIdioma } = cargarCatalogo(RAIZ);
for (const lang of TARGETS) {
  const dic = porIdioma[lang] || {};
  const faltan = cadenas.filter((c) => !dic[c]);
  const sobran = Object.keys(dic).filter((c) => !catalogo.has(c));
  console.log(`  ${lang}: ${cadenas.length - faltan.length}/${cadenas.length} traducidas` +
    (faltan.length ? ` · faltan ${faltan.length}` : '') +
    // «Fuera de» y no «obsoletas»: el blog y el glosario tiran del mismo
    // catálogo (translate-contenido.mjs), y ahí sí se usan marcas como Excel o
    // SharePoint que no salen en ninguna de las 22 páginas comerciales.
    (sobran.length ? ` · ${sobran.length} fuera de las páginas comerciales` : ''));
  if (process.argv.includes('--faltan') && faltan.length) {
    writeFileSync(path.join(RAIZ, `i18n/_faltan-${lang}.json`),
      JSON.stringify(Object.fromEntries(faltan.map((c) => [c, ''])), null, 2) + '\n');
    console.log(`     → i18n/_faltan-${lang}.json`);
  }
}
