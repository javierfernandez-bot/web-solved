// =========================================================
// Acceso a la WordPress REST API.
// Pagina con la cabecera X-WP-TotalPages y normaliza los posts a una forma
// cómoda para las plantillas (sin acoplarse al shape crudo de WP).
// =========================================================
import { config } from '../config.mjs';

const { WP_API_BASE, PER_PAGE } = config;

// Decodifica entidades HTML básicas que WP devuelve en campos de texto plano
// (títulos, nombres de categoría…). El contenido HTML se limpia aparte.
function decodeEntities(str = '') {
  return str
    .replace(/&#8217;|&#x2019;/g, '’')
    .replace(/&#8216;|&#x2018;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(html = '') {
  return decodeEntities(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

// Genera un slug limpio desde un texto (para slugs rotos o vacíos de WP,
// p. ej. "__trashed-3" de un post que estuvo en la papelera).
function slugify(text = '') {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'post';
}

// Devuelve un slug usable: el de WP salvo que esté vacío o sea de papelera.
function safeSlug(slug, title) {
  if (!slug || /__trashed/.test(slug)) return slugify(title);
  return slug;
}

// Recorre TODAS las páginas de un endpoint (posts, categories, tags…).
async function fetchAll(endpoint, extraParams = '') {
  const out = [];
  let page = 1;
  let totalPages = 1;
  do {
    const url = `${WP_API_BASE}/${endpoint}?per_page=${PER_PAGE}&page=${page}${extraParams}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`WP API ${res.status} ${res.statusText} en ${url}`);
    }
    totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10) || 1;
    const batch = await res.json();
    out.push(...batch);
    page += 1;
  } while (page <= totalPages);
  return out;
}

// Normaliza un post de WP a la forma que usan las plantillas.
function normalizePost(p) {
  const embedded = p._embedded || {};
  const fm = (embedded['wp:featuredmedia'] || [])[0] || null;
  const author = (embedded.author || [])[0] || null;

  // wp:term llega como array de grupos [categorías, tags]
  const termGroups = embedded['wp:term'] || [];
  const flatTerms = termGroups.flat().filter(Boolean);
  const categories = flatTerms
    .filter((t) => t.taxonomy === 'category')
    .map((t) => ({ id: t.id, name: decodeEntities(t.name), slug: t.slug }));
  const tags = flatTerms
    .filter((t) => t.taxonomy === 'post_tag')
    .map((t) => ({ id: t.id, name: decodeEntities(t.name), slug: t.slug }));

  const title = decodeEntities(p.title?.rendered || '');
  return {
    id: p.id,
    slug: safeSlug(p.slug, title),
    title,
    contentHtml: p.content?.rendered || '',
    excerpt: stripTags(p.excerpt?.rendered || ''),
    // date_gmt / modified_gmt vienen SIN sufijo de zona → añadimos 'Z' (UTC)
    datePublished: p.date_gmt ? `${p.date_gmt}Z` : null,
    dateModified: p.modified_gmt ? `${p.modified_gmt}Z` : (p.date_gmt ? `${p.date_gmt}Z` : null),
    author: author ? decodeEntities(author.name) : 'Solved',
    categories,
    tags,
    primaryCategory: categories[0] || null,
    featured: fm
      ? { url: fm.source_url, alt: decodeEntities(fm.alt_text || '') }
      : null,
  };
}

// Devuelve todos los posts publicados, normalizados y de más nuevo a más viejo.
export async function getPosts() {
  const raw = await fetchAll('posts', '&_embed&status=publish&orderby=date&order=desc');
  return raw.map(normalizePost);
}

export { decodeEntities, stripTags };
