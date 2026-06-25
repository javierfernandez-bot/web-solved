// =========================================================
// Regenera sitemap.xml = páginas estáticas + índice del blog + cada post.
// robots.txt ya enlaza a /sitemap.xml, así que no hace falta tocarlo.
// =========================================================
import { promises as fs } from 'node:fs';
import { config } from '../config.mjs';

const { SITE_URL, STATIC_PAGES } = config;

function urlBlock({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ].filter(Boolean).join('\n');
}

export async function writeSitemap(posts, today) {
  const entries = [];

  // Estáticas
  for (const p of STATIC_PAGES) entries.push(urlBlock({ ...p, lastmod: today }));

  // Índice del blog
  entries.push(urlBlock({ loc: '/blog/', lastmod: today, changefreq: 'weekly', priority: '0.7' }));

  // Posts (lastmod = fecha de modificación real, en formato YYYY-MM-DD)
  for (const post of posts) {
    const lastmod = (post.dateModified || post.datePublished || '').slice(0, 10) || today;
    entries.push(urlBlock({ loc: `/blog/${post.slug}/`, lastmod, changefreq: 'monthly', priority: '0.6' }));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
  await fs.writeFile('sitemap.xml', xml, 'utf8');
  return posts.length + STATIC_PAGES.length + 1;
}
