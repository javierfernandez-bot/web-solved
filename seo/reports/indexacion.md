# Auditoría de indexación — 5 octubre 2026

Estado auditado: `main` en `abe3672` (incluye la fusión de 21 artículos duplicados,
PR #13, mergeada hoy durante esta misma auditoría), más 9 páginas puente nuevas
añadidas en esta misma rama tras cruzar el export real de Search Console
(sección 6). Verificado contra el repo, el sitio en vivo (`curl` a
`trysolved.com`) y el informe de Índice > Páginas de GSC.

## Resumen

| Comprobación | Resultado |
|---|---|
| Enlaces internos rotos (apuntan a un 404) | **0** |
| Enlaces internos a `.html` o `http://` | **0** |
| Páginas `noindex` sin explicación conocida | **0** de 67 (comprobado también contra las 27 que ve GSC: ninguna accidental) |
| Redirecciones en cadena (stub → stub) | **0** |
| `sitemap.xml` con URLs no canónicas/duplicadas | **0** (280 URLs, `check:seo` limpio) |
| `http://` y `www.` → `https://trysolved.com/` | **OK**, 301 real de GitHub Pages, un solo salto |
| De los 105 URLs no indexados en GSC | **9 huecos reales corregidos**; el resto es ruido de WordPress (`/feed/`, fragmentos de Elementor) sin arreglo razonable, o ya está cubierto y pendiente de recrawl |

`npm run check:seo` pasa limpio (`✔ Sin fallos`) sobre las 388 páginas HTML del
sitio. El resto de este informe detalla cómo se verificó cada punto; la
sección 6 tiene el cruce URL por URL contra Search Console.

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

## 6. Cruce contra el export real de Search Console

Conseguí acceso a Índice > Páginas de GSC (propiedad `sc-domain:trysolved.com`,
última actualización 21/9/26) y repasé las 7 categorías, 105 URLs, una a una.

| Motivo | Páginas | Qué había de verdad |
|---|---|---|
| No se ha encontrado (404) | 52 | Ver desglose abajo |
| Excluida por `noindex` | 27 | Las 27 coinciden con el mecanismo de puentes o con páginas legales/landing ya conocidas. Ninguna accidental. |
| Página con redirección | 11 | El `http://`→`https://`, el `www`→sin `www`, y 8 puentes conocidos. **Esto es el sistema funcionando como toca**, no un problema. |
| Página alternativa con canonical adecuada | 3 | Variantes de la home con parámetros de consulta (`?wpr_mega_menu=…`, `?zsG1…`) y `/index.html`. Google ya respeta el canonical. Sin acción. |
| Duplicada: sin canonical del usuario | 1 | `https://admin.qa.trysolved.com/` — **no es este repo**. Es el entorno QA de la app Solved, en otro subdominio, indexado porque esta propiedad GSC es de dominio completo. Hay que arreglarlo en la app (añadir `noindex` al entorno QA), no aquí. |
| Rastreada, sin indexar | 10 | Mezcla de rutas ya cubiertas con puentes (pendientes de recrawl) y artefactos WordPress sin valor (`__trashed-3`, fragmentos de Elementor). |
| Duplicada: Google eligió otro canonical | 1 | `/tipos-de-auditoria-de-calidad/` — es el propio puente de raíz; Google indiza el destino en vez de reconocer el refresh como redirección. Comportamiento esperado de un meta refresh, no arreglable sin un 301 real. |

### Los 52 "404": qué es ruido y qué corregí

La mitad larga son artefactos de WordPress que no tienen arreglo con una
redirección (y no deberían tenerlo):

- **~20 son `/feed/`**: cada post y categoría de WordPress generaba un RSS
  automático; esas URLs no tienen destino razonable y es correcto que
  desaparezcan.
- **`/fr/`, `/it/`, `/fr/histoire-a-succes/…`, `/storia-di-successo/`,
  `politique-de-cookies`**: el WordPress de `trysolved.es` tiene instalado
  **Polylang** (lo vi en la lista de plugins), así que es creíble que en algún
  momento hubiera versión francesa e italiana de verdad. No hay contenido
  actual al que redirigirlas — decide tú si se resucitan o se dejan morir.
- **`/assets/docs/Documento-integracion-1.pdf`, `/mega_menus/home/`,
  `/solved-en/`**: páginas o ficheros de la época WordPress sin equivalente
  conocido. Sin más contexto, no hay destino seguro al que mandarlas.
- **`/funcionalidades`, `/demo`, `/casos-de-exito`**: ya los rescata
  `404.html` del lado del cliente (alias a `/` o a `/#contacto`). Es una
  decisión de diseño ya tomada (rescate suave para quien navega, sin crear una
  página puente nueva); no la he tocado.

Y **9 eran huecos reales**, que ya corregí en `seo/redirects.json` (incluidos
en el commit de esta rama):

| URL que Google indexó | Redirige ahora a |
|---|---|
| `/incidencias-recurrentes/` | `/blog/incidencias-recurrentes/` (superviviente de la fusión de ayer, sin puente de raíz) |
| `/software-de-gestion-de-incidencias-guia-para-elegir/` | `/blog/software-de-gestion-de-incidencias-guia-para-elegir/` (ídem) |
| `/como-integrar-la-gestion-de-incidencias-erp-mes-gmao/` | `/blog/como-integrar-la-gestion-de-incidencias-erp-mes-gmao/` (el post existe, solo le faltaba el puente) |
| `/blog/trazabilidad-alimentaria` (sin barra final) | `/blog/trazabilidad-alimentaria-que-es-y-como-gestionarla-bien/` (slug antiguo, el post cambió de nombre) |
| `/blog/gestion-documental-calidad` | `/blog/gestion-documental-calidad-alimentaria-guia-practica-2026/` (mismo caso) |
| `/category/development/` | `/blog/` (mismo patrón que `category/uncategorized`) |
| `/homepage` | `/` |
| `/privacy-policy/` | `/en/politica-de-privacidad/` — **confianza baja**, es mi mejor suposición del equivalente en inglés, no una certeza |
| `/politique-de-cookies/` | `/en/politica-de-cookies/` — **misma reserva**, y encima en francés sin sitio en francés detrás |

Las dos últimas (`privacy-policy`, `politique-de-cookies`) son juicios míos,
no hechos verificados — si prefieres quitarlas o apuntarlas a otro sitio,
dímelo.

`npm run check:seo` sigue limpio después de añadir las 9 (`✔ Sin fallos`,
388 páginas, 280 URLs en el sitemap).

## Lo que sigue sin poder cerrarse desde el repo

1. **`admin.qa.trysolved.com` indexado.** No es parte de este repositorio;
   hace falta tocar la configuración de ese entorno (robots o `noindex`) desde
   donde se gestione la app, no la web.
2. **Si resucitar `/fr/` e `/it/` o dejarlos morir.** Decisión de negocio, no
   técnica.
3. **`/privacy-policy/` y `/politique-de-cookies/`**, señalados arriba como
   mis mejores suposiciones, pendientes de que las confirmes.
4. **27 `noindex` de GSC vs. 67 de aquí**: las 67 están justificadas, pero no
   puedo saber si Google ya vio el `noindex` del glosario en español (en la
   rama sin mergear `seo/integra-pendientes`) o si cuenta otras 27 distintas.
   Se aclarará solo cuando esa rama se mergee y Google recrawlee.
5. **"Enforce HTTPS"** lo verifiqué por su efecto (301 en vivo), no inspeccionando
   el ajuste directamente — no tengo acceso a Settings → Pages del repositorio.

## Cambios de esta tarea

Todo en la rama `seo/auditoria-indexacion` (sin mergear, a la espera de tu OK):

- `scripts/build-sitemap.mjs`: ya estaba corregido en el PR #13 de la fusión;
  esta rama solo lo hereda.
- `seo/redirects.json`: 9 páginas puente nuevas (ver tabla arriba).
- `seo/reports/indexacion.md`: este informe.

No se ha tocado contenido de ninguna página, tal y como pedías.
