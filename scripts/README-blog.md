# Blog headless (WordPress → estático)

El blog se escribe en **WordPress** (solo como CMS) y se publica como **páginas
estáticas** bajo `trysolved.com/blog/`, con el HTML, CSS y SEO del propio sitio.
WordPress nunca se ve: solo se consume su REST API en *build time*.

```
WordPress (CMS/API)  ──fetch──►  scripts/build-blog.mjs  ──►  /blog/**  (estático)
```

## Cómo añadir un post nuevo

1. **Publica el post en WordPress** como siempre (título, contenido, imagen
   destacada, categoría). Cuida el **slug** y el **extracto** (de ahí salen la
   URL y la meta description).
2. **Regenera el blog**:
   ```bash
   npm run build:blog
   ```
3. **Revisa** el resultado en `/blog/` y sube los cambios:
   ```bash
   git add blog sitemap.xml
   git commit -m "blog: nuevos posts"
   git push
   ```
   GitHub Pages publica automáticamente al hacer push a `main`.

> La primera ejecución descarga y optimiza todas las imágenes (puede tardar un
> par de minutos). Las siguientes son rápidas: se cachean en `.cache/`.

## Qué hace el build

- Pagina **todos** los posts de la WP API (`per_page=100` + `X-WP-TotalPages`)
  con `?_embed` (imagen destacada, autor, categorías/tags en una sola llamada).
- **Limpia** el HTML de WordPress: fuera clases `wp-*`, estilos inline, ids y
  wrappers de bloques; solo queda contenido semántico.
- **Optimiza imágenes**: descarga las de `wp-content`, genera **WebP + AVIF** en
  varios anchos (`<picture>` + `loading="lazy"` + `width/height`) y un **JPG** de
  respaldo para `og:image`. Cero hotlink a WordPress.
- **SEO por post**: `<title>`, meta description, canonical, Open Graph + Twitter
  Cards y **JSON-LD `BlogPosting`** (+ `BreadcrumbList`). El índice lleva `Blog`.
- Regenera **`sitemap.xml`** (páginas estáticas + índice + cada post).
- Es **idempotente**: limpia y regenera `/blog` en cada ejecución.

## Configuración

Todo en `scripts/config.mjs`. Lo más importante:

| Variable | Para qué |
|---|---|
| `WP_API_BASE` | URL de la WP API. Hoy `https://trysolved.com/wp-json/wp/v2`. **El día que muevas WordPress a un subdominio** (p. ej. `cms.trysolved.com`), cámbiala — o pásala por entorno: `WP_API_BASE=https://cms.trysolved.com/wp-json/wp/v2 npm run build:blog` |
| `SITE_URL` | Base canónica del sitio publicado (`https://trysolved.com`). |
| `POSTS_PER_PAGE` | Posts por página del índice. |
| `IMAGE_WIDTHS` | Anchos responsive que se generan. |

## Automatización (opcional)

Hay un workflow listo en `.github/workflows/blog.yml` (desactivado por defecto en
la práctica: solo corre a mano o por cron). Reconstruye el blog y commitea los
cambios sin que tengas que ejecutarlo localmente. Actívalo cuando estés contento
con el resultado manual.

## Estructura

```
scripts/
  config.mjs            # configuración
  build-blog.mjs        # orquestador
  lib/
    wp.mjs              # fetch + normalización de la WP API
    images.mjs          # descarga + WebP/AVIF/JPG (sharp) + <picture>
    sanitize.mjs        # limpieza del HTML de WordPress (cheerio)
    templates.mjs       # plantillas HTML (post + índice) y SEO/JSON-LD
    sitemap.mjs         # regeneración de sitemap.xml
```
