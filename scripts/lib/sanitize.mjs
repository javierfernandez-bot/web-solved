// =========================================================
// Limpia el HTML que devuelve WordPress y lo deja "nativo":
//  - fuera clases wp-*, estilos inline, ids y data-*
//  - se desenvuelven <div>/<span> (wrappers de bloques Gutenberg)
//  - h1 → h2 (el h1 es el título del post)
//  - las <img> de /wp-content se sustituyen por <picture> locales optimizadas
//  - enlaces a otros posts de WP → /blog/{slug}/ ; externos → rel/target seguros
// =========================================================
import * as cheerio from 'cheerio';
import { buildPicture } from './images.mjs';
import { resolveInternalHref } from './links.mjs';

const localizable = (url = '') => url.includes('/wp-content/');

// Pre-pass: recoge las URLs de imágenes de WP presentes en el contenido.
export function collectImageUrls(html) {
  const $ = cheerio.load(html, null, false);
  const urls = new Set();
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && localizable(src)) urls.add(src);
  });
  return [...urls];
}

/**
 * Limpia el contenido y devuelve HTML listo para inyectar en .post__body.
 * @param imageMap  Map<url, imageData> ya optimizadas (de images.optimizeImage)
 * @param blogPrefix ruta desde la página hasta /blog/ (p. ej. '../')
 * @param rootPrefix ruta desde la página hasta la raíz del sitio (p. ej. '../../')
 * @param slugs      Set con los slugs de posts publicados (para validar enlaces internos)
 */
export function sanitizeContent(html, imageMap, blogPrefix, rootPrefix = `${blogPrefix}../`, slugs = new Set()) {
  const $ = cheerio.load(html, null, false);

  // 1) Fuera elementos no deseados.
  $('script, style, noscript, link, meta').remove();

  // 2) Sustituir imágenes de WP por <picture> locales.
  $('img').each((_, el) => {
    const $img = $(el);
    const src = $img.attr('src');
    if (src && localizable(src) && imageMap.has(src)) {
      const alt = $img.attr('alt') || '';
      const picture = buildPicture(imageMap.get(src), { blogPrefix, alt, sizes: '(max-width: 760px) 100vw, 720px' });
      $img.replaceWith(picture);
    } else {
      // imagen externa: limpiar atributos de presentación y dejar lazy
      $img.removeAttr('srcset').removeAttr('sizes').removeAttr('class').removeAttr('style');
      if (!$img.attr('loading')) $img.attr('loading', 'lazy');
      $img.attr('decoding', 'async');
    }
  });

  // 3) Reescribir enlaces.
  $('a[href]').each((_, el) => {
    const $a = $(el);
    const href = $a.attr('href');
    if (!href) return;
    // Internos (nuestro dominio o root-relativos): corregir a la URL real del
    // sitio estático (o quitar el enlace si el destino no existe).
    const res = resolveInternalHref(href, { blogPrefix, rootPrefix, slugs });
    if (res) {
      if (res.unwrap) $a.replaceWith($a.contents());
      else $a.attr('href', res.href);
      return;
    }
    // Externos: abrir en pestaña nueva de forma segura.
    if (/^https?:\/\//i.test(href)) {
      $a.attr('target', '_blank').attr('rel', 'noopener noreferrer');
    }
  });

  // 4) h1 → h2 (no debe haber dos h1 en la página).
  $('h1').each((_, el) => { el.tagName = 'h2'; });

  // 5) Quitar atributos de presentación de TODOS los elementos.
  $('*').each((_, el) => {
    if (!el.attribs) return;
    for (const attr of Object.keys(el.attribs)) {
      if (attr === 'class' || attr === 'style' || attr === 'id' || attr.startsWith('data-') || attr.startsWith('aria-')) {
        $(el).removeAttr(attr);
      }
    }
  });

  // 6) Desenvolver <div>/<span> (wrappers de Gutenberg), de dentro hacia fuera.
  let guard = 0;
  while ($('div, span').length && guard < 50) {
    $('div, span').each((_, el) => { $(el).replaceWith($(el).contents()); });
    guard += 1;
  }

  // 7) Quitar párrafos vacíos.
  $('p').each((_, el) => {
    const $p = $(el);
    if (!$p.text().trim() && !$p.find('img, picture, iframe').length) $p.remove();
  });

  return $.html().trim();
}
