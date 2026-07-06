---
name: revision-seguridad-web
description: >-
  Revisión de ciberseguridad para sitios web estáticos (HTML/JS/CSS, tipo
  GitHub Pages / Netlify / Vercel). Úsala cuando el usuario pida "revisar la
  seguridad", "buscar vulnerabilidades", "hardening", "auditoría de seguridad"
  o "corregir fallos de seguridad" de una web estática. Cubre XSS de DOM,
  secretos filtrados, tabnabbing, mixed content, integridad de terceros (SRI),
  cabeceras de seguridad y CSP.
---

# Revisión de seguridad · web estática

Auditoría reproducible para sitios estáticos (sin backend propio). El objetivo
es encontrar y corregir vulnerabilidades **reales** sin romper terceros
(formularios embebidos, vídeos, mapas, analítica).

## 0. Contexto antes de tocar nada
- Identifica el hosting: GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3…
  Determina si puedes servir **cabeceras HTTP reales** o solo `<meta>`.
  - GitHub Pages puro: **no** sirve cabeceras personalizadas → solo valen
    `<meta http-equiv="Content-Security-Policy">` y `<meta name="referrer">`.
    El resto (HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy)
    exige un proxy/CDN delante (Cloudflare) o migrar de host.
  - Netlify/Vercel/Cloudflare: usa `_headers`, `netlify.toml`, `vercel.json`
    o Transform Rules.
- Inventaria los **dominios de terceros** que la web necesita (para no romperlos
  con la CSP):
  `grep -rIohE 'https://[a-zA-Z0-9.-]+' --include=*.html --include=*.js --include=*.css . | sed -E 's#(https://[^/"]+).*#\1#' | sort | uniq -c | sort -rn`

## 1. Barrido de vulnerabilidades (grep)

**Secretos / claves filtradas** (crítico):
```
grep -rInE 'api[_-]?key|secret|token|password|bearer|AIza[0-9A-Za-z_-]{20}|sk-[a-zA-Z0-9]{20}' --include=*.html --include=*.js . | grep -vi node_modules
```

**XSS de DOM** — sumideros peligrosos con datos potencialmente controlables:
```
grep -rInE 'innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function' --include=*.js --include=*.html . | grep -vi node_modules
```
Regla: un `innerHTML` solo es seguro si el string es **estático** o proviene de
constantes del propio código. Es vulnerable si mezcla `location.hash/search/href`,
`URLSearchParams`, `document.referrer`, `postMessage`, `localStorage` o respuestas
de red sin sanear. Revisa también:
```
grep -rInE 'location\.(hash|search|href)|URLSearchParams|document\.referrer|postMessage' --include=*.js . | grep -vi node_modules
```

**Tabnabbing** — `target="_blank"` debe llevar `rel="noopener"` (idealmente
`noopener noreferrer`):
```
grep -rIn 'target="_blank"' --include=*.html . | grep -vi node_modules | grep -v 'noopener'
```

**Mixed content / degradación** — recursos y enlaces por `http://`:
```
grep -rInE '(src|href)="http://' --include=*.html --include=*.css . | grep -vi node_modules
```

**Terceros sin SRI** — todo `<script src="https://cdn…">` de terceros debería
llevar `integrity=` + `crossorigin`:
```
grep -rInE '<script[^>]*src="https?://' --include=*.html . | grep -vi node_modules
```
(Scripts embebidos dinámicamente por SDKs oficiales —HubSpot, YouTube— no admiten
SRI; se cubren restringiéndolos por dominio en la CSP.)

**Handlers inline y `javascript:`** (dificultan la CSP y abren XSS):
```
grep -rInE 'on(click|error|load|submit|mouseover)=|href="javascript:' --include=*.html . | grep -vi node_modules
```

**Fugas en el repo**: que `.gitignore` excluya `.env`, credenciales y que no
haya `.env`, `*.pem`, `id_rsa`, backups o sourcemaps con rutas sensibles.

## 2. Correcciones (de menor a mayor riesgo de romper algo)
1. **Sin riesgo**: `http://`→`https://`; añadir `rel="noopener noreferrer"`;
   quitar secretos; añadir SRI a CDNs de terceros estáticos.
2. **Bajo riesgo**: `<meta name="referrer" content="strict-origin-when-cross-origin">`.
3. **Riesgo medio (probar en preview)**: CSP. En sitio con formularios/vídeos de
   terceros, aplícala **primero permisiva** y ajústala mirando la consola. En
   estático no hay nonces por petición: si hay `<script>` inline propios, o los
   externalizas, o usas `'unsafe-inline'` (debilita la CSP) o hashes SHA-256.

### Plantilla de CSP (marketing estático con HubSpot + YouTube + Google Fonts)
Ajusta la lista de dominios al inventario del paso 0. `upgrade-insecure-requests`
fuerza https en subrecursos.
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://*.hsforms.net https://*.hsforms.com https://*.hs-scripts.com https://*.hscollectedforms.net https://*.hs-analytics.net https://*.hubspot.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
img-src 'self' data: https:;
frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com https://*.hsforms.com https://*.hsforms.net;
connect-src 'self' https://*.hsforms.com https://*.hubspot.com https://*.hs-analytics.net https://*.hscollectedforms.net;
object-src 'none'; base-uri 'self'; form-action 'self' https://*.hsforms.com;
upgrade-insecure-requests;
```
`frame-ancestors` (anti-clickjacking) **no** funciona vía `<meta>`: requiere
cabecera real (`Content-Security-Policy: frame-ancestors 'self'` o
`X-Frame-Options: DENY`) en el CDN/host.

### Cabeceras recomendadas (cuando el host las permita)
```
Content-Security-Policy: <la de arriba, + frame-ancestors 'self'>
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
X-Frame-Options: DENY
```

## 3. Verificación
- Carga las páginas tocadas y revisa la **consola** por bloqueos de CSP.
- Prueba los flujos de terceros: **enviar el formulario de HubSpot**, reproducir
  el vídeo, cargar el mapa. Si algo se bloquea, añade el dominio exacto que
  aparezca en la consola (`Refused to … because it violates …`).
- Comprobación externa opcional: `securityheaders.com`, `observatory.mozilla.org`.

## Criterio
No inventes vulnerabilidades para "rellenar". En un sitio estático bien hecho lo
normal es que los hallazgos sean **falta de cabeceras** y detalles menores; dilo
con claridad en vez de exagerar el riesgo.
