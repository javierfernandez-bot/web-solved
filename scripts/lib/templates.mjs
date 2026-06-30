// =========================================================
// Plantillas HTML del blog (índice + post), idénticas en estética al resto del
// sitio: reutilizan colors-and-type.css, solved.css, chrome.js (nav/footer) y
// los design tokens. Aquí vive también todo el SEO (meta, OG, Twitter, JSON-LD).
// =========================================================
import { config } from '../config.mjs';

const { SITE_URL, ASSET_VERSION, ORG } = config;
const V = `?v=${ASSET_VERSION}`;
const DS = '_ds/solved-design-system-019dd861-f654-7208-a0d9-ce01d38606b8/colors-and-type.css';
const FONT_PRELOAD = '_ds/solved-design-system-019dd861-f654-7208-a0d9-ce01d38606b8/fonts/DMSans-VariableFont_opsz_wght.woff2';

const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function jsonld(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
export function formatDateES(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getUTCDate()} de ${MONTHS_ES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}
export function readingMinutes(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
// Recorta un texto a un máximo de palabras (añade … si se cortó).
export function clampWords(text = '', max = 100) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= max) return text.trim();
  return words.slice(0, max).join(' ').replace(/[.,;:]$/, '') + '…';
}

// <head> común a índice y post.
function head({ title, description, canonical, ogType = 'website', ogImage = null, ogImageW = 1200, ogImageH = 630, jsonLdArray = [], rootPrefix }) {
  const img = ogImage || `${SITE_URL}/assets/og-image.png`;
  const graph = jsonLdArray.length
    ? `<script type="application/ld+json">${jsonld({ '@context': 'https://schema.org', '@graph': jsonLdArray })}</script>`
    : '';
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<link rel="icon" type="image/png" sizes="32x32" href="${rootPrefix}assets/favicon-32.png"/>
<link rel="icon" type="image/png" sizes="512x512" href="${rootPrefix}assets/favicon.png"/>
<link rel="apple-touch-icon" href="${rootPrefix}assets/apple-touch-icon.png"/>
<title>${esc(title)}</title>
<!-- SEO:start -->
<meta name="description" content="${esc(description)}"/>
<link rel="canonical" href="${esc(canonical)}"/>
<meta name="robots" content="index, follow"/>
<meta name="theme-color" content="#1E6BFF"/>
<meta property="og:type" content="${ogType}"/>
<meta property="og:site_name" content="Solved"/>
<meta property="og:locale" content="es_ES"/>
<meta property="og:url" content="${esc(canonical)}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:image" content="${esc(img)}"/>
<meta property="og:image:width" content="${ogImageW}"/>
<meta property="og:image:height" content="${ogImageH}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${esc(img)}"/>
${graph}
<!-- SEO:end -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link rel="preload" as="font" type="font/woff2" crossorigin href="${rootPrefix}${FONT_PRELOAD}"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"/>
<link rel="stylesheet" href="${rootPrefix}${DS}${V}"/>
<link rel="stylesheet" href="${rootPrefix}solved.css${V}"/>
</head>`;
}

function footScripts(rootPrefix) {
  return `<div id="footer"></div>
<script src="${rootPrefix}chrome.js${V}"></script>
</body>
</html>`;
}

function breadcrumbLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

// ---------- PLANTILLA DE POST ----------
export function renderPost(post, ctx) {
  const { rootPrefix, blogPrefix, coverHtml, bodyHtml, canonical, ogImage, related, dateText, dateISO, modISO, readMins } = ctx;
  const cat = post.primaryCategory ? post.primaryCategory.name : null;

  const blogPostLd = {
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: post.title,
    description: post.excerpt,
    image: ogImage ? [ogImage] : undefined,
    datePublished: dateISO,
    dateModified: modISO || dateISO,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: ORG.name, logo: { '@type': 'ImageObject', url: ORG.logo } },
    articleSection: cat || undefined,
  };
  const crumbs = breadcrumbLd([
    { name: 'Inicio', url: `${SITE_URL}/` },
    { name: 'Blog', url: `${SITE_URL}/blog/` },
    { name: post.title, url: canonical },
  ]);

  const relatedHtml = related.length
    ? `<aside class="post__related">
      <h2>Sigue leyendo</h2>
      <div class="blog-grid blog-grid--related">
        ${related.map((r) => card(r, blogPrefix)).join('\n        ')}
      </div>
    </aside>`
    : '';

  return `${head({
    title: `${post.title} · Blog de Solved`,
    description: post.excerpt,
    canonical,
    ogType: 'article',
    ogImage,
    jsonLdArray: [blogPostLd, crumbs],
    rootPrefix,
  })}
<body data-screen-label="Blog · Post">

<div id="nav"></div>

<article class="post">
  <div class="wrap post__wrap">
    <nav class="post__crumbs" aria-label="Migas de pan">
      <a href="${rootPrefix}index.html">Inicio</a> <span>/</span>
      <a href="${blogPrefix}">Blog</a> <span>/</span>
      <span aria-current="page">${esc(post.title)}</span>
    </nav>

    <header class="post__head">
      ${cat ? `<span class="post__cat">${esc(cat)}</span>` : ''}
      <h1>${esc(post.title)}</h1>
      <p class="post__meta">Por ${esc(post.author)} · <time datetime="${esc(dateISO)}">${esc(dateText)}</time> · ${readMins} min de lectura</p>
    </header>

    ${coverHtml ? `<figure class="post__cover">${coverHtml}</figure>` : ''}

    <div class="post__body">
${bodyHtml}
    </div>

    <footer class="post__foot">
      <a class="btn btn--secondary" href="${blogPrefix}">← Volver al blog</a>
    </footer>

    ${relatedHtml}
  </div>
</article>

${footScripts(rootPrefix)}`;
}

// Tarjeta de post (usada en índice y en "relacionados").
export function card(item, blogPrefix) {
  const url = `${blogPrefix}${item.slug}/`;
  const media = item.cardPicture
    ? `<a class="blog-card__media" href="${url}" aria-hidden="true" tabindex="-1">${item.cardPicture}</a>`
    : `<a class="blog-card__media blog-card__media--empty" href="${url}" aria-hidden="true" tabindex="-1"></a>`;
  return `<article class="blog-card">
        ${media}
        <div class="blog-card__body">
          ${item.cat ? `<span class="blog-card__cat">${esc(item.cat)}</span>` : ''}
          <h2 class="blog-card__title"><a href="${url}">${esc(item.title)}</a></h2>
          ${item.excerpt ? `<p class="blog-card__excerpt">${esc(item.excerpt)}</p>` : ''}
          <p class="blog-card__meta"><time datetime="${esc(item.dateISO || '')}">${esc(item.dateText || '')}</time></p>
        </div>
      </article>`;
}

// ---------- PLANTILLA DE ÍNDICE ----------
export function renderIndex({ cards, page, totalPages, rootPrefix, blogPrefix, canonical }) {
  const blogLd = {
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog/`,
    name: 'Blog de Solved',
    description: 'Ideas, guías y novedades sobre calidad, incidencias y digitalización industrial.',
    publisher: { '@type': 'Organization', name: ORG.name, logo: { '@type': 'ImageObject', url: ORG.logo } },
    url: `${SITE_URL}/blog/`,
  };
  const crumbs = breadcrumbLd([
    { name: 'Inicio', url: `${SITE_URL}/` },
    { name: 'Blog', url: `${SITE_URL}/blog/` },
  ]);

  // Paginación: página 1 en /blog/, resto en /blog/page/N/.
  const pageUrl = (n) => (n === 1 ? blogPrefix : `${blogPrefix}page/${n}/`);
  let pager = '';
  if (totalPages > 1) {
    const links = [];
    if (page > 1) links.push(`<a class="blog-pager__link" rel="prev" href="${pageUrl(page - 1)}">← Anterior</a>`);
    for (let n = 1; n <= totalPages; n++) {
      links.push(n === page
        ? `<span class="blog-pager__num blog-pager__num--current" aria-current="page">${n}</span>`
        : `<a class="blog-pager__num" href="${pageUrl(n)}">${n}</a>`);
    }
    if (page < totalPages) links.push(`<a class="blog-pager__link" rel="next" href="${pageUrl(page + 1)}">Siguiente →</a>`);
    pager = `<nav class="blog-pager" aria-label="Paginación del blog">${links.join('')}</nav>`;
  }

  const title = page === 1 ? 'Blog · Solved' : `Blog · Página ${page} · Solved`;

  return `${head({
    title,
    description: 'Ideas, guías y novedades sobre calidad, gestión de incidencias y digitalización de la industria, por el equipo de Solved.',
    canonical,
    ogType: 'website',
    jsonLdArray: [blogLd, crumbs],
    rootPrefix,
  })}
<body data-screen-label="Blog">

<div id="nav"></div>

<section class="section blog-index">
  <div class="wrap">
    <header class="section-head">
      <h1>Blog de Solved</h1>
      <p>Ideas, guías y novedades sobre calidad, gestión de incidencias y digitalización industrial.</p>
    </header>

    <div class="blog-grid">
      ${cards.join('\n      ')}
    </div>

    ${pager}
  </div>
</section>

${footScripts(rootPrefix)}`;
}
