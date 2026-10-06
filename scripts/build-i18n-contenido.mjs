#!/usr/bin/env node
/* Solved · genera el blog y el glosario en /en/, /fr/, /it/, /de/ y /pt/.
   ------------------------------------------------------------------
   Hermano de build-i18n.mjs, que hace las 22 páginas comerciales. Se separan
   porque el material es distinto: allí el copy está traducido a mano, cadena a
   cadena, en i18n/traducciones/*.json; aquí son 100 páginas y unas 200.000
   palabras que traduce translate-contenido.mjs y deja en i18n/cache/<lang>.json.
   El catálogo escrito a mano SIEMPRE manda sobre la caché: la nav, el pie y los
   términos de marca salen en las cien páginas y tienen que decir lo mismo que
   en la home.

   REGLA, la misma que arriba: los HTML traducidos son artefactos. No se editan
   a mano. Se toca el español —o la traducción— y se vuelve a construir.

   Uso:  npm run build:i18n:contenido            (todos los idiomas)
         npm run build:i18n:contenido -- en fr   (sólo esos)  */

import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recorrer } from './lib/i18n-dom.mjs';
import { cargarCatalogo } from './lib/i18n-catalogo.mjs';
import { aAbsoluta, alternos, paginasContenido, reescribirEnlace, rutaContenido } from './lib/i18n-rutas.mjs';
import { LANGS, TARGETS } from '../i18n/config.mjs';
import { config } from './config.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = (config.SITE_URL || 'https://trysolved.com').replace(/\/$/, '');

const args = process.argv.slice(2);
const pedidos = args.filter((a) => TARGETS.includes(a));
const objetivo = pedidos.length ? pedidos : TARGETS;

const { porIdioma } = cargarCatalogo(RAIZ);

/* Diccionario de un idioma: la caché del contenido debajo, el catálogo escrito
   a mano encima. */
function diccionario(lang) {
  const f = path.join(RAIZ, `i18n/cache/${lang}.json`);
  const cache = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
  return { ...cache, ...(porIdioma[lang] || {}) };
}

/* La ruta del sitio de una página: 'blog/x/index.html' → '/blog/x/'. */
function rutaDe(rel) {
  const r = '/' + rel.replace(/index\.html$/, '');
  return r.endsWith('/') ? r : r + '/';
}

function ponerAlternos($, rutaEs) {
  $('link[rel="alternate"][hreflang]').remove();
  const marca = alternos(rutaEs, SITIO, TARGETS)
    .map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
    .join('\n');
  const canonical = $('link[rel="canonical"]');
  if (canonical.length) canonical.after('\n' + marca);
  else $('head').append('\n' + marca + '\n');
}

function traducirPagina(htmlEs, { rutaEs, dirEs, lang, dic }) {
  const $ = load(htmlEs, { decodeEntities: false });
  let vistas = 0, faltan = 0;

  recorrer($, (texto, aplicar) => {
    vistas++;
    const t = dic[texto];
    if (t) aplicar(t); else faltan++;
  });

  const L = LANGS[lang];
  const rutaDestino = rutaContenido(rutaEs, lang) || (L.prefijo + rutaEs);

  $('html').attr('lang', L.htmlLang);
  $('meta[property="og:locale"]').attr('content', L.ogLocale);
  $('link[rel="canonical"]').attr('href', SITIO + rutaDestino);
  $('meta[property="og:url"]').attr('content', SITIO + rutaDestino);
  ponerAlternos($, rutaEs);

  /* Enlaces y recursos. El blog y el glosario los escriben relativos, y la
     página traducida cuelga de una carpeta más honda, así que primero se
     resuelven contra la carpeta española y luego se traducen. */
  for (const attr of ['href', 'src']) {
    $(`[${attr}]`).each((_, el) => {
      const $el = $(el);
      const v = $el.attr(attr);
      if (!v || /^(https?:|\/\/|#|mailto:|tel:|data:)/i.test(v)) return;
      $el.attr(attr, reescribirEnlace(aAbsoluta(v, dirEs), lang));
    });
  }
  // srcset: misma regla, lista separada por comas con descriptor opcional.
  $('[srcset]').each((_, el) => {
    const $el = $(el);
    $el.attr('srcset', $el.attr('srcset').split(',').map((trozo) => {
      const [u, ...resto] = trozo.trim().split(/\s+/);
      if (!u || /^(https?:|\/\/|data:)/i.test(u)) return trozo.trim();
      return [reescribirEnlace(aAbsoluta(u, dirEs), lang), ...resto].join(' ');
    }).join(', '));
  });

  /* JSON-LD: las URLs también cambian de idioma. `@id` con almohadilla NO se
     toca: son identificadores del grafo —#organization, #website— y la empresa
     es la misma en los cinco idiomas; partirla en cinco nodos sueltos es lo que
     rompe el grafo. */
  $('script[type="application/ld+json"]').each((_, el) => {
    const $el = $(el);
    let datos;
    try { datos = JSON.parse($el.text()); } catch { return; }
    const paseo = (o) => {
      if (Array.isArray(o)) return o.forEach(paseo);
      if (!o || typeof o !== 'object') return;
      for (const [k, v] of Object.entries(o)) {
        const esUrl = k === 'url' || k === 'item' || (k === '@id' && !v.includes?.('#'));
        if (typeof v === 'string' && esUrl && v.startsWith(SITIO)) {
          o[k] = SITIO + reescribirEnlace(v.slice(SITIO.length) || '/', lang);
        } else if (typeof v === 'object') paseo(v);
      }
    };
    paseo(datos);
    $el.text(JSON.stringify(datos));
  });

  return { html: $.html(), vistas, faltan, rutaDestino };
}

// ---------------------------------------------------------------- ejecución
const paginas = paginasContenido(RAIZ);
console.log(`contenido · ${paginas.length} páginas españolas`);

/* 1. El español también necesita sus hreflang: sin reciprocidad Google
   descarta el grupo entero y trata cada idioma como una página suelta.
   Ojo con el orden: build-blog.mjs reescribe /blog desde WordPress y se los
   lleva por delante, así que este build va DESPUÉS del del blog, igual que
   build:enlaces y build:redirects. */
for (const rel of paginas) {
  const abs = path.join(RAIZ, rel);
  const $ = load(readFileSync(abs, 'utf8'), { decodeEntities: false });
  ponerAlternos($, rutaDe(rel));
  writeFileSync(abs, $.html());
}
console.log(`es · hreflang en ${paginas.length} páginas de contenido`);

for (const lang of objetivo) {
  const dic = diccionario(lang);
  let vistas = 0, faltan = 0;
  for (const rel of paginas) {
    const rutaEs = rutaDe(rel);
    const salida = traducirPagina(readFileSync(path.join(RAIZ, rel), 'utf8'), {
      rutaEs, dirEs: path.posix.dirname(rel), lang, dic,
    });
    const destino = path.join(RAIZ, salida.rutaDestino.replace(/^\//, ''), 'index.html');
    mkdirSync(path.dirname(destino), { recursive: true });
    writeFileSync(destino, salida.html);
    vistas += salida.vistas; faltan += salida.faltan;
  }
  const hechas = vistas - faltan;
  console.log(`${lang} · ${paginas.length} páginas · ${hechas}/${vistas} cadenas` +
    (faltan ? ` · ${faltan} salen en español` : ' · completo'));
}

console.log('\nLas cadenas que faltan se llenan con: npm run translate:contenido -- --lang <idioma>');
