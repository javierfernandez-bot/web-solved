# Web Solved 3.0 — copia local, sin publicar

Réplica de `/home/javi/web solved 2.0` (commit `be0553a`) para trabajar la
versión 3.0 sin tocar producción. **Esta carpeta no puede publicar nada**: se le
quitaron los tres cables que la conectaban al sitio en marcha. Desde el 7 de
septiembre de 2026 tiene remoto propio —`javifer31/web-solved-3`, privado, sin
Pages y sin CNAME—, así que el trabajo se respalda en GitHub sin que nada de lo
que se suba llegue a `trysolved.com`.

| Qué | Estado en la 3.0 | Por qué |
|---|---|---|
| `git remote origin` | **repo privado propio** | Ya no apunta a `javierfernandez-bot/web-solved` —el repo desde el que GitHub Pages sirve `trysolved.com`—, sino a `javifer31/web-solved-3`, **privado y sin Pages**. Un `push` sube el trabajo pero no publica nada. |
| `CNAME` | **borrado** | Es el fichero que ata GitHub Pages al dominio `trysolved.com`. Si algún día se publica esta carpeta en otro repo, sin CNAME no reclama el dominio. |
| Crons de `.github/workflows/blog.yml` | **comentados** | Quedan `workflow_dispatch` (botón manual). Así, si se sube a un repo nuevo, no se pone a regenerar el blog y a commitear solo antes de tiempo. |

## La preview pública

Desde el 7 de septiembre de 2026 hay una copia navegable en
**https://javifer31.github.io/**, para poder enseñar la 3.0 sin este ordenador
delante. **No es el sitio**: es una copia generada con `npm run build:preview`,
que sale a `../web-solved-3-preview` y se sube a `javifer31/javifer31.github.io`.
No se edita a mano — se regenera y se vuelve a subir.

Se diferencia del original en lo que hace falta para no hacerle daño a
trysolved.com, y conviene no deshacerlo:

- **Las 696 páginas llevan `noindex,nofollow`.** El sitio trae sus propios
  `<meta name="robots">` —440 con `index, follow`—, así que el script los
  **sustituye**; saltárselos porque «ya tienen robots» deja la copia indexable.
- **Sin `canonical`, `hreflang` ni `og:url`.** Apuntaban a `trysolved.com`, y un
  `noindex` sobre una página cuyo canonical señala a producción puede propagar
  el `noindex` al destino, es decir, a las páginas vivas.
- **Sin `sitemap.xml` ni `llms.txt`**, y sin la documentación interna (CLAUDE.md,
  DECISIONS, `guidelines/`, `seo/`) ni el material de montaje de los vídeos.
- El `robots.txt` **permite** el rastreo a propósito: un `Disallow` escondería el
  `noindex` y la URL podría indexarse igual, vacía.
- **Abre con una pantalla de contraseña**, `solved-cabf6a`. Se cambia con
  `PREVIEW_PASS=… npm run build:preview` y volviendo a subir la copia.

**La contraseña es una cortina, no una cerradura**, y conviene no venderla como
otra cosa: el sitio es estático, así que la comprobación ocurre en el navegador
de quien mira y se salta con las herramientas de desarrollo o con `curl`; y el
repo de la preview es público, así que el HTML se lee en GitHub sin pasar por
ella. Sirve para que quien llegue de casualidad a la URL no vea el borrador. Si
hace falta cerrar de verdad —enseñársela a un cliente, por ejemplo— la preview
tiene que salir de GitHub Pages a un sitio con autenticación de servidor
(Cloudflare Pages o Netlify), sirviendo desde el repo privado.

El repo de la preview es público —los sitios de usuario de GitHub no pueden ser
privados—, así que ahí no va nada que no pueda verse.

El historial de git **sí** se conserva entero (las tres ramas y todos los
commits), por si hace falta mirar atrás o traerse algo de la 2.0.

## Lo que sigue funcionando igual

```
npm run serve          # servidor local que imita a GitHub Pages (con Range, para los <video>)
npm run check:seo      # auditoría: enlaces rotos, assets, canonicals, JSON-LD, stubs, sitemap
npm run build:blog     # regenera /blog desde la WP REST API de trysolved.es
npm run build:sitemap  # sitemap desde disco, sin red
npm run build:redirects / build:enlaces
```

`node_modules` viene copiado, así que no hace falta `npm ci` para arrancar.

## Pendiente para el día que se publique

1. Decidir dónde vive: repo nuevo, o rama del actual. Si es repo nuevo, hay que
   crear el remoto y darle acceso (ojo con las dos cuentas de GitHub: el token
   de `javierfernandez-bot` no tiene scope `workflow`, así que los commits que
   toquen `.github/workflows/*` hay que subirlos con `javifer31`).
2. Restaurar el `CNAME` con `trysolved.com` **solo** cuando la 3.0 vaya a
   sustituir a la 2.0, y apagar Pages en el repo viejo para que no se peleen.
3. Descomentar `repository_dispatch` y `schedule` en `blog.yml`.
4. Revisar que los `canonical` y el `sitemap.xml` sigan apuntando a
   `https://trysolved.com/` (hoy lo hacen: son los de la 2.0 tal cual).
5. Reenviar el sitemap a Search Console.
6. ~~Sustituir las maquetas de las escenas de producto por capturas reales.~~
   **Resuelto el 14 de agosto de 2026, y al revés de como estaba escrito aquí.**
   Las pantallas se construyen en HTML —decisión del cliente, para poder
   ajustar el contenido sobre lo que ve— y no con capturas. Están las cuatro
   que faltaban (listado de incidencias en móvil, listado de acciones, un
   registro cumplimentado en tablet y el dashboard), en `ds/app.css`, con la
   estética y los datos del tour de `/incidencias/`. Ya no queda `<style>`
   provisional en `index.html` y se puede publicar con ellas.

   Lo que sí queda por confirmar con el cliente antes de publicar, porque se
   puso a ojo y sale escrito en pantalla: la dirección de la barra del
   navegador (`app.trysolved.com/dashboard`, se cambia con `--device-url`) y
   que el dashboard viva bajo **Informes** en el menú lateral, que es el único
   sitio del menú real donde encaja.

## Ojo mientras se trabaja en local

Los HTML de raíz usan **rutas absolutas** (`/assets/…`, `/solved.css`), así que
hay que verlos con `npm run serve`, no abriendo el fichero con doble clic.
