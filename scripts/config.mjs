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
    { loc: '/software-certificaciones/',            changefreq: 'monthly', priority: '0.8' },
    { loc: '/homologacion-de-proveedores/',        changefreq: 'monthly', priority: '0.8' },
    { loc: '/glosario/',                           changefreq: 'weekly',  priority: '0.7' },

    // ---- Versión en inglés (/en/…), mismos slugs ----
    // El glosario en inglés se mantiene indexable: la consolidación de
    // sep-2026 solo afecta a las fichas en español (ver glosario/*/index.html).
    { loc: '/en/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/en/auditorias/', changefreq: 'monthly', priority: '0.9' },
    { loc: '/en/incidencias/', changefreq: 'monthly', priority: '0.9' },
    { loc: '/en/no-conformidades/', changefreq: 'monthly', priority: '0.9' },
    { loc: '/en/dashboard/', changefreq: 'monthly', priority: '0.9' },
    { loc: '/en/industria-alimentaria/', changefreq: 'monthly', priority: '0.8' },
    { loc: '/en/industria-general/', changefreq: 'monthly', priority: '0.8' },
    { loc: '/en/glosario/', changefreq: 'weekly', priority: '0.7' },
    { loc: '/en/glosario/accion-correctiva-y-preventiva-capa/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/alergenos/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/analisis-de-causa-raiz/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/appcc-haccp/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/auditoria-de-calidad/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/auditoria-interna/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/brcgs/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/contaminacion-cruzada/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/control-de-proceso/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/control-estadistico-de-proceso-spc/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/ficha-tecnica-de-producto/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/fssc-22000/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/gestion-documental/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/gfsi/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/ifs-food/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/indicadores-de-no-calidad/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/inocuidad-alimentaria/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/inspeccion-de-recepcion/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/iso-22000/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/kpi-de-produccion/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/liberacion-de-producto/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/loteo-codificacion-de-lote/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/materia-prima/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/mejora-continua-kaizen/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/mermas/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/mes/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/no-conformidad/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/oee/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/plan-de-limpieza-y-desinfeccion-ld/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/prerrequisitos-ppr/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/punto-de-control-critico-pcc/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/reclamacion-a-proveedor/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/registro-de-calidad/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/retirada-de-producto-recall/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/seguridad-alimentaria/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/trazabilidad-alimentaria/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/trazabilidad-ascendente-y-descendente/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/trazabilidad-de-envase/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/trazabilidad-de-lote/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/en/glosario/vida-util-shelf-life/', changefreq: 'monthly', priority: '0.6' },
  ],
};

// Origen de WordPress (para detectar imágenes a localizar: /wp-content/…)
export const WP_ORIGIN = new URL(config.WP_API_BASE).origin;
