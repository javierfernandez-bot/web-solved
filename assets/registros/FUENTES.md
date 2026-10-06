# Carátulas de los modelos de registro — procedencia

Las ocho imágenes de esta carpeta son **las portadas de las tarjetas de la biblioteca** en «El
montaje de una plantilla» (`ds/plantilla.css`, montado en `/auditorias/`). Cada una es el asunto del
registro que encabeza, no una foto de fábrica genérica.

**Generadas el 9 de septiembre de 2026** con `nano banana pro` (Higgsfield), a petición del cliente y
para esto: **ninguna se ha usado antes en el sitio y ninguna se usa en otra página**. Es la misma
regla de `assets/planta/FUENTES.md` —una foto, una página—, con una diferencia que conviene tener
clara: **aquí no sale nadie**. Las de `assets/planta/` son fotos de escena y piden persona +
dispositivo; éstas son portadas dentro de una pantalla del producto, y lo que tienen que enseñar es
la cosa que se controla.

| Fichero | Registro que encabeza | Qué se ve |
|---|---|---|
| `camara-frio.webp` | Control de temperaturas | Puerta de cámara frigorífica con su lectura y cajas dentro |
| `limpieza-linea.webp` | Auditoría de limpieza TPM | Línea de acero inoxidable con manguera y suelo mojado |
| `pasteurizacion-tanques.webp` | Registro de pasteurización | Tanques y tubería con válvulas |
| `almacen-estanterias.webp` | Control de almacenes | Estanterías de palés en el pasillo |
| `lavamanos-ducha.webp` | Apertura de grifos y duchas | Lavamanos de rodilla y ducha lavaojos, alicatado |
| `maquina-mantenimiento.webp` | Registros de mantenimientos | Máquina abierta, correas y poleas a la vista |
| `envasado-etiqueta.webp` | Trazabilidad del producto | Bandejas selladas en la cinta bajo el cabezal de etiquetado |
| `instalaciones-techo.webp` | Inspección visual de instalaciones | Tubería y bandejas de cable cruzando el techo de la nave |

**Medida: 304×104 px**, que es el doble de la carátula (152×52) para pantallas densas, recortadas de
la banda central del 16:9 original. Entre las ocho suman 43 KB. Si se sustituye alguna, se recorta
igual: `sharp().extract()` de la banda central y `resize(304,104)` a WebP q72.

**La fórmula del prompt es la de `assets/planta/FUENTES.md`** —distribución primero, luz alta, lenguaje
de cámara y las negaciones al final—, con dos añadidos propios: `no people`, porque una persona dentro
de una carátula de 152 px no se lee, y `no text, no signage, no brand logos`, que aquí importa el
doble: un rótulo inventado dentro de una pantalla de producto es exactamente lo que el sistema
prohíbe.
