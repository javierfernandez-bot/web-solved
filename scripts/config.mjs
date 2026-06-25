// =========================================================
// Configuración del generador del blog (WordPress headless → estático)
// Cambia WP_API_BASE el día que muevas WordPress a un subdominio:
//   WP_API_BASE=https://cms.trysolved.com/wp-json/wp/v2 npm run build:blog
// =========================================================

export const config = {
  // ---- Origen de datos (WordPress REST API) ----
  WP_API_BASE: process.env.WP_API_BASE || 'https://trysolved.com/wp-json/wp/v2',

  // ---- Sitio estático (destino) ----
  SITE_URL: 'https://trysolved.com',   // base canónica del sitio publicado
  BLOG_PATH: '/blog',                  // los posts viven en /blog/{slug}/

  // ---- Paginación ----
  PER_PAGE: 100,        // máximo de la WP API por request
  POSTS_PER_PAGE: 9,    // posts por página del índice del blog

  // ---- Rutas locales (relativas a la raíz del repo) ----
  OUT_DIR: 'blog',                 // HTML generado del blog
  IMG_OUT_DIR: 'blog/assets',      // imágenes optimizadas servidas localmente
  CACHE_DIR: '.cache/blog-images', // descargas + recodificados cacheados (gitignored)

  // ---- Optimización de imágenes ----
  IMAGE_WIDTHS: [480, 768, 1200],  // anchos responsive (no se amplían si el original es menor)
  RELATED_COUNT: 3,                // posts relacionados por categoría

  ASSET_VERSION: '20260623b',      // ?v= para cache-busting de CSS/JS (igual que el resto del sitio)

  // ---- Identidad para SEO / JSON-LD ----
  ORG: {
    name: 'Solved',
    logo: 'https://trysolved.com/assets/logotipo-solved.webp',
    twitter: '@solved',
  },

  // ---- Páginas estáticas del sitio (para regenerar sitemap.xml) ----
  STATIC_PAGES: [
    { loc: '/',                          changefreq: 'weekly',  priority: '1.0' },
    { loc: '/auditorias.html',           changefreq: 'monthly', priority: '0.9' },
    { loc: '/incidencias.html',          changefreq: 'monthly', priority: '0.9' },
    { loc: '/dashboard.html',            changefreq: 'monthly', priority: '0.9' },
    { loc: '/industria-alimentaria.html',changefreq: 'monthly', priority: '0.8' },
    { loc: '/industria-general.html',    changefreq: 'monthly', priority: '0.8' },
  ],
};

// Origen de WordPress (para detectar imágenes a localizar: /wp-content/…)
export const WP_ORIGIN = new URL(config.WP_API_BASE).origin;
