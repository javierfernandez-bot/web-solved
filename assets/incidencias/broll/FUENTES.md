# Planos de recurso · vídeo de incidencias

## Generados con IA (Higgsfield, 2 sep 2026)

Seis planos generados a medida porque el stock gratuito no servía: cuatro de
seis clips de Mixkit eran planos de manos y en los otros dos el operario salía
de espaldas o demasiado lejos. En este vídeo la persona **es** el mensaje, así
que tenía que vérsele la cara.

Proceso en dos pasos: fotograma base con **nano banana pro** a 2K y movimiento
con **Kling 3.0 std** (5 s, 24 fps, 1284×716) partiendo de esa imagen. El coste
fue de 72 créditos. Los prompts completos están en el histórico de Higgsfield.

| Fichero | Contenido | Dónde se usa |
|---|---|---|
| `calidad.mp4` | Inspectora con tablet en sala de producción | Escena 5 (columna) · burbujas 7 y 13 |
| `produccion.mp4` | Operario en el cuadro de mandos de la línea | Burbujas 7 y 13 |
| `mantenimiento.mp4` | Técnico con llave inglesa en máquina abierta | Escena 5 (columna) |
| `administracion.mp4` | Administrativa en oficina sobre la nave | Escena 5 (columna) · burbujas 7 y 13 |
| `logistica.mp4` | Operario con tablet entre estanterías | Burbujas 7 y 13 |
| `dictado.mp4` | Operario dictando al móvil junto a la línea | Escena 9 (plano completo) |

Ninguno lleva texto, logotipos ni pantallas legibles: son ambiente, no
documento. La interfaz siempre va en HTML encima.

### Encuadre

La escena 5 recorta a columnas verticales que sólo conservan un tercio del
ancho original. Los sujetos que no están centrados se salen de ese recorte, así
que cada columna lleva su `object-position` en el array `ROLES`
(`mantenimiento` 34%, `administracion` 30%, `calidad` 48%). Si se cambia un
plano hay que volver a medir dónde cae la cara.

Las burbujas recortan a cuadrado, que conserva el 56% central: ahí el centrado
por defecto vale para los cuatro.

## Stock

| Fichero | Origen |
|---|---|
| `planta.mp4` | Mixkit |
| `linea.mp4` | Mixkit |

Pendiente: confirmar los términos de la licencia de Mixkit antes de publicar.
Sus condiciones están tras un modal de JavaScript y no he podido leerlas.
