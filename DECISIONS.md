# Decisiones — corrección de arquitectura SEO (rama `fix/seo-arquitectura-urls`)

Agosto 2026. Registro de lo que hubo que decidir sin poder consultarlo, y por
qué. Criterio general: ante la duda, la opción que menos cambia el sitio.

---

## Infraestructura

**No hay Cloudflare delante, así que los stubs se quedan.**
`dig trysolved.com` devuelve `185.199.108-111.153` (las IPs de GitHub Pages,
directo) y los NS son de Namecheap. Las menciones a Cloudflare en `SECURITY.md`
son una recomendación pendiente, no algo montado. Sin proxy no hay forma de
emitir un 301 real, así que las redirecciones son stubs con `meta refresh`
instantáneo + `canonical` + `noindex, follow`, que Google consolida como
redirección permanente. **Si algún día se monta Cloudflare**, migrar estos
stubs a Bulk Redirects o a un Worker con 301 auténticos y borrarlos.

**`chrome.js` conserva su prefijo `ROOT`.**
Deriva la raíz de la URL del propio script para que el sitio funcione también en
`javierfernandez-bot.github.io/web-solved/`. Se han cambiado los destinos
(`ROOT + 'incidencias/'` en vez de `ROOT + 'incidencias.html'`) pero no el
mecanismo. Absolutizarlo habría roto esa vista previa sin ganar nada.

---

## Convención de URLs

**Se migran también las dos páginas legales**, aunque son `noindex` y no
aportan SEO, para no dejar dos convenciones conviviendo en la raíz. Estrenan
`canonical` (no lo tenían) y siguen `noindex, follow`.

**`/incidencias/` cambia de sentido.** Existía como stub apuntando a
`/incidencias.html` porque Google la tenía indexada con miles de impresiones
pese a no existir. Ahora es la página real y el stub va en `/incidencias.html`.
Es la dirección correcta: consolida en la URL que Google ya conocía.

**blog/ y glosario/ mantienen enlaces relativos** (`../../incidencias/`) en vez
de absolutos. Son ficheros que regenera el pipeline en cada rebuild, las rutas
relativas ya son correctas para su profundidad, y así siguen funcionando en la
project page de github.io. Las páginas de raíz sí van absolutas.

**El generador se actualiza a la vez que el contenido.** `blog.yml` corre tres
veces al día y hace push a `main`; si solo se hubieran tocado los HTML, el
primer rebuild habría deshecho todo. Se han actualizado los mapas de destinos
(`scripts/lib/links.mjs`), la miga de pan (`scripts/lib/templates.mjs`), la
lista de estáticas (`scripts/config.mjs`), `llms.txt` y el rescate de
`404.html`.

**Guarda anti-bucle nueva en `404.html`.** El mapa de rescate ahora apunta a
`/incidencias/`, que es la propia ruta canónica. Si esa carpeta llegara a
faltar, el 404 rebotaría contra sí mismo indefinidamente; se ha añadido una
comprobación de que el destino no sea la ruta que ya se está pidiendo.

---

## Rutas de assets

**Solo se absolutizan las páginas de raíz** (las 7 movidas, `index.html`,
`404.html` y `no-conformidades/`). En `blog/` y `glosario/` las rutas relativas
son correctas y, sobre todo, dentro de `/blog/` la ruta `assets/` apunta a
`/blog/assets/`, que es **otra carpeta** con las imágenes de los posts:
reescribirlas a ciegas a `/assets/` habría roto las portadas.

**`solved.css` no se toca.** Su `url(assets/fonts/…)` se resuelve contra la URL
de la hoja de estilos, no contra la de la página, así que nunca le afectó la
barra final. Además la cargan también blog y glosario, donde conviene que siga
siendo relativa.

---

## Páginas legacy

**No había ninguna en la raíz.** El candidato que se sospechaba,
`normas-y-estandares-de-calidad`, es un post del blog
(`/blog/normas-y-estandares-de-calidad/`), no una página suelta. Ningún slug del
blog colisiona con una página estática.

**Sí aparecieron dos restos reales de la etapa WordPress**, que se han
arreglado aunque no estaban en el encargo:

- `/blog.html` (el blog viejo embebido en un iframe) se borró al montar el blog
  headless y quedó en 404 estando indexada → stub hacia `/blog/`.
- Cinco posts hotlinkean su banner de webinar contra
  `https://trysolved.com/wp-content/uploads/…`, dominio que hoy sirve el sitio
  estático: las cinco imágenes dan 404. El build ya intentaba localizarlas pero
  la descarga fallaba y dejaba el hotlink. `images.mjs` reapunta ahora esas URLs
  a `WP_ORIGIN` antes de descargar. **Los cinco HTML se corrigen solos en el
  próximo `npm run build:blog`**, que necesita red contra `trysolved.es`.

---

## Sitemap

**Se extiende el generador que ya existía** en vez de crear uno nuevo: el
sitemap lo reescribe `npm run build:blog` en cada rebuild, así que un XML a mano
habría durado hasta el día siguiente. Se ha añadido además
`scripts/build-sitemap.mjs` (`npm run build:sitemap`), que lo regenera leyendo
el disco, sin red, para cuando se toca el glosario o una página estática y no
toca reconstruir el blog.

**`<lastmod>` real, no la fecha de hoy**: los posts usan el `dateModified` que
WordPress dejó incrustado en su JSON-LD; el resto de páginas, la fecha del
último commit que tocó su `index.html`.

**Fuera del sitemap**: los stubs `.html`, las dos páginas legales (`noindex`) y
`/blog/page/2..7/` (paginación del índice). La paginación nunca estuvo en el
sitemap; se deja igual para no cambiar lo que Google ya rastrea. Los posts se
alcanzan desde el índice y desde el propio sitemap.

**`robots.txt` no necesitaba cambios**: ya enlaza el sitemap, permite el rastreo
completo y no bloquea assets. Los stubs no se bloquean a propósito: si se
excluyeran por robots, Google no podría leer su `noindex` ni su `canonical`.

---

## Pendiente de confirmación humana

**⚠️ La razón social aparece escrita de dos formas distintas en el repo:**

| Fuente | Dice |
|---|---|
| `politica-de-privacidad/index.html` (con CIF B05424866) | **Voltstone** Technology Services, S.L. |
| `llms.txt` y el JSON-LD de la home | **VOLSTONE** TECHNOLOGY SERVICES S.L. |

Se ha usado **VOLSTONE** en el JSON-LD, que es lo que ya había y lo que se
decidió al arrancar, pero la página legal —que lleva el CIF y es la que tiene
valor jurídico— dice *Voltstone*. Conviene comprobarlo en el Registro Mercantil
y unificar las tres fuentes. No se ha cambiado ningún texto legal.

**⚠️ El domicilio también difiere:** el JSON-LD y `llms.txt` dicen «Edificio
Angels, Carrer del Port 13, 46024 Valencia»; la política de privacidad dice
«Calle Utiel 58, bajo, 46901 Torrent (Valencia)». Se ha mantenido el del
JSON-LD por no tocar nada, pero uno de los dos está desactualizado.
