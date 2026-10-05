# Auditoría de indexación — 5 octubre 2026

Estado auditado: `main` en `abe3672` (incluye la fusión de 21 artículos duplicados,
PR #13, mergeada hoy durante esta misma auditoría). Verificado contra el repo y
contra el sitio en vivo (`curl` a `trysolved.com`).

## Resumen

| Comprobación | Resultado |
|---|---|
| Enlaces internos rotos (apuntan a un 404) | **0** |
| Enlaces internos a `.html` o `http://` | **0** |
| Páginas `noindex` sin explicación conocida | **0** de 67 |
| Redirecciones en cadena (stub → stub) | **0** |
| `sitemap.xml` con URLs no canónicas/duplicadas | **0** (280 URLs, `check:seo` limpio) |
| `http://` y `www.` → `https://trysolved.com/` | **OK**, 301 real de GitHub Pages, un solo salto |

`npm run check:seo` pasa limpio (`✔ Sin fallos`) sobre las 379 páginas HTML del
sitio. El resto de este informe detalla cómo se verificó cada punto y qué
queda fuera de lo que el repo puede resolver por sí solo.

## 1. 404 con enlaces internos, noindex, cadenas

**404 con enlaces internos: ninguno.** `check:seo` resuelve cada `href`/`src` del
sitio igual que GitHub Pages (incluida la regla `/x` → `x.html` o `x/index.html`)
y no encontró ninguno que no exista. Esto es necesariamente parcial: solo detecta
enlaces que **parten de una página actual del sitio**. Las URLs de la época
WordPress que Google recuerda pero que ya no enlaza nadie desde dentro (la
inmensa mayoría de los "52 con 404" de Search Console, probablemente) no pueden
encontrarse así — hace falta el export de Índice > Páginas de GSC para tener la
lista exacta y compararla una a una contra `seo/redirects.json`. Ya pedí ese
export dos veces en esta conversación; sigo sin él. Lo que sí hice:

- Confirmé que las ~30 rutas heredadas de WordPress que ya se habían
  identificado (agosto 2026) siguen todas con su página puente funcionando
  (200 en vivo, `noindex, follow` + `canonical` al destino correcto).
- Probé a mano una decena de patrones típicos de WordPress no cubiertos
  (`/feed/`, `/wp-login.php`, `/category/sin-categoria/`, `/author/admin/`,
  `/tag/calidad/`, `/2024/01/`…): todos devuelven 404 real, no hay nada ahí
  rescatable sin saber si Google los tiene indexados de verdad.
- Hay un rescate del lado del cliente en `404.html` (mapea alias de página y
  cualquier slug con guion a `/blog/{slug}/`) que ayuda a una persona que
  llega con el navegador, pero **no cambia el código de estado que ve
  Googlebot** (sigue siendo 404 en la respuesta del servidor), así que no
  mueve la aguja en el informe de Cobertura de GSC. Para que una URL deje de
  contar como 404 ahí hace falta una entrada en `seo/redirects.json`.

**Páginas `noindex`: 67, las 67 clasificadas, ninguna accidental.**

| Categoría | Cuántas | Ejemplo |
|---|---|---|
| Páginas puente (`seo/redirects.json`, incluida la fusión de hoy) | 51 | `blog/kpis-de-calidad/` → `blog/7-kpis-de-control-de-calidad-que-si-importan/` |
| Stubs de raíz con mecanismo propio (no en el JSON, mismo patrón) | 6 | `incidencias.html`, `auditorias.html`, `dashboard.html`, `industria-alimentaria.html`, `industria-general.html`, `blog.html` |
| Legales (ES + EN), `noindex, follow` por decisión de negocio (ago-2026) | 7 | `politica-de-privacidad/`, `politica-de-cookies/`, `terminos-y-condiciones/`, sus 3 equivalentes en `/en/` y sus 2 stubs `.html` |
| Landing de campaña (no busca tráfico orgánico) | 1 | `blog/webinar-patatas-aguilar/` |
| Página de error | 1 | `404.html` |

No hay ninguna página de contenido real (post del blog, ficha de glosario, página
de producto) con `noindex` sin que yo sepa por qué. Si quisiera ver esto roto,
tendría que ser una entrada nueva que alguien añada a mano sin seguir el patrón.

**Redirecciones en cadena: ninguna.** Comprobé que ningún destino de
`seo/redirects.json` (51 entradas) apunta a su vez a otro stub: los 51 van
directos a una página canónica real. Mismo resultado para los 6 stubs de raíz.

## 2. Duplicados legacy (`/x.html` vs `/x/`)

**Ya resuelto, desde agosto 2026** (`fix/seo-arquitectura-urls`, documentado en
`DECISIONS.md`). Verificado hoy que se sostiene:

| Par | Canónica | `.html` |
|---|---|---|
| incidencias | `/incidencias/` (`index, follow`) | `/incidencias.html` (`noindex, follow`, refresh a la canónica) |
| auditorias | `/auditorias/` | `/auditorias.html` |
| dashboard | `/dashboard/` | `/dashboard.html` |
| industria-alimentaria | `/industria-alimentaria/` | `/industria-alimentaria.html` |
| industria-general | `/industria-general/` | `/industria-general.html` |
| blog | `/blog/` | `/blog.html` |
| política de privacidad / cookies | `/politica-de-privacidad/`, `/politica-de-cookies/` (ambas `noindex, follow` a propósito) | sus dos `.html` |

Los 7 stubs llevan `canonical` correcto, `noindex, follow`, `meta refresh` a 0 s
y el fallback de `location.replace`. Probados en vivo: los 6 primeros devuelven
200 y Google los trata como redirección permanente (así lo documenta
`DECISIONS.md`, al no haber Cloudflare delante para emitir un 301 real).

No quedan más pares `.html` / `/` sin resolver: grep sobre todo el árbol no
encontró ningún otro archivo `nombre.html` con una carpeta `nombre/` homónima.

## 3. Enlaces internos a `.html` o `http://`

**Cero.** `check:seo` ya valida esto como parte de su regla 4 ("páginas
canónicas que sigan enlazando a .html") y lo confirmé por separado con `grep`
sobre las 379 páginas: ningún `href` interno usa `.html` de las rutas migradas,
ninguno usa `http://trysolved.com` en vez de `https://`. No hubo nada que
corregir en este punto porque ya estaba limpio.

## 4. `sitemap.xml` solo URLs 200, indexables y canónicas

**Ya lo garantiza `check:seo`** (`STATIC_PAGES` en `scripts/config.mjs` solo
lista rutas canónicas; los posts se sacan de la lista real de WordPress, nunca
de un escaneo de disco que pudiera colar un stub). 280 URLs, sin duplicados, sin
`.html`, sin ninguna `noindex` ni stub colado. Probé en vivo una muestra
aleatoria de 20 URLs del sitemap: las 20 devuelven 200.

`robots.txt` ya referencia el sitemap (`Sitemap: https://trysolved.com/sitemap.xml`).

**Encontré y arreglé un bug mientras verificaba esto** (ver más abajo): el
generador manual `build:sitemap` no distinguía una página puente de
`blog/<slug>/` de un post real, así que si alguien lo ejecutaba a mano después
de fusionar artículos, colaba páginas puente en el sitemap. No afecta al
pipeline automático (que usa la lista de WordPress, no un escaneo de disco),
pero sí a cualquiera que ejecute `npm run build:sitemap` sin red. Corregido en
`scripts/build-sitemap.mjs` dentro de la fusión de hoy (PR #13).

## 5. HTTP → HTTPS, `www` → sin `www`

**Correcto, un único salto, 301 real de GitHub Pages:**

```
http://trysolved.com/      → 301 → https://trysolved.com/
https://www.trysolved.com/ → 301 → https://trysolved.com/
http://www.trysolved.com/  → 301 → https://trysolved.com/
```

Esto confirma que "Enforce HTTPS" está activo en la configuración de GitHub
Pages del repositorio y que el `CNAME` (`trysolved.com`) está bien resuelto.
No hace falta tocar nada: es un ajuste de la cuenta de GitHub, no algo que viva
en el repo, así que no hay cambio de código posible ni necesario aquí.

## Lo que no se pudo cerrar desde el repo

1. **La lista exacta de los ~105 URLs no indexados de GSC.** Sin el export de
   Índice > Páginas no puedo saber cuáles de los 52 "404" y 10 "rastreada sin
   indexar" ya están cubiertos por este trabajo (los 21 recién fusionados, o
   los ~30 ya existentes) y cuáles son rutas que todavía no conozco. Pégame o
   sube ese CSV y cruzo la lista entrada por entrada.
2. **27 páginas marcadas `noindex` en GSC.** Las 67 `noindex` de aquí están
   todas justificadas, pero no sé si coinciden con las 27 que ve Search
   Console: puede haber solape con el glosario en español (40 fichas, pendiente
   de pasar a `noindex` en la rama sin mergear `seo/integra-pendientes`, que
   reduciría further el recuento de indexadas-pero-no-deseadas), o puede haber
   URLs que GSC marca `noindex` por una señal que no sale de este repo (una
   cabecera `X-Robots-Tag`, por ejemplo, que no uso en ningún punto del
   pipeline y que tendría que venir de GitHub Pages o de algo externo).
3. **"Enforce HTTPS" en sí** solo lo pude verificar por su efecto (el 301 en
   vivo), no inspeccionando el ajuste directamente — no tengo acceso a la
   pestaña Settings → Pages del repositorio desde aquí.

## Cambios de esta tarea

Todo en la rama `seo/auditoria-indexacion` (sin mergear, a la espera de tu OK):

- `scripts/build-sitemap.mjs`: ya estaba corregido en el PR #13 de la fusión;
  esta rama solo lo hereda.
- `seo/reports/indexacion.md`: este informe.

No se ha tocado contenido de ninguna página, tal y como pedías.
