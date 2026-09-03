// =========================================================
// Configuración del generador del blog (WordPress headless → estático)
// WordPress (CMS/API) vive en trysolved.es; el sitio estático publicado es
// trysolved.com. Si mueves WordPress, cambia WP_API_BASE aquí o por entorno:
//   WP_API_BASE=https://otro-dominio/wp-json/wp/v2 npm run build:blog
// =========================================================

export const config = {
  // ---- Origen de datos (WordPress REST API) ----
  WP_API_BASE: process.env.WP_API_BASE || 'https://trysolved.es/wp-json/wp/v2',

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

  ASSET_VERSION: '20260803a',      // ?v= para cache-busting de CSS/JS (igual que el resto del sitio)

  // ---- Identidad para SEO / JSON-LD ----
  ORG: {
    name: 'Solved',
    legalName: 'VOLTSTONE TECHNOLOGY SERVICES S.L.',
    url: 'https://trysolved.com/',
    logo: 'https://trysolved.com/assets/logotipo-solved.webp',
    twitter: '@solved',
    sameAs: [
      'https://www.linkedin.com/company/trysolved',
      'https://www.youtube.com/@trysolved',
    ],
  },

  // ---- Páginas estáticas del sitio (para regenerar sitemap.xml) ----
  // Solo URLs canónicas: /ruta/ sin extensión, nunca los stubs .html ni las
  // páginas noindex (las dos legales). El lastmod lo pone el generador.
  STATIC_PAGES: [
    { loc: '/',                                    changefreq: 'weekly',  priority: '1.0' },
    { loc: '/auditorias/',                         changefreq: 'monthly', priority: '0.9' },
    { loc: '/incidencias/',                        changefreq: 'monthly', priority: '0.9' },
    { loc: '/no-conformidades/',                   changefreq: 'monthly', priority: '0.9' },
    { loc: '/dashboard/',                          changefreq: 'monthly', priority: '0.9' },
    { loc: '/industria-alimentaria/',              changefreq: 'monthly', priority: '0.8' },
    { loc: '/industria-general/',                  changefreq: 'monthly', priority: '0.8' },
    { loc: '/software-appcc/',                     changefreq: 'monthly', priority: '0.8' },
    { loc: '/software-iso-22000/',                 changefreq: 'monthly', priority: '0.8' },
    { loc: '/homologacion-de-proveedores/',        changefreq: 'monthly', priority: '0.8' },
    { loc: '/glosario/',                           changefreq: 'weekly',  priority: '0.7' },
  ],
};

// Origen de WordPress (para detectar imágenes a localizar: /wp-content/…)
export const WP_ORIGIN = new URL(config.WP_API_BASE).origin;
