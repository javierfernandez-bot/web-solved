#!/usr/bin/env node
/* Solved · genera /en/, /fr/, /it/, /de/ y /pt/ desde el sitio español.
   ------------------------------------------------------------------
   REGLA: los HTML traducidos son artefactos. No se editan a mano — se pierde
   el cambio en el siguiente build. Para cambiar copy en otro idioma se toca
   i18n/traducciones/*.json; para cambiar estructura, el HTML español.

   Qué hace con cada página:
     · sustituye cada cadena por su traducción (catálogo compartido)
     · <html lang>, og:locale y el canónico del idioma
     · reescribe los enlaces internos al slug traducido (i18n/config.mjs)
     · pone hreflang recíproco en los cinco idiomas + x-default al español
     · apunta a /<lang>/chrome.js, que se genera aquí mismo con la nav traducida

   Uso:  npm run build:i18n            (todos los idiomas)
         npm run build:i18n -- en fr   (sólo esos)
         npm run build:i18n -- --solo-es  (sólo reinyecta hreflang en español) */

import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recorrer } from './lib/i18n-dom.mjs';
import { cargarCatalogo } from './lib/i18n-catalogo.mjs';
import { LANGS, TARGETS, RUTAS, PAGINAS_CATALOGO, SOURCE, traducirRuta } from '../i18n/config.mjs';
import { reescribirEnlace, alternos as alternosDe } from './lib/i18n-rutas.mjs';
import { traducirChrome } from './lib/i18n-chrome.mjs';
import { config } from './config.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = (config.SITE_URL || 'https://trysolved.com').replace(/\/$/, '');

const args = process.argv.slice(2);
const soloEs = args.includes('--solo-es');
const idiomas = args.filter((a) => TARGETS.includes(a));
const objetivo = soloEs ? [] : (idiomas.length ? idiomas : TARGETS);

const { porIdioma } = cargarCatalogo(RAIZ);

function urlAbsoluta(ruta) { return SITIO + ruta; }

/* Enlaces alternos de una ruta española: los cinco idiomas + x-default.
   El cálculo vive en lib/i18n-rutas.mjs porque el build del contenido pone los
   suyos con la misma regla. */
const alternos = (rutaEs) => alternosDe(rutaEs, SITIO, TARGETS);

function ponerAlternos($, rutaEs) {
  $('link[rel="alternate"][hreflang]').remove();
  const marca = alternos(rutaEs)
    .map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
    .join('\n');
  const canonical = $('link[rel="canonical"]');
  if (canonical.length) canonical.after('\n' + marca);
  else $('head').append('\n' + marca + '\n');
}

function traducirPagina(htmlEs, { rutaEs, lang, noIndexar }) {
  const $ = load(htmlEs, { decodeEntities: false });
  const dic = porIdioma[lang] || {};
  let vistas = 0, faltan = 0;

  recorrer($, (texto, aplicar) => {
    vistas++;
    const t = dic[texto];
    if (t) aplicar(t); else faltan++;
  });

  const L = LANGS[lang];
  const rutaDestino = traducirRuta(rutaEs, lang) || (L.prefijo + rutaEs);

  $('html').attr('lang', L.htmlLang);
  $('meta[property="og:locale"]').attr('content', L.ogLocale);
  $('link[rel="canonical"]').attr('href', urlAbsoluta(rutaDestino));
  $('meta[property="og:url"]').attr('content', urlAbsoluta(rutaDestino));
  ponerAlternos($, rutaEs);

  for (const attr of ['href', 'src']) {
    $(`[${attr}^="/"]`).each((_, el) => {
      const $el = $(el);
      $el.attr(attr, reescribirEnlace($el.attr(attr), lang));
    });
  }

  // JSON-LD: las URLs también cambian de idioma.
  $('script[type="application/ld+json"]').each((_, el) => {
    const $el = $(el);
    let datos;
    try { datos = JSON.parse($el.text()); } catch { return; }
    const paseo = (o) => {
      if (Array.isArray(o)) return o.forEach(paseo);
      if (!o || typeof o !== 'object') return;
      for (const [k, v] of Object.entries(o)) {
        if (typeof v === 'string' && (k === 'url' || k === 'item') && v.startsWith(SITIO)) {
          const ruta = v.slice(SITIO.length) || '/';
          o[k] = urlAbsoluta(reescribirEnlace(ruta, lang));
        } else if (typeof v === 'object') paseo(v);
      }
    };
    paseo(datos);
    $el.text(JSON.stringify(datos));
  });

  if (noIndexar) $('meta[name="robots"]').attr('content', 'noindex, follow');

  return { html: $.html(), vistas, faltan, rutaDestino };
}

/* ---- chrome.js por idioma -------------------------------------------------
   La nav y el pie se inyectan desde chrome.js, así que cada idioma necesita el
   suyo: mismas funciones, textos traducidos y rutas del idioma. La sustitución
   vive en lib/i18n-chrome.mjs, que es también de donde i18n-extract saca estas
   cadenas para el catálogo. Aquí sólo se prepara el mapa de rutas y se pega el
   selector de idioma. */
function generarChrome(lang) {
  let js = readFileSync(path.join(RAIZ, 'chrome.js'), 'utf8');

  // El español ya lleva su selector pegado (paso 2). Se quita antes de generar
  // el del idioma, o cada fichero acaba con dos.
  js = js.split('/* ====== Selector de idioma ======')[0].replace(/\s+$/, '');

  // Assets a la raíz: ROOT vale /<lang>/ y ahí no hay carpeta assets.
  js = js.replace(/ROOT \+ 'assets\//g, "'/assets/");

  const rutas = {};
  for (const [rutaEs, mapa] of Object.entries(RUTAS)) {
    if (rutaEs === '/' || !mapa[lang]) continue;
    rutas[rutaEs.replace(/^\//, '')] = mapa[lang].replace(/^\//, '');
  }

  js = traducirChrome(js, { dic: porIdioma[lang] || {}, rutas });
  return js + '\n\n' + selectorIdioma(lang) + '\n';
}

function selectorIdioma(lang) {
  const nombres = JSON.stringify(
    Object.fromEntries(Object.entries(LANGS).map(([k, v]) => [v.htmlLang, v.nombre]))
  );
  return `/* ====== Selector de idioma ======
   Se construye con los <link rel="alternate" hreflang> que ya lleva la página,
   así que apunta siempre a la traducción exacta de ESTA página y no a la home
   del idioma, que es el error clásico y el que hace que Google trate las
   versiones como duplicados sueltos. */
(function () {
  var NOMBRES = ${nombres};

/* El resto de chrome.js pinta la nav en DOMContentLoaded, así que esto tiene
   que esperar igual: montado a la primera no encontraba .nav__links y salía sin
   hacer nada, que es como el selector estuvo invisible en los cinco idiomas. */
function montarSelector() {
  var actual = document.documentElement.lang || 'es';
  var alt = [].slice.call(document.querySelectorAll('link[rel="alternate"][hreflang]'))
    .filter(function (l) { return l.hreflang !== 'x-default' && NOMBRES[l.hreflang]; });
  if (alt.length < 2) return;

  var nav = document.querySelector('.nav__links');
  if (!nav) return;

  var li = document.createElement('li');
  li.className = 'nav__item nav__item--lang';
  var opciones = alt.map(function (l) {
    var activo = l.hreflang === actual ? ' aria-current="true"' : '';
    // Sólo la ruta: los hreflang son absolutos contra trysolved.com —tienen que
    // serlo— y usarlos tal cual sacaba del sitio a quien mirase la web en local
    // o en la página de github.io. Es la misma razón por la que chrome.js
    // deriva ROOT en vez de escribir el dominio.
    var ruta = l.href;
    try { ruta = new URL(l.href, location.href).pathname; } catch (e) {}
    return '<a href="' + ruta + '" lang="' + l.hreflang + '"' + activo + '>' +
           NOMBRES[l.hreflang] + '</a>';
  }).join('');
  li.innerHTML =
    '<button class="nav__link" type="button" aria-label="' + NOMBRES[actual] + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
        '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/>' +
      '</svg> ' + actual.toUpperCase() +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>' +
    '</button>' +
    '<div class="nav__menu nav__menu--lang">' + opciones + '</div>';

  var cta = nav.querySelector('.nav__cta-mobile');
  if (cta) nav.insertBefore(li, cta); else nav.appendChild(li);
}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montarSelector);
  else montarSelector();
})();`;
}

// ---------------------------------------------------------------- ejecución
let totalFaltan = 0;

// 1. El español también necesita los hreflang (si no, la reciprocidad no
//    existe y Google descarta el grupo entero).
for (const { archivo, ruta } of PAGINAS_CATALOGO) {
  const abs = path.join(RAIZ, archivo);
  if (!existsSync(abs)) continue;
  const $ = load(readFileSync(abs, 'utf8'), { decodeEntities: false });
  ponerAlternos($, ruta);
  writeFileSync(abs, $.html());
}
console.log(`es · hreflang en ${PAGINAS_CATALOGO.length} páginas`);

// 2. El selector de idioma en el chrome.js español.
{
  const base = readFileSync(path.join(RAIZ, 'chrome.js'), 'utf8');
  const limpio = base.split('/* ====== Selector de idioma ======')[0].replace(/\s+$/, '');
  writeFileSync(path.join(RAIZ, 'chrome.js'), limpio + '\n\n' + selectorIdioma('es') + '\n');
}

// 3. Cada idioma.
for (const lang of objetivo) {
  let faltanLang = 0, paginas = 0;
  for (const { archivo, ruta, noIndexar } of PAGINAS_CATALOGO) {
    const abs = path.join(RAIZ, archivo);
    if (!existsSync(abs)) continue;
    const { html, faltan, rutaDestino } = traducirPagina(readFileSync(abs, 'utf8'), { rutaEs: ruta, lang, noIndexar });
    const salida = rutaDestino.endsWith('.html')
      ? path.join(RAIZ, rutaDestino.replace(/^\//, ''))
      : path.join(RAIZ, rutaDestino.replace(/^\//, ''), 'index.html');
    mkdirSync(path.dirname(salida), { recursive: true });
    writeFileSync(salida, html);
    faltanLang += faltan; paginas++;
  }
  writeFileSync(path.join(RAIZ, LANGS[lang].prefijo.replace(/^\//, ''), 'chrome.js'), generarChrome(lang));
  totalFaltan += faltanLang;
  console.log(`${lang} · ${paginas} páginas` + (faltanLang ? ` · ${faltanLang} cadenas sin traducir` : ' · completo'));
}

if (totalFaltan) {
  console.log(`\nQuedan cadenas sin traducir: se emiten en español. npm run i18n:extract -- --faltan`);
}
