# Títulos y meta descripciones — CTR del blog

5 octubre 2026. Objetivo: subir el CTR de 8 URLs del blog con impresiones
altas y clics muy por debajo de lo esperable para su posición (datos de
Search Console que diste tú, 28 días recientes).

Mecanismo: `seo/overrides.json` (title, h1, description por slug), que el
build aplica encima de lo que llega de WordPress. No se ha tocado el cuerpo
del post ni su slug, solo `<title>`, meta description, H1, Open Graph/Twitter
y el `headline` del JSON-LD (los cuatro se derivan del mismo override, así
que quedan coherentes entre sí automáticamente).

De camino encontré y corregí un bug real: el `headline` del JSON-LD de
**todos** los posts con override (los 8 de aquí y los 10 que ya existían)
usaba siempre el título original de WordPress en vez del H1 corregido, así
que quedaba desalineado del `<title>` y el H1 reales. Corregido en
`scripts/lib/templates.mjs` (commit aparte, antes de las 8 páginas).

## Antes / después

| Página | Impr. / clics / pos. | Title antes → después | Description antes → después |
|---|---|---|---|
| [certificacion-ifs-food-guia-esencial](https://trysolved.com/blog/certificacion-ifs-food-guia-esencial/) | 4.677 / 5 / 11,3 | `IFS Food: qué es, requisitos y cómo certificarse · Solved` (59) → `IFS Food: requisitos y cómo certificarte · Solved` (49) | `Qué exige la norma IFS Food, cómo puntúa el auditor las desviaciones y los KO, y qué documentación conviene tener lista antes de que llegue la auditoría.` (154) → `Qué exige IFS Food, cómo puntúa el auditor los KO y qué documentación preparar. Supera la auditoría sin sorpresas.` (114) |
| [punto-de-control-critico-pcc-guia-practica](https://trysolved.com/blog/punto-de-control-critico-pcc-guia-practica/) | 4.480 / 8 / 8,1 | `Punto de control crítico (PCC): guía práctica · Solved` (55) → `PCC (punto de control crítico): guía práctica · Solved` (54) | `Descubre qué es un punto de control crítico, cómo identificarlo con el árbol de decisiones y cómo vigilarlo correctamente en tu empresa.` (138) → `Qué es un PCC y cómo identificarlo con el árbol de decisiones. Aprende a vigilarlo sin errores en tu línea.` (107) |
| [iso-22000-la-guia-practica-y-definitiva](https://trysolved.com/blog/iso-22000-la-guia-practica-y-definitiva/) | 3.951 / 17 / 10,8 | `ISO 22000: qué es y qué exige la norma · Solved` (48) → `ISO 22000: qué exige la norma · Solved` (38) | `Qué pide la ISO 22000, en qué se diferencia del APPCC y de la FSSC 22000, y qué documentación hay que tener preparada para la auditoría de certificación.` (154) → `Qué exige ISO 22000 y en qué se diferencia del APPCC y la FSSC 22000. Prepárate para la auditoría sin sorpresas.` (112) |
| [acciones-correctivas-y-preventivas-que-funcionan](https://trysolved.com/blog/acciones-correctivas-y-preventivas-que-funcionan/) | 3.764 / 26 / 7,2 | `Acciones correctivas y preventivas: CAPA y ejemplos · Solved` (61, ya tenía override y se pasaba del límite) → `Acciones correctivas y preventivas: CAPA · Solved` (49) | `Diferencia entre acción correctiva y preventiva, ejemplos reales de CAPA y cómo verificar la eficacia antes de cerrar una no conformidad.` (138) → `Diferencia entre acción correctiva y preventiva, con ejemplos de CAPA. Verifica la eficacia antes de cerrarlas.` (111) |
| [gfsi-que-es-y-que-norma-te-conviene](https://trysolved.com/blog/gfsi-que-es-y-que-norma-te-conviene/) | 2.775 / 9 / 8,1 | `GFSI: qué es y qué norma te conviene · Solved` (46) → `GFSI: qué norma te conviene elegir · Solved` (43) | `GFSI es un iniciativa que reconoce esquemas de seguridad alimentaria como BRCGS, IFS Food y FSSC 22000. Descubre cuál elegir según tu negocio.` (143) → `GFSI reconoce esquemas como BRCGS, IFS Food y FSSC 22000. Compara requisitos y elige el que encaja con tu negocio.` (114) |
| [prerrequisitos-ppr-la-base-de-un-appcc-solido](https://trysolved.com/blog/prerrequisitos-ppr-la-base-de-un-appcc-solido/) | 2.682 / 5 / 7,8 | `Qué son los prerrequisitos (PPR) del APPCC · Solved` (51) → `Prerrequisitos (PPR) del APPCC: qué son · Solved` (48) | `Los PPR son las condiciones de higiene sobre las que se sostiene el APPCC. Qué programas incluyen, en qué se diferencian de los PPRo y cómo verificarlos.` (154) → `Qué programas incluyen los prerrequisitos del APPCC y en qué se diferencian de los PPRo. Verifícalos sin fallos.` (112) |
| [etiquetado-alimentario-que-exige-la-normativa](https://trysolved.com/blog/etiquetado-alimentario-que-exige-la-normativa/) | 2.432 / 11 / 8,4 | `Etiquetado alimentario: qué exige la normativa · Solved` (56) → `Etiquetado alimentario: qué exige la ley · Solved` (49) | `Descubre qué exige la normativa en etiquetado alimentario: información obligatoria, alérgenos, errores comunes y cómo evitar retiradas de producto.` (148) → `Información obligatoria, alérgenos y errores comunes en etiquetado alimentario. Evita retiradas de producto.` (108) |
| [certificacion-brc-la-guia-definitiva](https://trysolved.com/blog/certificacion-brc-la-guia-definitiva/) | 2.154 / 4 / 10 | `Certificación BRC, la guía definitiva · Solved` (47) → `Certificación BRC: requisitos y guía · Solved` (45) | `Descubre qué es la certificación BRC, sus requisitos, estructura y cómo prepararte para la auditoría con esta guía definitiva.` (128) → `Qué exige la certificación BRC, cómo está estructurada la norma y cómo preparar la auditoría sin sorpresas.` (107) |

Todos los title ≤60 caracteres con la palabra clave al inicio (IFS Food, PCC,
ISO 22000, acciones correctivas, GFSI, prerrequisitos, etiquetado
alimentario, BRC), todas las description ≤155 con un beneficio concreto y un
cierre de acción ("supera la auditoría", "evita retiradas", "verifícalos sin
fallos"...). Cada frase nueva sale de la propia description o del cuerpo del
post original, nunca de un dato inventado — lo comprobé artículo por
artículo contra el texto real (p. ej. que el PCC realmente se identifica con
un árbol de decisiones, o que BRC explica su estructura en la introducción).

El H1 se actualizó para que coincida con el nuevo title (sin el sufijo
"· Solved"), así que title y H1 dicen lo mismo con las mismas palabras.

## Hallazgo de camino: un enlace roto heredado de la fusión de ayer

Al reconstruir el blog para este cambio, `check:seo` encontró 3 fichas de
glosario (`brcgs`, `no-conformidad`, `registro-de-calidad`) que seguían
enlazando a posts ya fusionados el día 5-oct (devolvían 404). Las repunté a
sus supervivientes actuales en `seo/enlazado.json`.

**Y até un cabo más gordo revisando esto**: en la fusión de ayer invertí sin
querer la fila 20 del plan (`registro-de-calidad-que-debe-incluir-y-como-llevarlo`
vs `deja-de-perder-registros-de-control-de-calidad`). El plan decía que
sobrevivía el primero (va a la consulta real "qué debe incluir un registro de
calidad") y se fusionaba el segundo; yo trasheé el primero y dejé vivo el
segundo — justo al revés. Ya está en producción así, y deshacerlo significa
restaurar un post de la papelera de WordPress y volver a trashear el otro,
que es la misma acción que bloqueó el clasificador de permisos el otro día.
Lo dejo tal cual está (funcional, sin enlaces rotos) y te aviso para que
decidas si merece la pena corregirlo a mano.

## Limitación conocida: las tarjetas "Sigue leyendo" no se actualizan solas

El título que se ve en una tarjeta de post (en el índice del blog o en
"Sigue leyendo" de otro artículo) sale de `post.title` —el título crudo de
WordPress— en vez del override, en `scripts/build-blog.mjs`. Es el mismo
patrón de bug que corregí para el `headline` del JSON-LD, pero arreglarlo
aquí habría significado regenerar el blog entero (dispara la re-optimización
de imágenes de los 101 posts y mete ruido en decenas de ficheros ajenos a
estas 8 páginas), así que no lo he hecho en esta rama.

**Lo que sí corregí a mano**: las 6 fichas de glosario que enlazan
directamente a una de estas 8 páginas (su "Guía completa"), porque son
ficheros estáticos sueltos, fáciles de tocar uno a uno sin rebuild.

**Lo que queda con el título antiguo**: las tarjetas "Sigue leyendo" de
otros posts que recomiendan alguno de estos 8 (sobre todo PCC y etiquetado
alimentario, que aparecen como relacionado en ~11 artículos cada uno) y las
páginas de paginación del índice del blog (`/blog/page/N/`). No son enlaces
rotos — llevan a la URL correcta — solo que el texto visible del enlace es
el título viejo hasta que WordPress regenere esas páginas o alguien arregle
`makeCardItem()` en `build-blog.mjs` para que mire `seo/overrides.json`. Lo
dejo como mejora pendiente, no como parte de esta tanda.

## Verificación

- `npm run check:seo` → `✔ Sin fallos` (392 páginas, 244 URLs en el sitemap)
- Title, H1, `og:title`/`og:description` y `headline`/`description` del
  JSON-LD comprobados uno a uno en las 8 páginas: los cuatro coinciden.
- No se ha tocado el slug ni el cuerpo de ningún post.
- 8 commits, uno por página, más el fix del `headline`, el de los 3 enlaces
  rotos de glosario y este informe.
