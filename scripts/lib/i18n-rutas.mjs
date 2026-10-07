/* Solved · rutas y enlaces entre idiomas.
   ------------------------------------------------------------------
   Vive aquí porque lo usan los dos builds —el de las páginas comerciales
   (build-i18n.mjs) y el del contenido (build-i18n-contenido.mjs)— y si cada
   uno reescribiera los enlaces a su manera, el blog en inglés apuntaría a la
   home en español y nadie lo vería hasta rastrear el sitio entero. */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { LANGS, RUTAS, SOURCE, traducirRuta } from '../../i18n/config.mjs';

/* Assets y hojas de estilo: viven en la raíz para los cinco idiomas, no se
   duplican ni se prefijan. `blog/assets/` es la carpeta de imágenes del blog,
   que es otra distinta de `assets/` y por eso va nombrada aparte. */
const RAIZ_COMPARTIDA = /^\/(assets|ds|_ds|blog\/assets)\//;
export const esAsset = (href) =>
  RAIZ_COMPARTIDA.test(href) ||
  /^\/[\w.-]+\.(css|js|png|jpg|jpeg|webp|svg|xml|txt|mp4|pdf|ico)(\?|$)/.test(href);

/* Ruta de una página de contenido (blog, glosario) en otro idioma.
   El slug del artículo NO se traduce, y es una decisión, no un olvido: los
   HTML del blog los regenera build-blog.mjs desde WordPress, donde el slug es
   el de la publicación española. Traducirlo obligaría a guardar un mapa de 100
   URLs inventadas y a mantenerlo vivo en cada rebuild; y una URL que cambia
   sola es peor que una URL en español. Lo que sí se traduce es la carpeta que
   los agrupa —/glosario/ → /glossary/—, que es la que está en el mapa. */
export function rutaContenido(ruta, lang) {
  if (lang === SOURCE) return ruta;
  const exacta = traducirRuta(ruta, lang);
  if (exacta) return exacta;
  // Prefijo más largo del mapa que encaje: así /glosario/alergenos/ hereda la
  // traducción de /glosario/ y /casos-de-exito/x/ la suya si la tuviera.
  let mejor = null;
  for (const clave of Object.keys(RUTAS)) {
    if (clave === '/' || !clave.endsWith('/') || !ruta.startsWith(clave)) continue;
    if (!mejor || clave.length > mejor.length) mejor = clave;
  }
  if (mejor) {
    const base = traducirRuta(mejor, lang);
    if (base) return base + ruta.slice(mejor.length);
  }
  return null;
}

/* Reescribe un href/src ABSOLUTO al idioma destino. Devuelve la misma cadena
   si no hay que tocarla (externo, ancla, asset compartido, ruta sin
   equivalente). */
export function reescribirEnlace(href, lang) {
  if (!href || !href.startsWith('/')) return href;
  if (href === '/chrome.js' || href.startsWith('/chrome.js?')) {
    return `${LANGS[lang].prefijo}${href}`;
  }
  if (esAsset(href)) return href;
  const corte = href.search(/[?#]/);
  const ruta = corte === -1 ? href : href.slice(0, corte);
  const cola = corte === -1 ? ''   : href.slice(corte);
  const destino = rutaContenido(ruta, lang);
  return destino ? destino + cola : href;
}

/* Un href relativo, resuelto contra la carpeta de la página española.
   El blog y el glosario enlazan con `../../assets/…`, y al bajar una carpeta
   más (/en/blog/slug/) esas subidas apuntarían a /en/. Se pasan a absolutas
   antes de traducirlas, que además es la convención de las páginas de raíz. */
export function aAbsoluta(href, dirEs) {
  if (!href) return href;
  if (/^([a-z]+:|\/\/|\/|#|mailto:|tel:)/i.test(href)) return href;
  const corte = href.search(/[?#]/);
  const ruta = corte === -1 ? href : href.slice(0, corte);
  const cola = corte === -1 ? ''   : href.slice(corte);
  const abs = path.posix.resolve('/' + dirEs, ruta);
  // resolve() se come la barra final, y aquí distingue carpeta de fichero. Ojo
  // con la raíz: ya termina en barra y añadirle otra da '//', que el navegador
  // lee como un host y se va fuera del sitio.
  return (ruta.endsWith('/') && !abs.endsWith('/') ? abs + '/' : abs) + cola;
}

/* Las páginas de contenido: todo lo que cuelga de /blog/ y /glosario/.
   Baja hasta el fondo a propósito: la paginación del blog vive en
   blog/page/2/…/7/ y con un solo nivel se quedaba fuera, así que el índice
   traducido enlazaba a siete páginas que no existían.
   Lo usan el build del contenido y translate-contenido.mjs: si los dos no
   recorrieran lo mismo habría páginas traducidas sin cadenas en la caché.

   Las páginas puente de artículos fusionados (seo/plan-fusion.md) viven en
   blog/<slug>/index.html, igual que un post real —el repo no distingue un
   directorio de otro—, así que sin esto el traductor las trata como
   contenido: les pone hreflang y un canonical propio en cada idioma, que es
   justo lo que una página con noindex+refresh no debe llevar. Se excluyen
   los slugs que seo/redirects.json mapea bajo "blog/…", la misma regla que
   ya usa build-sitemap.mjs para el mismo problema. */
function slugsPuente(raiz) {
  try {
    const mapa = JSON.parse(readFileSync(path.join(raiz, 'seo/redirects.json'), 'utf8'));
    return new Set(
      Object.keys(mapa)
        .filter((k) => k.startsWith('blog/'))
        .map((k) => k.slice('blog/'.length))
    );
  } catch {
    return new Set();
  }
}

export function paginasContenido(raiz, dirs = ['blog', 'glosario']) {
  const puente = slugsPuente(raiz);
  const fuera = [];
  const bajar = (rel) => {
    const base = path.join(raiz, rel);
    if (!existsSync(base)) return;
    if (existsSync(path.join(base, 'index.html'))) fuera.push(`${rel}/index.html`);
    for (const sub of readdirSync(base, { withFileTypes: true })) {
      if (!sub.isDirectory() || sub.name === 'assets') continue;
      if (rel === 'blog' && puente.has(sub.name)) continue;
      bajar(path.posix.join(rel, sub.name));
    }
  };
  for (const dir of dirs) bajar(dir);
  return fuera;
}

/* Enlaces alternos de una ruta: los cinco idiomas + x-default al español. */
export function alternos(rutaEs, sitio, TARGETS) {
  const fuera = [{ hreflang: 'x-default', href: sitio + rutaEs }];
  for (const lang of [SOURCE, ...TARGETS]) {
    const r = rutaContenido(rutaEs, lang);
    if (r) fuera.push({ hreflang: LANGS[lang].htmlLang, href: sitio + r });
  }
  return fuera;
}
