# Canibalización glosario vs. blog — 7 consultas de esta tanda

5 octubre 2026. Para las 7 consultas del encargo (ifs food, ficha tecnica,
gfsi, prerrequisitos, iso 22000, retirada de producto, trazabilidad
alimentaria), cada una tiene **dos páginas candidatas**: una ficha de
glosario y un artículo de blog. Antes de tocar contenido, comprobé si
competían de verdad.

## La decisión ya estaba tomada

Las 40 fichas del glosario en español pasaron a `noindex, follow` el 5 de
octubre (PR #14, consolidación de glosario), de camino a esta misma sesión
de trabajo. Verificado contra `main` ahora mismo: las 7 fichas relevantes
para estas consultas están todas `noindex`.

| Consulta | Ficha de glosario (noindex, secundaria) | Artículo de blog (indexable, principal) |
|---|---|---|
| ifs food | `glosario/ifs-food/` | `blog/certificacion-ifs-food-guia-esencial/` |
| ficha tecnica | `glosario/ficha-tecnica-de-producto/` | `blog/ficha-tecnica-de-producto-sin-fallos/` |
| gfsi | `glosario/gfsi/` | `blog/gfsi-que-es-y-que-norma-te-conviene/` |
| prerrequisitos | `glosario/prerrequisitos-ppr/` | `blog/prerrequisitos-ppr-la-base-de-un-appcc-solido/` |
| iso 22000 | `glosario/iso-22000/` | `blog/iso-22000-la-guia-practica-y-definitiva/` |
| retirada de producto | `glosario/retirada-de-producto-recall/` | `blog/retirada-de-producto-alimentario-sin-caos/` |
| trazabilidad alimentaria | `glosario/trazabilidad-alimentaria/` | `blog/trazabilidad-alimentaria-que-es-y-como-gestionarla-bien/` |

Una página `noindex` no puede aparecer en resultados de búsqueda, así que
no hay cannibalización real posible: el blog es la única candidata a
posicionar en las 7. No he tenido que elegir nada de nuevo, solo
confirmar que la elección anterior se sostiene y que el enlace entre
ambas páginas es correcto.

## Verificación del enlace glosario → blog

Las 7 fichas de glosario ya enlazaban a su artículo de blog con un anchor
descriptivo ("Guía completa: [título del artículo]") antes de empezar esta
tarea. Al cambiar los títulos de 6 de los 7 artículos en la tanda de CTR
de hoy, el texto del enlace se desactualizó en algunos casos; ya está
corregido (ver `seo/reports/titles-antes-despues.md` y los commits de esta
rama) para que el anchor coincida siempre con el `<h1>` real del artículo.

## Lo único que no estaba resuelto: el contenido del artículo

El riesgo real no era cannibalización entre páginas, sino que el **propio
artículo de blog** no estaba optimizado para responder directamente a la
consulta (sin bloque de respuesta directa, sin FAQ, con algún H2 duplicando
el título en vez de cubrir variantes). Eso es lo que se trabaja en
`seo/reports/titles-antes-despues.md` (tanda anterior, CTR) y en los 7
commits de esta rama (snippet, tabla y FAQ). No hay nada más que fusionar
ni re-priorizar entre glosario y blog para estas 7 consultas.
