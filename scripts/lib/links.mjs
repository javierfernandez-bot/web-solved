// links.mjs — Resolución de enlaces internos que la IA escribe en el cuerpo de
// los posts de WordPress (a menudo mal: slugs sin /blog/, páginas de producto
// con ruta errónea, rutas inexistentes, o con ?utm_source=chatgpt.com).
//
// Reglas (solo se tocan enlaces INTERNOS absolutos a trysolved.com/.es o
// root-relativos "/...". Los relativos "../slug/" de las plantillas NO se tocan):
//   - /blog/{slug} o /{slug}  → {blogPrefix}{slug}/        (si el slug existe)
//   - /incidencias, /dashboard/, … → {rootPrefix}pagina.html
//   - /demo, /landing-*, …    → {rootPrefix}index.html#contacto
//   - /funcionalidades, /casos-de-exito, … → {rootPrefix}index.html
//   - destino desconocido     → se quita el enlace (unwrap), se conserva el texto

// Páginas estáticas del sitio (clave normalizada sin barras → ruta real).
const STATIC = new Map([
  ['', 'index.html'], ['index.html', 'index.html'], ['inicio', 'index.html'], ['home', 'index.html'],
  ['incidencias', 'incidencias.html'], ['incidencias.html', 'incidencias.html'],
  ['auditorias', 'auditorias.html'], ['auditorias.html', 'auditorias.html'],
  ['registros-y-auditorias', 'auditorias.html'], ['registros-auditorias', 'auditorias.html'],
  ['dashboard', 'dashboard.html'], ['dashboard.html', 'dashboard.html'],
  ['kpis', 'dashboard.html'], ['kpis-y-dashboards', 'dashboard.html'],
  ['industria-alimentaria', 'industria-alimentaria.html'], ['industria-alimentaria.html', 'industria-alimentaria.html'],
  ['industria-general', 'industria-general.html'], ['industria-general.html', 'industria-general.html'],
  ['no-conformidades', 'no-conformidades/'],
  ['politica-de-cookies', 'politica-de-cookies.html'], ['politica-de-cookies.html', 'politica-de-cookies.html'],
  ['politica-de-privacidad', 'politica-de-privacidad.html'], ['politica-de-privacidad.html', 'politica-de-privacidad.html'],
  ['glosario', 'glosario/'], ['blog', 'blog/'],
]);

// Alias hacia el CTA de demo (ancla de contacto en la home).
const DEMO = new Set(['demo', 'solicitar-demo', 'pedir-demo', 'solicita-una-demo', 'solicita-demo',
  'landing-form-demo', 'landing-webinar', 'webinar', 'prueba-gratis', 'prueba-gratuita', 'contacto', 'contactar', 'contacta']);
// Alias hacia la home (secciones que no existen como página propia).
const HOME = new Set(['funcionalidades', 'caracteristicas', 'producto', 'productos',
  'casos-de-exito', 'casos-exito', 'clientes', 'precios', 'pricing', 'planes', 'soluciones']);

const DOMAIN_RE = /^https?:\/\/(www\.)?trysolved\.(com|es)/i;

/**
 * Resuelve un href a su destino correcto dentro del sitio estático.
 * @returns {null | {href} | {unwrap:true}}
 *   null       → dejar el enlace como está (relativo, externo, ancla, mailto…)
 *   {href}     → reescribir el href
 *   {unwrap}   → quitar el <a> (destino inexistente), conservando el texto
 */
export function resolveInternalHref(raw, { blogPrefix, rootPrefix, slugs }) {
  if (!raw) return null;
  const href = raw.trim();
  if (/^(#|mailto:|tel:|javascript:|data:)/i.test(href)) return null;

  let path, hash = '';
  if (DOMAIN_RE.test(href)) {
    const u = new URL(href);
    path = u.pathname;
    hash = u.hash || '';
  } else if (href.startsWith('/')) {
    const hi = href.indexOf('#');
    if (hi !== -1) { hash = href.slice(hi); path = href.slice(0, hi); }
    else path = href;
  } else {
    return null; // relativo (../slug/) u otro origen: no tocar
  }

  path = path.split('?')[0]; // fuera query (utm, etc.)
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

  if (parts[0] === 'blog') {
    const s = parts[1];
    if (!s) return { href: `${blogPrefix}${hash}` };       // /blog/ → índice
    if (slugs.has(s)) return { href: `${blogPrefix}${s}/${hash}` };
    return { unwrap: true };                                // /blog/slug-inexistente
  }

  if (parts.length <= 1) {
    const one = (parts[0] || '').toLowerCase();
    if (STATIC.has(one)) return { href: `${rootPrefix}${STATIC.get(one)}${hash}` };
    if (slugs.has(one)) return { href: `${blogPrefix}${one}/${hash}` };
    if (DEMO.has(one)) return { href: `${rootPrefix}index.html#contacto` };
    if (HOME.has(one)) return { href: `${rootPrefix}index.html` };
    return { unwrap: true };
  }

  return { unwrap: true }; // multi-segmento no reconocido
}

/** Aplica la resolución sobre todos los <a href> de un documento cheerio. */
export function rewriteInternalLinks($, opts) {
  $('a[href]').each((_, el) => {
    const $a = $(el);
    const res = resolveInternalHref($a.attr('href'), opts);
    if (!res) return;
    if (res.unwrap) $a.replaceWith($a.contents());
    else $a.attr('href', res.href);
  });
}
