#!/usr/bin/env node
// =========================================================
// build-blog.mjs — Genera el blog estático desde la WordPress REST API.
//
//   npm run build:blog
//
// Idempotente: limpia /blog y lo regenera. Las imágenes se cachean en
// .cache/blog-images para no descargar/recodificar en cada ejecución.
// =========================================================
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { config } from './config.mjs';
import { getPosts } from './lib/wp.mjs';
import { optimizeImage, buildPicture, cleanImageOutput } from './lib/images.mjs';
import { collectImageUrls, sanitizeContent } from './lib/sanitize.mjs';
import { renderPost, renderIndex, card, formatDateES, readingMinutes, clampWords } from './lib/templates.mjs';
import { writeSitemap } from './lib/sitemap.mjs';

const { OUT_DIR, SITE_URL, POSTS_PER_PAGE, RELATED_COUNT } = config;

async function writeFile(relPath, html) {
  const full = path.join(OUT_DIR === 'blog' ? '.' : '.', relPath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, html, 'utf8');
}

// Construye el objeto que consume card() para un post, con la imagen ya
// resuelta al prefijo de la página que va a renderizar la tarjeta.
function makeCardItem(post, blogPrefix, featuredMap) {
  const img = post.featured ? featuredMap.get(post.featured.url) : null;
  const cardPicture = img
    ? buildPicture(img, { blogPrefix, alt: post.featured.alt || post.title, sizes: '(max-width: 760px) 100vw, 360px', className: 'blog-card__img' })
    : '';
  return {
    slug: post.slug,
    title: post.title,
    excerpt: clampWords(post.excerpt, 30), // máx 30 palabras en las tarjetas
    cat: post.primaryCategory ? post.primaryCategory.name : null,
    dateISO: post.datePublished,
    dateText: formatDateES(post.datePublished),
    cardPicture,
  };
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`\n▶ build:blog — leyendo ${config.WP_API_BASE}`);

  // 1) Traer posts PRIMERO: si la red falla, no destruimos el build anterior.
  const posts = await getPosts();
  console.log(`  ✓ ${posts.length} posts`);

  // 2) Ahora sí, limpiar salida anterior (idempotencia).
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await cleanImageOutput();

  // 3) Optimizar imágenes (destacadas con JPG de respaldo para og:image; inline sin él).
  const featuredMap = new Map();
  for (const post of posts) {
    if (post.featured && !featuredMap.has(post.featured.url)) {
      const img = await optimizeImage(post.featured.url, { jpeg: true });
      if (img) featuredMap.set(post.featured.url, img);
    }
  }
  const inlineMap = new Map();
  for (const post of posts) {
    for (const url of collectImageUrls(post.contentHtml)) {
      if (!inlineMap.has(url) && !featuredMap.has(url)) {
        const img = await optimizeImage(url, { jpeg: false });
        if (img) inlineMap.set(url, img);
      }
    }
  }
  // Mapa combinado para la sustitución dentro del contenido.
  const contentImageMap = new Map([...featuredMap, ...inlineMap]);
  console.log(`  ✓ ${featuredMap.size} imágenes destacadas + ${inlineMap.size} inline optimizadas`);

  // 4) Renderizar cada post.
  const rootPrefix = '../../'; // blog/{slug}/index.html → raíz del repo
  const blogPrefix = '../';    // blog/{slug}/index.html → /blog/
  for (const post of posts) {
    const canonical = `${SITE_URL}/blog/${post.slug}/`;
    const featured = post.featured ? featuredMap.get(post.featured.url) : null;
    const coverHtml = featured
      ? buildPicture(featured, { blogPrefix, alt: post.featured.alt || post.title, eager: true, sizes: '(max-width: 760px) 100vw, 760px' })
      : '';
    const ogImage = featured ? `${SITE_URL}/blog/assets/${featured.jpg || featured.largestWebp}` : null;

    const bodyHtml = sanitizeContent(post.contentHtml, contentImageMap, blogPrefix);

    // Relacionados: misma categoría, excluyendo el propio, máx RELATED_COUNT.
    const catId = post.primaryCategory ? post.primaryCategory.id : null;
    const related = posts
      .filter((p) => p.id !== post.id && catId && p.categories.some((c) => c.id === catId))
      .slice(0, RELATED_COUNT)
      .map((p) => makeCardItem(p, blogPrefix, featuredMap));

    const html = renderPost(post, {
      rootPrefix, blogPrefix, coverHtml, bodyHtml, canonical, ogImage,
      related,
      dateISO: post.datePublished,
      modISO: post.dateModified,
      dateText: formatDateES(post.datePublished),
      readMins: readingMinutes(post.excerpt + ' ' + post.contentHtml.replace(/<[^>]+>/g, ' ')),
    });
    await writeFile(`blog/${post.slug}/index.html`, html);
  }
  console.log(`  ✓ ${posts.length} páginas de post escritas`);

  // 5) Índice paginado.
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  for (let page = 1; page <= totalPages; page++) {
    const slice = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
    const isFirst = page === 1;
    const idxRootPrefix = isFirst ? '../' : '../../../';
    const idxBlogPrefix = isFirst ? '' : '../../';
    const canonical = isFirst ? `${SITE_URL}/blog/` : `${SITE_URL}/blog/page/${page}/`;
    const cards = slice.map((p) => card(makeCardItem(p, idxBlogPrefix, featuredMap), idxBlogPrefix));
    const html = renderIndex({ cards, page, totalPages, rootPrefix: idxRootPrefix, blogPrefix: idxBlogPrefix, canonical });
    await writeFile(isFirst ? 'blog/index.html' : `blog/page/${page}/index.html`, html);
  }
  console.log(`  ✓ índice (${totalPages} página/s)`);

  // 6) Sitemap.
  const count = await writeSitemap(posts, today);
  console.log(`  ✓ sitemap.xml (${count} URLs)`);

  console.log('✔ blog generado en /blog\n');
}

main().catch((err) => {
  console.error('\n✖ build:blog falló:', err);
  process.exit(1);
});
