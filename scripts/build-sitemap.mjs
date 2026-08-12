#!/usr/bin/env node
// =========================================================
// Regenera sitemap.xml LEYENDO EL DISCO, sin tocar la API de WordPress.
//
//   npm run build:sitemap
//
// El camino normal es `npm run build:blog`, que reescribe el sitemap con los
// datos frescos de WordPress. Este script es para cuando eso no toca o no se
// puede: has añadido un término al glosario, has movido una página estática, o
// simplemente no hay red contra trysolved.es. Produce el mismo XML: las páginas
// estáticas salen de STATIC_PAGES (config.mjs) y los posts se descubren
// recorriendo /blog/*/index.html, sacando su dateModified del JSON-LD que el
// build ya dejó incrustado.
//
// Solo emite URLs canónicas: los stubs .html de redirección y las páginas
// noindex no están en STATIC_PAGES y no se descubren solos.
// =========================================================
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { renderSitemap, staticEntries, gitLastmod } from './lib/sitemap.mjs';

const today = new Date().toISOString().slice(0, 10);

/** Saca dateModified (o datePublished) del JSON-LD ya incrustado en el post. */
async function postLastmod(file) {
  const html = await fs.readFile(file, 'utf8');
  const m = html.match(/"dateModified"\s*:\s*"([^"]+)"/)
         || html.match(/"datePublished"\s*:\s*"([^"]+)"/);
  return m ? m[1].slice(0, 10) : gitLastmod(file, today);
}

const entries = await staticEntries(today);

// Índice del blog
entries.push({
  loc: '/blog/',
  lastmod: await gitLastmod('blog/index.html', today),
  changefreq: 'weekly',
  priority: '0.7',
});

// Posts: cada subcarpeta de /blog/ con index.html. Se excluyen blog/assets/
// (imágenes) y blog/page/ (paginación del índice: /blog/page/2/…), que nunca
// ha estado en el sitemap y se deja igual para no cambiar lo que ya rastrea
// Google. Los posts se alcanzan igual desde el índice y desde el sitemap.
const EXCLUIDAS = new Set(['assets', 'page']);
const dirs = (await fs.readdir('blog', { withFileTypes: true }))
  .filter(e => e.isDirectory() && !EXCLUIDAS.has(e.name))
  .map(e => e.name)
  .sort();

let posts = 0;
for (const slug of dirs) {
  const file = path.join('blog', slug, 'index.html');
  try { await fs.access(file); } catch { continue; }
  entries.push({
    loc: `/blog/${slug}/`,
    lastmod: await postLastmod(file),
    changefreq: 'monthly',
    priority: '0.6',
  });
  posts++;
}

await fs.writeFile('sitemap.xml', renderSitemap(entries), 'utf8');
console.log(`sitemap.xml: ${entries.length} URLs (${entries.length - posts - 1} estáticas + índice del blog + ${posts} posts)`);
