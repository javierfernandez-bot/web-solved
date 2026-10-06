# Voz y registro — corporativo y técnico

Decidido el 3 de septiembre de 2026, y sustituye al registro anterior de todo el sitio.

## De dónde viene

La 3.0 se escribió en voz llana y directa: imperativos en segunda persona («Saca de Excel»),
la escena cotidiana como argumento («sin pedírselos a nadie», «el lunes por la mañana») y el
nombre del rival en el titular («Fuera del Excel, del papel y del WhatsApp»). Salía del análisis
de las 955 reuniones de venta: el cliente habla así y el competidor real es la hoja de cálculo.

**Se cambia por decisión de negocio.** El comprador industrial que evalúa la web no es siempre
el que habla en la reunión: por encima del responsable de calidad hay una dirección que compara
proveedores, y ante ella el registro llano se lee como producto pequeño. El sitio pasa a
registro **corporativo y técnico**.

Lo que NO cambia: los hechos. Ninguna cifra, ninguna función y ninguna cita se tocan al subir el
registro. Subir el tono no es permiso para prometer más.

## Reglas

**El titular es una promesa, no una ficha técnica.** Corregido el 3 de septiembre de 2026, y es la
regla que más se ha equivocado: la primera versión de esta ficha pedía titulares nominales y salieron
especificaciones —`Registro de incidencias desde la línea, con evidencia, responsable y trazabilidad
hasta el cierre`—. Eso describe el producto; no dice qué gana quien lo compra.

La forma es **la promesa en tres tiempos**, en segunda persona y con verbo:

1. **qué haces**, y cuánto cuesta hacerlo → *Registra todas tus incidencias en segundos*
2. **qué pasa con el equipo** → *organiza a tu equipo para resolverlas*
3. **qué sale de ahí sin trabajo extra** → *y genera la documentación automáticamente*

Los tres tiempos son los verbos que el sistema ya usa —registrar → resolver → demostrar—, así que el
titular y la página cuentan lo mismo en el mismo orden. No hacen falta los tres siempre; sí que el
titular acabe en un **resultado**, no en un atributo.

Lo que sigue prohibido, y es lo que distingue esta promesa de la web anterior: la escena cotidiana
(*a las seis y media de la mañana*), el nombre del rival en el titular (*fuera del Excel*) y el
adjetivo sin función detrás (*revoluciona tu planta*). Promesa concreta, con el «cuánto» dicho: *en
segundos*, *sin volver a la oficina*, *automáticamente*, *antes de que llegue el auditor*.

**Arriba la promesa, abajo el detalle técnico.** El titular, el subtítulo y el encabezado de sección
prometen; el cuerpo, las listas y las FAQ describen el mecanismo en tercera persona —«el sistema
deriva…», «cada control genera…»—. Es el reparto que hace que la página convenza y además demuestre.
Fuera el «vosotros» en los dos registros.

**Vocabulario de proceso, no de anécdota.** Trazabilidad, evidencia auditable, criticidad,
desviación, ciclo de resolución, cumplimiento normativo, sincronización, ciclo de vida del
documento. Fuera: papeles, caos, lío, a mano, chapuza, «sin pedírselo a nadie».

**El rival no se nombra en titulares.** Excel, papel y WhatsApp son un hecho del diagnóstico y
viven en el cuerpo, una vez y como estado de partida —«sistemas de registro no estructurados»
cuando el sitio habla de sí mismo, el nombre propio cuando describe la planta del cliente—.
Un titular que nombra a Excel sitúa a Solved en la categoría de Excel.

**Sin escena cotidiana.** Nada de horas del día, turnos concretos ni personajes. La prueba es el
dato y la función, no la viñeta.

**Precisión antes que grandilocuencia.** Corporativo no es vacío: se prohíben igual «optimiza»,
«revoluciona», «solución integral 360» y «potencia tu negocio» si no hay detrás una función que
se pueda enseñar. Si una frase no sobrevive a la pregunta «¿qué hace exactamente?», se cae.

**Solved no es sólo calidad, y el copy se va solo a calidad.** Es el sesgo más caro del sitio y
`check:voz` lo avisa: una página con tres o más «calidad» que no nombra mantenimiento ni producción.
Los números, del lado del cliente en las 955 reuniones: **mantenimiento 43,7 %** de las reuniones y
**49 % de la cartera**, **producción 32 %**, y +20 reuniones de GMAO con partner. Quien lee la web no
es sólo el responsable de calidad: es también el jefe de mantenimiento cuyo aviso de avería vive hoy
en un grupo de WhatsApp, y el de producción que firma el control del turno.

Cómo se ensancha sin inventar: **los tres nombres son ámbitos de uso del mismo módulo**, no módulos
nuevos. Una incidencia lleva categoría y activo, así que la avería es una incidencia; un registro
programado con su frecuencia es un preventivo; un documento puede ser una instrucción de máquina. Lo
que **no** se puede escribir es que Solved sea un GMAO: convive con el que haya y se conecta con él.

Excepción: hay páginas que son de calidad por definición —APPCC, ISO 22000, certificaciones, la de
industria alimentaria— y ahí el encuadre estrecho es el correcto. El linter las salta.

**Categoría, dicha por su nombre.** Solved es un **software de gestión de operaciones
industriales**: incidencias, registros de control, acciones correctivas, documentación e
indicadores. En cuerpo se alterna con «sistema» y «software». «Herramienta» baja de registro;
«plataforma» sólo cuando se habla de la capa técnica (integraciones, API, IA).

**Nada de signos de exclamación, ni preguntas retóricas coloquiales.** Las preguntas sólo
encabezan FAQ.

**Sin negrita** —la regla del sistema no cambia— y sin adverbios en -mente de relleno.

## La ficha se comprueba, no se recuerda

```
npm run check:voz          # todas las páginas comerciales
npm run check:voz -- ruta  # una sola
```

Sale con código 1 si algo falla, igual que `check:seo`, y **hay que pasarlo antes de dar por hecha
una página**. Existe por un motivo concreto: entre el 2 y el 3 de septiembre se escribieron tres
páginas nuevas —activos, gestor documental y una más— con esta ficha ya escrita, y ninguna la siguió.
Un documento que hay que acordarse de leer se salta solo.

Comprueba el titular sin promesa, las medidas de SEO, el «vosotros», los coloquialismos, «herramienta»
y «plataforma» fuera de sitio y los signos de exclamación. **No mira** —y es deliberado— las citas de
clientes, el texto de las pantallas de producto ni los nombres de función del propio producto: cambiar
eso no es cambiar el registro, es falsificar una cita o inventar una interfaz.

La lista de verbos de promesa vive en el propio script (`VERBOS`). Si un titular legítimo usa un verbo
que no está, se añade ahí; no se relaja la regla.

## Fórmula por pieza

| Pieza | Fórmula | Medida |
|---|---|---|
| `<title>` | keyword de la página en las cuatro primeras palabras + ` · Solved` | 50-60 caracteres |
| `meta description` | qué se consigue + el detalle que hace clicar | 150-160 caracteres |
| `<h1>` | **verbo en segunda persona + alcance + resultado**. Corte de tinta (`.ds-dim`) donde acaba lo que haces y empieza lo que consigues | 3-4 líneas en escritorio; en hero centrada, 4 |
| Subtítulo de hero | lo que el titular NO puede decir: el freno de compra, el dato, quién se lo ahorra. **Nunca la mecánica del titular con más palabras** | 1-2 frases |
| Encabezado de sección | promete lo que la sección demuestra. En la sección de problema, enuncia el problema sin dramatizarlo | 1 línea |
| Celda de característica | `<span class="em">Enunciado corto.</span>` + una frase en impersonal | 2 líneas |
| Lista de capacidades | sustantivo + qué hace. Sin verbo en segunda persona: no es una promesa, es un inventario | 1 línea |
| FAQ | pregunta tal y como la hace el cliente; respuesta que empieza por «Sí»/«No» y sigue en impersonal | 2-3 frases |
| CTA | infinitivo + lo que se obtiene: `Solicitar demostración`, `Ver cómo funciona` | 2-4 palabras |

**«Piloto» no se escribe en ninguna parte del sitio.** Corrección de negocio del 7 de septiembre de
2026: Solved no hace pruebas piloto. Salieron el CTA `Plantear un piloto` —que era ejemplo en esta
misma tabla—, el rótulo del tercer paso de la home y la coletilla «el alcance de un piloto» de las
seis notas de contacto. Lo que se sigue pudiendo decir, porque es lo que se hace, es que se arranca
por un área y un caso de uso y que el despliegue se extiende por fases.
| Titular de caso | la cifra del cliente + su situación. **No promete**: la promesa la firma Solved, el caso lo firma quien sale en el vídeo | 1-2 líneas |

## Antes y después, con los tres errores que ya se han cometido

**1. La ficha técnica.** Describe el producto y no dice qué gana quien compra.

> ✗ Registro de incidencias desde la línea, con evidencia, responsable y trazabilidad hasta el cierre
> ✓ Gestiona las incidencias de tu planta de principio a fin, desde el aviso en la línea hasta la
>   documentación del cierre

**2. El subtítulo que repite el titular.** Narra la mecánica que ya cuentan el titular y las escenas.

> ✗ Se abren desde el móvil, con foto y en el momento. Cada una deriva en su acción correctiva con
>   responsable y plazo, y el histórico queda listo para la auditoría sin que nadie lo prepare.
> ✓ Sin formación previa para quien la registra y sin trabajo administrativo para quien la cierra.

**3. El titular ingenioso.** Suena bien y no promete nada; además deja la keyword fuera.

> ✗ El procedimiento vigente, con su fecha y con quién lo validó. Y una carpeta que sabe qué documento
>   le falta.
> ✓ Controla la documentación de calidad de tu planta: versión vigente, validación y caducidades
>   avisadas antes de que las pida el auditor.

**Y el error de nivel:** dos páginas no pueden prometer lo mismo. La home promete **la operación
entera** («Ten toda la operación de tu planta bajo control en un solo sistema»); cada página de módulo
promete **su alcance**. Si el titular de un módulo sirve para la home, está mal escrito uno de los dos.

## SEO — lo que no se puede romper al reescribir

- La keyword principal de cada página **no se mueve**: sigue en `<title>`, en el `<h1>` y en las
  primeras 100 palabras. Reescribir el registro no es reposicionar la página.
- `<title>` de 50 a 60 caracteres, keyword en las cuatro primeras palabras, sufijo ` · Solved`.
- `meta description` de 150 a 160 caracteres, con la keyword y una razón para entrar.
- Un solo `<h1>`. Jerarquía h1 → h2 → h3 sin saltos.
- No se tocan URLs, canonicals, `STATIC_PAGES` ni el sitemap: el registro cambia, el mapa no.
- Los `alt` describen la imagen; no se rellenan de keywords.

## Lo que no se reescribe

- **Las citas de clientes.** Son declaraciones de personas con nombre. Cambiarles una palabra las
  convierte en testimonios inventados.
- **El texto dentro de las pantallas de producto** (`ds/app.css`): es la interfaz real.
- **Las cifras** de la banda de resultados y de los casos: salen de los vídeos y de los clientes.
- **Blog y glosario.** El blog se regenera desde WordPress en cada build (`npm run build:blog`),
  así que editar su HTML a mano se pierde en el siguiente rebuild: el registro del blog se cambia
  en el prompt del publicador de Make. El glosario es contenido definicional, no comercial.
