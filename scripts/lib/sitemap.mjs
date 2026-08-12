// =========================================================
// Genera sitemap.xml = páginas estáticas + índice del blog + cada post.
// robots.txt ya enlaza a /sitemap.xml, así que no hace falta tocarlo.
//
// Solo entran URLs canónicas (/ruta/ con barra final). Los stubs .html de
// redirección y las páginas noindex quedan fuera por construcción: la lista
// de estáticas vive en config.mjs y ya solo contiene canónicas.
//
// El <lastmod> es real, no la fecha de hoy:
//   - posts del blog → dateModified que da la API de WordPress
//   - resto de páginas → fecha del último commit que tocó su index.html
// =========================================================
import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import { config } from '../config.mjs';

const exec = promisify(execFile);
const { SITE_URL, STATIC_PAGES } = config;

/** '/'→'index.html', '/glosario/oee/'→'glosario/oee/index.html' */
export function locToFile(loc) {
  return (loc.replace(/^\/+/, '') + 'index.html').replace(/\/{2,}/g, '/');
}

/** Fecha (YYYY-MM-DD) del último commit que tocó el fichero. */
export async function gitLastmod(file, fallback) {
  try {
    const { stdout } = await exec('git', ['log', '-1', '--format=%cs', '--', file]);
    return stdout.trim() || fallback;
  } catch {
    return fallback; // sin git (o fichero sin commitear todavía)
  }
}

export function urlBlock({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ].filter(Boolean).join('\n');
}

export function renderSitemap(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(urlBlock).join('\n')}
</urlset>
`;
}

/** Entradas de las páginas estáticas, con lastmod sacado de git. */
export async function staticEntries(today) {
  return Promise.all(STATIC_PAGES.map(async p => ({
    ...p,
    lastmod: await gitLastmod(locToFile(p.loc), today),
  })));
}

export async function writeSitemap(posts, today) {
  const entries = await staticEntries(today);

  // Índice del blog
  entries.push({
    loc: '/blog/',
    lastmod: await gitLastmod('blog/index.html', today),
    changefreq: 'weekly',
    priority: '0.7',
  });

  // Posts (lastmod = fecha de modificación real que da WordPress)
  for (const post of posts) {
    const lastmod = (post.dateModified || post.datePublished || '').slice(0, 10) || today;
    entries.push({ loc: `/blog/${post.slug}/`, lastmod, changefreq: 'monthly', priority: '0.6' });
  }

  await fs.writeFile('sitemap.xml', renderSitemap(entries), 'utf8');
  return entries.length;
}
