# Auditoría de seguridad · web solved 2.0

Revisión de ciberseguridad del sitio estático (GitHub Pages, `trysolved.com`).
Proceso reutilizable en `.claude/skills/revision-seguridad-web/`.

## Resumen
Postura de seguridad **buena** para un sitio estático. No se encontraron
vulnerabilidades críticas: **sin** secretos/API keys en el código, **sin**
`eval`/`document.write`, **sin** XSS de DOM (los `innerHTML` de `chrome.js` usan
strings estáticos y `ROOT` derivado de `document.currentScript.src`, no de
entrada de usuario), y **sin** scripts de terceros sin control (HubSpot se
inyecta desde su dominio oficial `js.hsforms.net`).

## Corregido (aplicado en este cambio)
| Hallazgo | Severidad | Acción |
|---|---|---|
| 3 enlaces `target="_blank"` con solo `rel="noopener"` en `index.html` | Baja | Añadido `noreferrer` |
| Enlace `http://www.allaboutcookies.org` en `politica-de-cookies.html` | Baja | `https://` + `rel="noopener noreferrer"` |

## Pendiente — cabeceras de seguridad (requiere acción de hosting)
GitHub Pages **no sirve cabeceras HTTP personalizadas**. Solo la CSP y
`Referrer-Policy` pueden entregarse vía `<meta>`. El resto (HSTS,
X-Frame-Options, X-Content-Type-Options, Permissions-Policy) necesita un
proxy/CDN delante (p. ej. Cloudflare por delante de `trysolved.com`) o migrar de
host.

### Opción A — CSP vía `<meta>` (única aplicable en GitHub Pages puro)
Añadir en el `<head>` de las 80 páginas. Permisiva a propósito para **no romper**
HubSpot / YouTube / Google Fonts. Requiere `'unsafe-inline'` en `script-src`
porque `glosario/index.html` tiene un `<script>` inline (alternativa: externalizarlo
y endurecer la CSP).

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://*.hsforms.net https://*.hsforms.com https://*.hs-scripts.com https://*.hscollectedforms.net https://*.hs-analytics.net https://*.hubspot.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com https://*.hsforms.com https://*.hsforms.net; connect-src 'self' https://*.hsforms.com https://*.hubspot.com https://*.hs-analytics.net https://*.hscollectedforms.net; object-src 'none'; base-uri 'self'; form-action 'self' https://*.hsforms.com; upgrade-insecure-requests">
```
> ⚠️ Tras aplicarla, **verificar en producción/preview** que el formulario de
> HubSpot envía, que el vídeo de YouTube carga y que el mapa funciona. Cualquier
> bloqueo aparece en consola como `Refused to … violates … Content-Security-Policy`;
> se resuelve añadiendo el dominio exacto.

### Opción B — Cabeceras reales vía Cloudflare (recomendado)
Si `trysolved.com` va (o puede ir) detrás de Cloudflare, configurar en
*Transform Rules → Modify Response Header* o en un Worker. Da protección
completa, incluido anti-clickjacking (`frame-ancestors`), imposible vía `<meta>`.

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://*.hsforms.net https://*.hsforms.com https://*.hs-scripts.com https://*.hscollectedforms.net https://*.hs-analytics.net https://*.hubspot.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com https://*.hsforms.com https://*.hsforms.net; connect-src 'self' https://*.hsforms.com https://*.hubspot.com https://*.hs-analytics.net https://*.hscollectedforms.net; object-src 'none'; base-uri 'self'; form-action 'self' https://*.hsforms.com; frame-ancestors 'self'; upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
X-Frame-Options: DENY
```

## Verificación externa
`https://securityheaders.com/?q=trysolved.com` · `https://observatory.mozilla.org`
