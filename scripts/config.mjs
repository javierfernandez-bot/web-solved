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

  ASSET_VERSION: '20260716a',      // ?v= para cache-busting de CSS/JS (igual que el resto del sitio)

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
    { loc: '/no-conformidades/',         changefreq: 'monthly', priority: '0.9' },
    { loc: '/dashboard.html',            changefreq: 'monthly', priority: '0.9' },
    { loc: '/industria-alimentaria.html',changefreq: 'monthly', priority: '0.8' },
    { loc: '/industria-general.html',    changefreq: 'monthly', priority: '0.8' },
    { loc: '/glosario/',                 changefreq: 'weekly',  priority: '0.7' },
    { loc: '/glosario/accion-correctiva-y-preventiva-capa/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/alergenos/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/analisis-de-causa-raiz/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/appcc-haccp/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/auditoria-de-calidad/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/auditoria-interna/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/brcgs/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/contaminacion-cruzada/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/control-de-proceso/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/control-estadistico-de-proceso-spc/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/ficha-tecnica-de-producto/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/fssc-22000/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/gestion-documental/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/gfsi/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/ifs-food/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/indicadores-de-no-calidad/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/inocuidad-alimentaria/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/inspeccion-de-recepcion/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/iso-22000/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/kpi-de-produccion/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/liberacion-de-producto/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/loteo-codificacion-de-lote/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/materia-prima/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/mejora-continua-kaizen/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/mermas/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/mes/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/no-conformidad/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/oee/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/plan-de-limpieza-y-desinfeccion-ld/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/prerrequisitos-ppr/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/punto-de-control-critico-pcc/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/reclamacion-a-proveedor/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/registro-de-calidad/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/retirada-de-producto-recall/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/seguridad-alimentaria/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/trazabilidad-alimentaria/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/trazabilidad-ascendente-y-descendente/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/trazabilidad-de-envase/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/trazabilidad-de-lote/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/glosario/vida-util-shelf-life/', changefreq: 'monthly', priority: '0.6' },
  ],
};

// Origen de WordPress (para detectar imágenes a localizar: /wp-content/…)
export const WP_ORIGIN = new URL(config.WP_API_BASE).origin;
