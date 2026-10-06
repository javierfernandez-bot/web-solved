# Prompt de marca Solved — para Claude Design

> Documento pensado para pegarse tal cual como instrucción de sistema en Claude Design (o cualquier
> herramienta de creatividad con Claude) cuando se pida una presentación, un one-pager, un social o
> cualquier pieza que tenga que **verse como Solved**. Está sacado de `web solved 3.0` —el sitio real,
> `ds/tokens.css` y `ds/site.css` mandan sobre cualquier otro material de marca que exista suelto por
> ahí (brandbooks antiguos, exportaciones de Claude Design de otra época). Si algo de este documento
> contradice a otro PDF de marca, gana este documento.

---

## Cómo usar este documento

Pégalo entero como instrucción antes de pedir la creatividad, o resume la sección «Resumen ejecutivo»
si el contexto es corto. Para una presentación completa, añade además la sección **Presentaciones**
del final, que traduce el sistema a patrones de diapositiva.

---

## 0 · Qué es Solved, en una frase

Software de gestión de operaciones industriales — incidencias, registros de control (auditorías y
checklists), acciones correctivas, documentación e indicadores — que alinea a producción,
mantenimiento, logística, calidad y dirección en una fábrica sobre una misma vista en tiempo real.
B2B, cliente industrial (mucha alimentación), España, Volstone Technology Services S.L. (Valencia).

---

## 1 · Resumen ejecutivo de la estética

Si sólo puedes retener cinco cosas:

1. **Azul y tinta sobre blanco.** Nada de fondos grises ni degradados decorativos sueltos. El lienzo
   es blanco (`#FFFFFF`), con como mucho una banda `#F4F7FA` o `#EAEFF5` por página.
2. **Tipografía fina.** Geist en peso 300 (thin) para todo titular y casi todo el cuerpo. **Nunca
   negrita.** El sistema tiene tres pesos —300, 400, 500— y el 500 es el tope, reservado a `<b>`,
   chips y micro-etiquetas.
3. **Un botón nunca es una píldora.** Radio 6px en botones e inputs. La forma de píldora
   (`border-radius:9999px`) está reservada a chips de estado y etiquetas — usarla en un botón es la
   señal más rápida de que algo no es de este sistema.
4. **Encuadre de raíles.** Dos líneas verticales finas (`1px`, `#E2E8F0`) recorren el contenido de
   arriba abajo, con costuras horizontales a sangre entre bloques. Es el elemento de marca más
   distintivo del sitio: convierte cualquier página en algo que se lee como un plano técnico, no
   como una landing genérica.
5. **Registro corporativo y técnico**, no coloquial. Los titulares prometen un resultado con verbo en
   segunda persona; el cuerpo describe con vocabulario de proceso. Sin exclamaciones, sin «¡», sin
   personajes ni horas del día.

La sensación general: **precisión de ingeniería con calidez de azul** — más blueprint que consumer
SaaS, pero nunca frío o corporativo-genérico gracias al azul cálido y al aire generoso.

---

## 2 · Color

### 2.1 Paleta base

| Token | Hex | Uso |
|---|---|---|
| `--color-primary` (Solved Blue) | `#0F68F4` | Color de marca. CTA primario, links, logo, estados activos. |
| `--color-primary-deep` | `#0B54C8` | Hover de lo primario. |
| `--color-primary-press` | `#08409B` | Active/press. |
| `--color-primary-soft` | `#5A96FF` | Acentos suaves, parte de la rampa de marca. |
| `--color-primary-subdued` | `#DCE8FE` | Fondos activos suaves (active de secundario). |
| `--color-primary-wash` | `#E8F1FE` | Hover de superficies, fondo de badges. |
| `--color-graphite-900` (negro del logo) | `#111214` | Texto principal, fondos oscuros (tema IA). |
| `--color-graphite-800` | `#1B2026` | Variante de fondo oscuro. |
| `--color-ink` | `#111214` | Texto principal. |
| `--color-ink-secondary` | `#3B434C` | Texto secundario. |
| `--color-ink-mute` | `#6C757E` | Texto atenuado, `.ds-dim` (segunda tinta de un titular). |
| `--color-ink-mute-2` | `#79828B` | Texto de navegación. |
| `--color-canvas` | `#FFFFFF` | Lienzo. El sitio **es blanco**. |
| `--color-canvas-soft` | `#F4F7FA` | Banda suave, como mucho una por página. |
| `--color-canvas-steel` | `#EAEFF5` | Banda «acero», más presente. |
| `--color-hairline` | `#DDE3EA` | Bordes de tarjeta, líneas. |
| `--color-hairline-input` | `#B4BFCA` | Bordes de campo. |

### 2.2 Estados de máquina — el único color no azul del sistema

| Token | Hex | Uso |
|---|---|---|
| `--color-status-ok` | `#16A34A` | Verde. Sólo estado «OK / conforme / firmado». |
| `--color-status-warn` | `#F2A413` | Ámbar. Sólo estado «en revisión / atención». |
| `--color-status-fault` | `#E5484D` | Rojo. Sólo estado «crítico / KO / fallo». |
| `--color-status-idle` | `#8A929B` | Gris. Estado «pausado / inactivo». |

Regla dura: **estos cuatro colores son para estado, nunca decorativos.** No se usan para dar variedad
a una rejilla ni para colorear un icono porque «queda bien».

### 2.3 Color de módulo — codifica identidad de producto, no gusto

Cada módulo de la aplicación tiene su color fijo. En la web sólo se usa para representar **pantallas
de producto** (una escena, un mockup) — nunca como paleta decorativa de la propia web de marketing,
que es azul + tinta.

| Módulo | Hex |
|---|---|
| Incidencias | `#0F68F4` (el azul de marca) |
| Acciones | `#F97316` (naranja) |
| Registros (checklists/auditorías) | `#7C3AED` (violeta) |
| Activos | `#3B434C` (gris grafito) |
| IA | `#A855F7` (morado) |
| KPIs | `#3FAFD6` (azul-cian, con temperatura propia para no confundirse con Incidencias) |

`--accent-cian` `#1FD6F5` — **sólo movimiento** (brillo especular, pulso de una animación). Nunca se
usa como color de superficie ni de texto.

### 2.4 La rampa de marca — el degradado de firma

El gradiente que abre la home y viaja por todo el sitio (la hero, el botón de IA, el shader de fondo)
va **azul → violeta → rosa → naranja**, siempre en ese orden, siempre sobre blanco:

```
linear-gradient(28deg,
  rgba(255,255,255,0) 42%,
  #5A96FF 62%,
  #0F68F4 76%,
  #7C3AED 88%,
  #F97316 100%)
```

Es el recurso a usar para **portadas de presentación, fondos de sección de apertura/cierre y
cualquier pieza que necesite "ser Solved" de un vistazo**, incluso sin logo ni texto. Sobre un fondo
oscuro (tema IA) la misma rampa cambia a azul → morado → rosa → cian:

```
linear-gradient(28deg,
  rgba(17,18,20,0) 42%,
  #3B6FE0 62%,
  #A855F7 78%,
  #D34F9D 90%,
  #1FD6F5 100%)
```

Usar la versión clara para todo lo comercial; la oscura sólo si la pieza es específicamente sobre IA.

### 2.5 Reglas de color

- El 90 % de cualquier pieza es blanco, tinta y azul. El resto de colores (módulo, estado, rampa)
  aparecen en manchas pequeñas y con motivo — nunca como fondo de una diapositiva entera salvo la de
  apertura/cierre con la rampa.
- Nunca inventar un color nuevo para «dar variedad». Si hace falta un sexto color, no lo hay: se
  repite azul o se usa gris.
- Sobre fondo oscuro, todo lo de IA. El resto de la marca vive sobre blanco.

---

## 3 · Tipografía

**Familia única: Geist** (`https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500`), con
fallback `'SF Pro Display', system-ui, -apple-system, 'Segoe UI', sans-serif`. No hay una segunda
familia de titulares, ni serif, ni mono decorativo en el marketing (DM Mono sólo aparece en datos de
producto, IDs y columnas tabulares dentro de pantallas de app).

**Tres pesos, y sólo tres:**

| Peso | Uso |
|---|---|
| 300 (thin) | Todo titular (h1-h6), toda cifra grande, la mayoría del cuerpo. Es el peso por defecto. |
| 400 (regular) | Cuerpo de texto normal, botones, chips, kickers/eyebrows, navegación. |
| 500 (medium) | El techo. Sólo `<b>`/`<strong>` puntual dentro de una frase. **Nunca titulares, nunca 600/700/800.** |

Escala (todas con `font-weight:300` salvo que se indique):

| Token | Tamaño/interlineado | Tracking |
|---|---|---|
| `display-xxl` | 56px / 1.03 | −1.4px |
| `display-xl` | 48px / 1.15 | −0.96px |
| `display-lg` | 32px / 1.1 | −0.64px |
| `display-md` | 26px / 1.12 | −0.26px |
| `heading-md` | 20px / 1.4 | — |
| `body-lg` | 16px / 1.4 | — |
| `body-md` | 15px / 1.4 | — |
| `caption` | 13px / 1.4 (peso 400) | −0.39px |
| `micro-cap` | 10px / 1.15 (peso 400) | 0.1px, uppercase — el kicker |

Regla de marca: **cuanto más grande el texto, más negativo el tracking.** Los titulares grandes se
aprietan; nunca se separan las letras salvo en el kicker (mayúsculas, +0.08em/1.1px, uppercase).

**Titular a dos tintas** — el patrón de titular más usado del sitio: una frase que empieza en tinta
(`--color-ink`) y sigue en gris (`--color-ink-mute`, `.ds-dim`) a partir de una coma o dos puntos.
Sustituye a "titular + párrafo" cuando el titular ya lleva dos ideas encadenadas — la afirmación
fuerte y su matiz van en la misma línea visual, sin abrir un segundo bloque de texto.

```
Todo lo que tu planta necesita, <en tinta más clara>en una sola plataforma</>
```

**Cifras** siempre tabulares (`font-variant-numeric:tabular-nums`) y en peso 300 a tamaño grande — a
tamaño de cifra, el 500 se ve como un bloque negro.

---

## 4 · Forma

| Token | Valor | Uso |
|---|---|---|
| `radius-chip` | 4px | Chips pequeños |
| `radius-control` | 6px | **Botones e inputs.** Un botón nunca es una píldora. |
| `radius-panel` | 8px | Paneles y tarjetas de módulo (dentro de una pantalla de producto) |
| `radius-card` | 12px | Tarjetas de la web de marketing |
| `radius-pill` | 9999px | **Sólo** chips de estado y opciones tipo OK/KO |

---

## 5 · Elevación y bordes

El sistema es de **hairline, no de sombra.** Casi todo lo que separa una superficie de otra es un
borde de 1px (`#DDE3EA`), no una sombra proyectada.

- `elev-1` (tarjeta en reposo): `rgba(12,32,64,0.08) 0 1px 3px` — casi imperceptible.
- `elev-2` (elevado/modal): `rgba(12,32,64,0.08) 0 8px 24px, rgba(12,32,64,0.04) 0 2px 6px`.
- Nada se levanta al hover (`translateY`), nada escala. Un botón sólo cambia de color al interactuar.
- Movimiento del sistema: 140–160ms, `cubic-bezier(.4,0,.2,1)`. Nada rebota, nada tiene overshoot.

---

## 6 · El encuadre — el elemento de firma más reconocible

Es la pieza que más diferencia a Solved de cualquier landing genérica y la que más vale la pena
trasladar a una presentación.

- Contenedor central de **1266px** de ancho máximo.
- **Dos raíles verticales de 1px** (`#E2E8F0` sobre blanco, blanco al 12% sobre oscuro) que recorren
  el contenido de principio a fin, como los márgenes de un plano técnico o una hoja pautada.
- El padding vertical entre bloques vive **dentro** de esa caja —no en cada sección— para que las dos
  líneas verticales se lean continuas de arriba abajo sin cortes.
- Las uniones horizontales entre bloques van **a sangre**: cruzan los raíles y llegan al borde de la
  ventana/diapositiva.
- Ritmo vertical generoso: 96–128px de aire entre bloques en escritorio (72px en tablet, 52px en
  móvil / formatos estrechos).

**Traducido a una diapositiva:** mantener un margen lateral constante marcado por una línea vertical
fina a cada lado del contenido (no del lienzo completo), y usar una línea horizontal fina para separar
cabecera de cuerpo cuando la diapositiva lo pida. No hace falta en todas las diapositivas — es el
recurso de las de contenido denso, no de la portada.

---

## 7 · Iconografía

Outline, trazo fino (~1.8px), geométrico, **currentColor** (el icono hereda el color del texto que lo
acompaña, no lleva relleno propio salvo el estado). Sin iconos rellenos ni con múltiples colores a la
vez. El repositorio de iconos vive en `assets/iconos/` (SVG normalizados) y se aplican con la clase
`.bico` (máscara + `currentColor`). Estado siempre representado con el punto `●` (U+25CF), no con un
icono de check o cruz.

---

## 8 · Fotografía / imagen

- **Personas reales usando un dispositivo (móvil, tablet o PC) en planta industrial** — nunca gente
  de banco de imágenes genérica en una oficina. Composiciones luminosas, sin grano, sin duotono.
- Las **pantallas de producto no son capturas ni fotomontajes**: se maquetan en HTML con la
  tipografía y el azul reales de la aplicación (Roboto dentro de las pantallas de producto, distinta
  de Geist, que es la de la web). Nunca se pega una interfaz inventada sobre una foto.
- Regla «una foto, una página»: ninguna fotografía se reutiliza en dos piezas distintas del sitio.
- Nada de iconos de IA cliché (cerebros, redes neuronales brillantes). La capa de IA se representa
  con conversación real (una barra de prompt, una respuesta con datos) sobre fondo grafito oscuro
  (`#111214`), nunca sobre blanco.

---

## 9 · Voz y tono (para el texto que lleve la pieza)

Registro **corporativo y técnico**, no coloquial ni de "growth hacker". Reglas:

- **El titular es una promesa con verbo en 2ª persona y resultado concreto**, no una ficha técnica ni
  un juego de palabras. Patrón: *qué haces (y cuánto cuesta hacerlo) → qué pasa con el equipo → qué
  sale de ahí sin trabajo extra.* Ej.: «Registra todas tus incidencias en segundos, organiza a tu
  equipo para resolverlas y genera la documentación automáticamente».
- El cuerpo describe en tercera persona con vocabulario de proceso: *trazabilidad, evidencia
  auditable, criticidad, desviación, ciclo de resolución, cumplimiento normativo*. Fuera: *papeles,
  caos, lío, a mano, chapuza*.
- Nunca se nombra al competidor (Excel, papel, WhatsApp) en un titular.
- Sin escena cotidiana (horas del día, personajes, "el lunes por la mañana").
- Sin signos de exclamación. Las preguntas sólo encabezan FAQ.
- Sin adjetivos huecos: «optimiza», «revoluciona», «solución integral», «potencia tu negocio» están
  prohibidos si no hay una función concreta detrás.
- Categoría con su nombre: **software de gestión de operaciones industriales** — no sólo "calidad".
  Mantenimiento y producción pesan tanto como calidad en el negocio real; no encuadrar todo como una
  herramienta de calidad salvo que la pieza sea específicamente sobre una norma o certificación.
- «Solved» sin artículo («Solved centraliza…», nunca «el Solved»). Tuteo hacia el lector
  («tu equipo», «tu planta»), nunca «vosotros».
- Sentence case en titulares y botones. MAYÚSCULAS sólo en kickers.
- Cifras reales y concretas siempre que existan (90% ahorro, +2.000 horas, +70.000€/año) — nunca una
  cifra inventada para "que suene bien".

---

## 10 · Reglas que no se negocian (checklist rápido antes de dar por bueno el resultado)

- [ ] ¿Hay negrita/600+ en algún titular? → quitar, bajar a 300 o subir tamaño en vez de peso.
- [ ] ¿Algún botón es una píldora (`border-radius` total)? → pasar a 6px. Sólo chips de estado son píldora.
- [ ] ¿Hay más de un color decorativo fuera de azul/tinta en una pieza comercial? → quitar; el color
      de módulo sólo aparece representando una pantalla de producto real.
- [ ] ¿Hay verde/ámbar/rojo/gris usados como decoración y no como estado? → quitar.
- [ ] ¿Hay una foto de banco genérica (oficina, gente sonriendo a cámara sin contexto industrial)? → sustituir.
- [ ] ¿El titular nombra al rival o dramatiza una escena cotidiana? → reescribir como promesa de resultado.
- [ ] ¿Hay signos de exclamación? → quitarlos.
- [ ] ¿El cian (`#1FD6F5`) se usa como color de fondo o de texto en vez de como brillo de movimiento? → quitar.

---

## 11 · Logo

- Wordmark oscuro (fondos claros): `assets/logotipo-solved.webp`.
- Wordmark claro (fondos oscuros / grafito): `assets/logotipo-solved-claro.webp`.
- Altura de referencia en navegación: 28px. No estirar, no recolorear, no añadir efectos.

---

## 12 · Aplicación a presentaciones

Patrones concretos para maquetar diapositivas con esta identidad, pensados para Claude Design.

### Portada / cierre
Fondo blanco. La **rampa de marca** (sección 2.4) como un haz diagonal que cruza la diapositiva de
esquina a esquina, con lavado a blanco donde va el texto (opacidad creciente hacia blanco desde el
punto donde empieza el título) — nunca el degradado a pantalla completa sin zona de lectura limpia.
Logo arriba a la izquierda o centrado, pequeño. Título en Geist 300, `display-xxl`/`display-xl`,
tracking negativo, tinta oscura. Subtítulo en `body-lg`, `--color-ink-mute`.

### Divisor de sección
Fondo `--color-canvas-soft` (`#F4F7FA`) o blanco liso. Kicker en mayúsculas pequeño (color azul o
`--color-ink-mute`, tracking +1.1px) arriba, seguido del título de la sección en `display-lg`/`xl`,
peso 300. Sin decoración adicional: el aire y la tipografía hacen el trabajo.

### Diapositiva de contenido (texto + puntos)
Encuadre con raíles: un margen lateral fijo marcado por una línea vertical fina a cada lado del
bloque de contenido (no del lienzo entero de la diapositiva). Titular arriba en `display-md`/`lg`,
cuerpo en `body-lg`/`body-md`, ink-secondary. Listas sin viñetas decorativas de colores: usar guion o
el punto `●` sólo si se está listando un estado. Nada de negrita en la lista salvo un término clave
puntual en 500.

### Diapositiva de datos / cifras
Cifras grandes en Geist 300, tabulares, azul (`#0F68F4`) o tinta. Etiqueta en `caption`/`micro-cap`
debajo, gris. Si hay gráfico, usar azul de marca como color primario y el color de módulo
correspondiente sólo si el dato pertenece específicamente a ese módulo — nunca una paleta arcoíris.
Fondo blanco, borde hairline en vez de sombra si hay tarjetas de cifra.

### Diapositiva de "pantalla de producto"
Si hay que mostrar la aplicación: maquetar la interfaz (no una captura de pantalla real ni un mockup
inventado con logos ajenos), con el azul de Incidencias (`#0F68F4`) por defecto salvo que la pantalla
sea explícitamente de otro módulo (Acciones naranja, Registros violeta). Tipografía de la interfaz:
puede diferenciarse ligeramente de Geist (la app real usa Roboto) para marcar que "esto es la
aplicación", enmarcada en un dispositivo simple (ventana de navegador, tablet o móvil) con esquinas
suaves y sombra discreta (`elev-2`), nunca flotando sin marco.

### Cita / testimonio
Cita centrada, tipografía `display-md` peso 300, tinta. Nombre y cargo debajo en `caption`, gris,
peso 400 — nunca negrita. Logo del cliente en pequeño y en su color real (no monocromo forzado) si el
fondo es claro.

### Lo que nunca debe aparecer en una diapositiva de Solved
Gradientes multicolor decorativos fuera de la rampa de marca definida; iconos 3D o ilustraciones
tipo "flat design" genéricas de startup; fondos oscuros fuera del contexto IA; texto centrado en
mayúsculas sostenidas fuera del kicker; sombras marcadas o efectos de neumorfismo; cualquier tipografía
serif o script.
