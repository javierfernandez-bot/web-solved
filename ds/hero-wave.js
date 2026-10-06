/* Solved — elemento de la hero.
   ---------------------------------------------------------------------------
   Portado tal cual del prototipo `solved-home-primer-scroll.html`: shader WebGL
   de 13 filamentos, la rampa de marca a lo largo del haz y el lavado que abre
   el papel donde vive el texto. Aquí sólo se ha envuelto en una función para
   poder montarlo sobre un canvas concreto; el shader y los números no se tocan.

   DOS PALETAS, UN SOLO ELEMENTO
   La geometría —los 13 filamentos, el ángulo, las amplitudes, el lavado— es la
   misma para las dos. Lo único que cambia es el color: `marca` es la rampa azul
   → violeta → rosa → naranja sobre papel blanco, y `ia` es la de la capa de IA
   —morado, rosa y cian— sobre grafito. Es a propósito que sea el mismo elemento:
   la página de IA tiene que reconocerse como el mismo sitio, no como otra web.

   La paleta `marca` lleva EXACTAMENTE los números del prototipo. Si algún día se
   tocan, se tocan ahí y no aquí abajo.

   Si no hay WebGL cae a un degradado CSS equivalente.
   Uso: SolvedHeroWave.mount(canvas) o .mount(canvas, { tema: 'ia' }).
   Registra window.SolvedHeroWave. */
(function () {
  "use strict";

  var VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}";

  /* Las dos paletas. `c` son las cinco paradas de la rampa a lo largo del haz;
     `papel` es el color del que sale el lavado —blanco en la de marca, grafito
     en la de IA—; `velo` es cuánto se levanta el conjunto hacia ese papel al
     final, que en oscuro tiene que ser menos o los filamentos se apagan. */
  var PALETAS = {
    marca: {
      c: ["vec3(0.043,0.329,0.784)", "vec3(0.059,0.408,0.957)", "vec3(0.353,0.588,1.0)",
          "vec3(0.486,0.227,0.929)", "vec3(0.827,0.310,0.616)", "vec3(0.976,0.451,0.086)"],
      papel: "vec3(1.0)",
      velo: "0.09",
      caida: "linear-gradient(28deg,rgba(255,255,255,0) 42%,#5A96FF 62%,#0F68F4 76%,#7C3AED 88%,#F97316 100%)"
    },
    /* Los tres colores son los mismos que el borde de la etiqueta AI POWERED y
       los del tinte de la capa de IA: morado --module-ia, el rosa de tránsito
       #D34F9D y el cian de movimiento #1FD6F5. Arranca en el azul de Solved
       para que el haz siga siendo de la marca y no un degradado cualquiera. */
    ia: {
      c: ["vec3(0.039,0.263,0.612)", "vec3(0.059,0.408,0.957)", "vec3(0.404,0.427,0.973)",
          "vec3(0.659,0.333,0.969)", "vec3(0.827,0.310,0.616)", "vec3(0.121,0.839,0.960)"],
      papel: "vec3(0.067,0.071,0.078)",
      velo: "0.04",
      caida: "linear-gradient(28deg,rgba(17,18,20,0) 42%,#3B6FE0 62%,#A855F7 78%,#D34F9D 90%,#1FD6F5 100%)"
    },
    /* ---------------------------------------------------------------------
       INCIDENCIAS — el mismo elemento, en el color del módulo y con otra forma
       Dos cambios, y los dos tienen motivo:

       EL COLOR. La rampa de marca recorre azul → violeta → rosa → naranja. Aquí
       no hay más que azul, que es el color del módulo (--module-incidencias,
       #0F68F4). Como el tono ya no puede viajar, viaja el VALOR: arranca en el
       azul de presión (#08409B), pasa por el de marca y termina en un azul
       hielo (#BBD5FF). El haz sigue yendo de algún sitio a otro, sólo que la
       distancia la mide la luz y no el tono.

       El cian de movimiento se queda en el brillo especular, que es donde ya
       estaba en las otras dos: en el sistema el cian no colorea, sólo se mueve.

       LA FORMA (ver "onda" en hacerFS). Si el único cambio fuera el color, dos
       pestañas abiertas se distinguirían por poco: la geometría es lo primero
       que se reconoce. Los 13 filamentos siguen ahí, con su misma luz y su
       misma ondulación, pero dejan de ser un haz diagonal y pasan a ser
       anillos que salen de un punto de abajo a la derecha. Es la figura del
       módulo: algo pasa en un punto de la línea y se propaga.
       --------------------------------------------------------------------- */
    incidencias: {
      forma: "onda",
      c: ["vec3(0.031,0.251,0.608)", "vec3(0.043,0.329,0.784)", "vec3(0.059,0.408,0.957)",
          "vec3(0.231,0.549,1.0)", "vec3(0.353,0.588,1.0)", "vec3(0.733,0.835,1.0)"],
      papel: "vec3(1.0)",
      velo: "0.09",
      caida: "radial-gradient(120% 96% at 76% 112%,#0B54C8 0%,#0F68F4 22%,#5A96FF 44%,#BBD5FF 64%,rgba(255,255,255,0) 82%)"
    },
    /* ---------------------------------------------------------------------
       REGISTROS — violeta del módulo, y la forma es una trama
       Mismo criterio que en incidencias: un solo tono, así que la rampa la
       recorre el valor. Sale del violeta de presión (#4C1D95), pasa por el del
       módulo (--module-registros, #7C3AED) y termina en un lila claro.

       LA FORMA (ver "trama" en hacerFS). El haz de la home es una sola familia
       de filamentos paralelos. Aquí son DOS, cruzadas, y cada hilo pasa por
       encima o por debajo del que se cruza según el orden en que se pintan:
       una tela. Es la figura del módulo —un registro es una trama de controles
       y de fechas— y además es la palabra que ya llevaba el elemento desde el
       principio: la clase del canvas es `ds-hero__weave`.

       El cruce no es simétrico a propósito: +25° y -23°, y la segunda familia
       algo más fina y más corta de amplitud. Con los dos ángulos iguales y
       opuestos salía un enrejado de rombos regulares, que es un patrón, no un
       tejido.
       --------------------------------------------------------------------- */
    registros: {
      forma: "trama",
      c: ["vec3(0.298,0.114,0.584)", "vec3(0.357,0.129,0.714)", "vec3(0.486,0.227,0.929)",
          "vec3(0.604,0.420,0.961)", "vec3(0.718,0.608,0.980)", "vec3(0.878,0.831,0.996)"],
      papel: "vec3(1.0)",
      velo: "0.09",
      caida: "linear-gradient(28deg,rgba(255,255,255,0) 40%,#9A6BF5 58%,#7C3AED 74%,#5B21B6 88%,#DCCFFE 100%)"
    },
    /* ---------------------------------------------------------------------
       ACCIONES Y NO CONFORMIDADES — naranja del módulo, y la forma es un abanico
       Un solo tono otra vez, y otra vez lo recorre el valor: del naranja
       quemado (#7C2D12) al del módulo (--module-acciones, #F97316) y de ahí a
       un melocotón claro. El naranja es el color que el sistema reserva para
       lo que hay que hacer —acciones fuera de plazo, avisos— así que es el que
       más pide contención: va sobre papel blanco y sin llegar nunca al rojo,
       que en el producto significa otra cosa (KO, crítico).

       LA FORMA (ver "abanico" en hacerFS). Es la figura del módulo y la única
       de las cuatro que no es un patrón repetido: los trece filamentos NACEN
       DEL MISMO PUNTO y se van abriendo. Una desviación entra por un sitio y
       se abre en acciones con su responsable y su plazo. Por eso los hilos
       también engordan según se alejan del origen: al principio son uno solo y
       al final son trece cosas distintas.
       --------------------------------------------------------------------- */
    acciones: {
      forma: "abanico",
      c: ["vec3(0.486,0.176,0.071)", "vec3(0.710,0.282,0.047)", "vec3(0.918,0.416,0.039)",
          "vec3(0.976,0.451,0.086)", "vec3(0.992,0.639,0.353)", "vec3(1.0,0.867,0.749)"],
      papel: "vec3(1.0)",
      velo: "0.09",
      caida: "conic-gradient(from 62deg at 6% 68%,rgba(255,255,255,0) 0deg,#B5480C 26deg,#F97316 48deg,#FDA35A 68deg,rgba(255,255,255,0) 92deg)"
    },
    /* ---------------------------------------------------------------------
       KPIS Y DASHBOARDS — todos los colores, uno por columna
       Ésta es la excepción a la regla de las otras tres páginas de módulo. Allí
       hay un solo tono porque hay un solo módulo: azul en incidencias, violeta
       en registros, naranja en acciones. Aquí el módulo no tiene color propio
       que defender —el cian de KPIs es el del tablero, no el del dato—, porque
       lo que hace la página es juntar lo que sale de TODOS los demás.

       Así que no hay rampa: hay seis tintas, las seis del sistema, y cada
       columna toma una. La regla de siempre —el color es el del módulo del que
       sale el dato— se cumple mejor con seis columnas de seis colores que con
       trece del mismo. Es también lo que dibuja el gráfico de la página unos
       cientos de píxeles más abajo (.kpiviz, ds/sections.css): mismo criterio,
       otra técnica.

       El grafito de Activos entra como una más. Es un color de módulo aunque no
       sea vistoso, y quitarlo por eso sería decidir que la paleta del sistema
       tiene colores de primera y de segunda.

       Lo que NO cambia es el material: cada columna sigue siendo el filamento
       de siempre, oscuro en la base y claro en la punta. El valor lo sigue
       poniendo la luz; el tono, ahora, sólo dice de dónde viene el dato.
       --------------------------------------------------------------------- */
    kpis: {
      forma: "barras",
      /* Las seis de ds/tokens.css, en el orden en que se leen en el producto. */
      mods: ["vec3(0.059,0.408,0.957)",  /* incidencias */
             "vec3(0.976,0.451,0.086)",  /* acciones    */
             "vec3(0.486,0.227,0.929)",  /* registros   */
             "vec3(0.000,0.639,0.878)",  /* kpis        */
             "vec3(0.659,0.333,0.969)",  /* ia          */
             "vec3(0.231,0.263,0.298)"], /* activos     */
      papel: "vec3(1.0)",
      velo: "0.09",
      caida: "linear-gradient(90deg,#0F68F4 0%,#F97316 20%,#7C3AED 40%,#00A3E0 60%,#A855F7 80%,#3B434C 100%)"
    },
    /* ---------------------------------------------------------------------
       DOCUMENTOS — la rampa de marca, y la forma es una pila de hojas
       LA ÚNICA DE LAS CINCO QUE NO LLEVA COLOR DE MÓDULO, y no es un olvido:
       el sistema **no tiene tinte para Documentos** —los seis valores de
       `.scene[data-module]` son incidencias, acciones, checklists, activos,
       kpis e ia—, y teñir la hero con el color de otro módulo es justo lo que
       prohíbe la regla del tinte. Lo mismo que ya obligó a que el icono del
       recurso fuera en tinta y a que la escena de la página vaya con bocadillo.

       Así que lleva la rampa de marca, la misma de la home, con sus números
       exactos. Lo que distingue a la página es la forma. Si algún día se
       decide un color propio para Documentos —está anotado como pendiente en
       CLAUDE.md—, se cambia aquí `c` y no hace falta tocar nada más.

       LA FORMA (ver "pila" en hacerFS). Trece hojas apiladas: bandas planas y
       cortadas por los extremos, cada una un escalón más arriba y más a la
       izquierda que la de debajo. Es la figura que dejó la pila de recursos
       que vivía en esta hero hasta el 9 de septiembre de 2026 —cascada en
       diagonal, escalón hacia arriba y a la izquierda, que es como se reconoce
       un archivador—: se retiran las fichas y la figura se queda, hecha
       material. Por eso las hojas tienen PRINCIPIO Y FINAL, que es lo que
       ninguna de las otras cuatro formas tiene: un haz, unos anillos o una
       trama son patrones y siguen fuera del cuadro; una pila se cuenta con sus
       cantos, y son los cantos escalonados los que dicen que hay orden y no un
       montón.

       Y el color viaja POR LA PILA, no a lo largo de cada hoja: la de abajo es
       el azul de presión y la de arriba el naranja del final de la rampa, cada
       una de un tono y con su luz. En la home la rampa la recorre cada cinta
       —el haz va de un sitio a otro—; aquí no hay recorrido que contar, hay
       orden, y trece hojas de un tono cada una se leen como trece cosas
       distintas archivadas, que es de lo que va la página.
       --------------------------------------------------------------------- */
    documentos: {
      forma: "pila",
      /* Los números de `marca`, sin tocar: es la rampa del prototipo. */
      c: ["vec3(0.043,0.329,0.784)", "vec3(0.059,0.408,0.957)", "vec3(0.353,0.588,1.0)",
          "vec3(0.486,0.227,0.929)", "vec3(0.827,0.310,0.616)", "vec3(0.976,0.451,0.086)"],
      papel: "vec3(1.0)",
      velo: "0.09",
      caida: "repeating-linear-gradient(9deg,rgba(255,255,255,0) 0 26px,rgba(15,104,244,.10) 26px 30px),linear-gradient(9deg,rgba(255,255,255,0) 40%,#5A96FF 60%,#7C3AED 80%,#F97316 100%)"
    }
  };

  /* La rampa es común a las dos formas: cinco tramos entre las seis paradas de
     la paleta. */
  function rampa(p) { return [
    "vec3 ramp(float t){t=clamp(t,0.0,1.0);",
    "vec3 c=mix(" + p.c[0] + "," + p.c[1] + ",smoothstep(0.0,0.20,t));",
    "c=mix(c," + p.c[2] + ",smoothstep(0.20,0.38,t));",
    "c=mix(c," + p.c[3] + ",smoothstep(0.38,0.60,t));",
    "c=mix(c," + p.c[4] + ",smoothstep(0.60,0.80,t));",
    "return mix(c," + p.c[5] + ",smoothstep(0.80,1.0,t));}"
  ].join("\n"); }

  /* ---------------------------------------------------------------------------
     FORMA "ONDA" — anillos que salen de un punto
     Es el mismo filamento del haz: una banda de medio ancho variable, con su
     normal falsa para que tenga bulto, la misma luz y el mismo brillo. Lo único
     que cambia es la coordenada sobre la que se dibuja. En el haz, la banda
     número i vive a una altura fija y ondula a lo largo de la x; aquí vive a un
     RADIO fijo desde el origen y ondula a lo largo del ángulo. Trece anillos en
     vez de trece filas.

     Los anillos no se desplazan hacia fuera. Se pensó y se descartó: un anillo
     que crece tiene que nacer y morir en algún sitio, y eso son dos parpadeos
     por vuelta. Ondulando —que es lo que ya hacía el haz— el movimiento es
     continuo y no hay nada que reciclar.

     EL LAVADO VA AL CENTRO, NO A UN LADO. En el haz, el papel se abre a la
     izquierda porque ahí es donde vive el texto. Esta página lleva la hero
     centrada, así que el lavado se abre en el medio: los anillos quedan de
     halo alrededor del titular y el centro se queda en papel limpio.
     --------------------------------------------------------------------------- */
  function fsOnda(p) { return [
    "precision highp float;uniform vec2 uRes;uniform float uT;",
    rampa(p),
    "void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    "vec2 q=(uv-0.5)*vec2(asp,1.0);",
    /* EL CAMPO DE ANILLOS ENCOGE CON LA PANTALLA.
       Un haz diagonal cruza igual una pantalla ancha que una estrecha. Unos
       anillos, no: en el teléfono la hero es más alta que ancha, sólo caben
       cinco o seis y quedan como rayas sueltas muy separadas. `k` mide cuánto
       se aparta la pantalla del apaisado de escritorio (2.2:1) y encoge con
       ella los radios, la amplitud, el ancho de banda y el desvanecido — o
       sea, el dibujo entero—, de modo que en cualquier proporción se ven los
       mismos anillos y con la misma densidad. A partir de 2.2:1 vale 1 y no
       toca nada: el ajuste de escritorio se queda como está. */
    "float k=clamp(asp/2.2,0.46,1.0);",
    /* MÁS ANILLOS VISIBLES EN MÓVIL (14 sep 2026, segunda vuelta). `rad` sigue
       encogiendo con `k` para conservar el ritmo —es lo que impide que los
       anillos se conviertan en rayas sueltas—, pero el radio del anillo más
       lejano (0.42+12*0.115=1.80, ×k) se acercaba al arranque del
       desvanecido de abajo (1.62×k): en el móvil más estrecho, dos o tres
       anillos ya nacían medio disueltos y sólo quedaban cinco o seis
       enteros, que es la «raya sueltas» que se quería evitar y que volvió a
       aparecer. `kd` separa el desvanecido del encogido: se acerca menos a
       `k`, así que el borde de fuera se aparta lo bastante para que los
       trece anillos lleguen completos. */
    "float kd=mix(k,1.0,0.62);",
    /* El origen sale del marco por abajo y por la derecha: el primer anillo ya
       entra abierto, sin que se vea el punto del que nace. */
    "vec2 o=vec2(0.20*asp,-0.56*k);",
    "vec2 v=q-o;float r=length(v);float ang=atan(v.y,v.x);",
    "vec2 dir=v/max(r,0.0001);",
    "vec3 col=" + p.papel + ";float alp=0.0;",
    "for(int i=0;i<13;i++){float fi=float(i);",
    "float ph=fi*0.72;",
    "float amp=(0.052+0.026*sin(fi*1.3))*kd;",
    /* El primer anillo arranca lejos del origen a propósito: cuando el radio
       se acerca a la amplitud de la ondulación, la banda se dobla sobre sí
       misma y deja un gancho a la vista. Con 0.42 de salida, ningún anillo
       llega a esa situación. */
    "float rad=(0.42+fi*0.115)*k;",
    "float c=rad+amp*sin(ang*2.4+uT*0.22+ph)+0.030*sin(ang*1.1-uT*0.15+ph*1.6);",
    "float hw=(0.030+0.020*sin(ang*1.7+uT*0.20+ph*1.4)+0.0018*fi)*kd;",
    "float d=(r-c)/hw;",
    "float m=1.0-clamp(abs(d),0.0,1.0);",
    "float rnd=sqrt(max(m*(2.0-m),0.0));",
    /* La normal se levanta desde la dirección radial —que es la que cruza la
       banda— y no desde el eje x, que es lo que la haría plana en los anillos
       de arriba. */
    "vec2 n=normalize(dir*clamp(d,-1.0,1.0)+vec2(0.0,1.0)*max(rnd,0.05));",
    "float lam=clamp(dot(n,normalize(vec2(-0.40,0.92))),0.0,1.0);",
    /* El color va con la distancia al origen: dentro, el azul de presión;
       fuera, el hielo. */
    "float ht=0.01+(r/k)*0.34+fi*0.014+0.05*sin(ang*0.8+uT*0.11);",
    "vec3 cc=ramp(ht)*(0.50+0.64*lam)+vec3(1.0)*pow(lam,26.0)*0.20*k*k+vec3(0.121,0.839,0.960)*pow(lam,44.0)*0.22*k*k;",
    "float a=smoothstep(0.0,0.55,m)*(0.72+0.20*sin(fi*2.1+uT*0.2));",
    "col=mix(col,cc,a);alp=alp+(1.0-alp)*a;}",
    /* Los anillos se deshacen al alejarse, que es lo que hace el borde de una
       onda y lo que evita que el último se lea como un aro cerrado. */
    "alp*=1.0-smoothstep(1.62*kd,2.18*kd,r);",
    /* El lavado, en el medio. */
    "float wash=smoothstep(0.14*k,0.86*k,length(q*vec2(0.58,1.0)));",
    "col=mix(" + p.papel + ",col,0.30+0.70*wash);",
    "alp*=0.24+0.76*wash;",
    "col=mix(col," + p.papel + "," + p.velo + ");",
    "if(alp<0.004)discard;",
    "gl_FragColor=vec4(col,clamp(alp,0.0,1.0));}"
  ].join("\n"); }

  /* ---------------------------------------------------------------------------
     FORMA "TRAMA" — dos familias de filamentos que se cruzan
     El haz de la home rota el plano un ángulo y dibuja trece filamentos
     paralelos. Aquí el bucle es el mismo, pero cada vuelta elige a qué familia
     pertenece el hilo y rota el plano a un ángulo o al otro. Siete hilos por
     familia, catorce en total: los mismos que dibujaba el haz.

     POR QUÉ SE VE COMO UNA TELA Y NO COMO UNA REJILLA. Los filamentos se pintan
     uno detrás de otro con `mix`, así que en cada cruce el último tapa al
     anterior. Alternando las familias en el bucle —par a una, impar a la otra—
     los cruces se van turnando y el ojo lee un hilo pasando por encima de otro.
     Si se pintaran las dos familias seguidas, una quedaría entera por encima de
     la otra y sería una rejilla pegada a un fondo.

     El grosor y la amplitud de la segunda familia son menores: en una tela la
     urdimbre y la trama no son el mismo hilo, y con los dos iguales el cruce se
     lee como un enrejado.
     --------------------------------------------------------------------------- */
  function fsTrama(p) { return [
    "precision highp float;uniform vec2 uRes;uniform float uT;",
    rampa(p),
    "void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    "vec2 p0=(uv-0.5)*vec2(asp,1.0);",
    /* El mismo `k` que las otras cuatro formas corregidas. Ésta era la única
       de las seis que se había quedado sin él por completo: ni la geometría
       ni —hasta este mismo commit— el brillo lo tenían en cuenta. Sin `k`,
       en un móvil en vertical los catorce hilos de la trama, calibrados a
       un ancho de escritorio, se apretaban hasta solaparse igual que le
       pasaba al haz antes de arreglarlo. */
    "float k=clamp(asp/2.2,0.46,1.0);",
    /* LA TRAMA SE ESPESA EN MÓVIL (14 sep 2026, segunda vuelta). `k` sola
       encogía los catorce hilos hasta dejarlos en una raya fina y pálida en
       una esquina: bien para no solaparlos, mal para que la tela se lea como
       material y no como un rasguño. `grosor` se acerca a 1 cuanto más
       estrecho el aspecto y engorda hilo, amplitud y separación A LA VEZ, así
       que la trama entera crece de tamaño sin que un hilo empiece a comerse
       al de al lado —lo que sí pasaría subiendo sólo `hw`—. En escritorio
       (k=1) no cambia nada. */
    "float mov=1.0-k;",
    "float grosor=k+mov*0.70;",
    "vec3 col=" + p.papel + ";float alp=0.0;",
    "for(int i=0;i<14;i++){float fi=float(i);",
    /* Par → urdimbre; impar → trama. La alternancia es lo que teje. */
    "float fam=mod(fi,2.0);",
    "float fj=floor(fi*0.5);",
    "float ca=cos(mix(0.42,-0.66,fam)),sa=sin(mix(0.42,-0.66,fam));",
    "vec2 q=vec2(p0.x*ca+p0.y*sa,-p0.x*sa+p0.y*ca);",
    "q.y-=0.06;",
    "float ph=fj*0.94+fam*0.62;",
    "float amp=(0.078+0.030*sin(fj*1.3))*(1.0-0.28*fam)*grosor;",
    "float c=amp*sin(q.x*1.15+uT*0.24+ph)+0.050*grosor*sin(q.x*0.52-uT*0.16+ph*1.6)+(fj-3.0)*0.098*grosor;",
    "float hw=(0.048+0.026*sin(q.x*0.80+uT*0.20+ph*1.4)+0.002*fj)*(1.0-0.22*fam)*grosor;",
    "float d=(q.y-c)/hw;",
    "float m=1.0-clamp(abs(d),0.0,1.0);",
    "float rnd=sqrt(max(m*(2.0-m),0.0));",
    "vec2 n=normalize(vec2(clamp(d,-1.0,1.0),max(rnd,0.05)));",
    "float lam=clamp(dot(n,normalize(vec2(-0.40,0.92))),0.0,1.0);",
    "float ht=0.20+q.x*0.30+fj*0.022+0.06*fam+0.05*sin(q.x*0.45+uT*0.11);",
    "vec3 cc=ramp(ht)*(0.50+0.64*lam)+vec3(1.0)*pow(lam,26.0)*0.13*k*k+vec3(0.121,0.839,0.960)*pow(lam,44.0)*0.16*k*k;",
    "float a=smoothstep(0.0,0.55,m)*(0.72+0.20*sin(fi*2.1+uT*0.2));",
    "col=mix(col,cc,a);alp=alp+(1.0-alp)*a;}",
    /* La tela se deshila por el borde de abajo a la izquierda, que es por donde
       entra la página. */
    "alp*=smoothstep(-1.48,-0.52,p0.x*0.86+p0.y*0.52);",
    /* Hero centrada: el papel se abre en el medio, como en la onda. */
    "float wash=smoothstep(0.08,0.58,length(p0*vec2(0.52,1.0)));",
    "col=mix(" + p.papel + ",col,0.30+0.70*wash);",
    "alp*=0.24+0.76*wash;",
    "col=mix(col," + p.papel + "," + p.velo + ");",
    "if(alp<0.004)discard;",
    "gl_FragColor=vec4(col,clamp(alp,0.0,1.0));}"
  ].join("\n"); }

  /* ---------------------------------------------------------------------------
     FORMA "ABANICO" — trece filamentos que salen del mismo punto
     Las otras tres formas son patrones: cambias de sitio y ves lo mismo. Ésta
     no. Hay un origen —fuera del cuadro, a la izquierda— y todo sale de ahí.

     La cuenta es la misma que en el haz, sólo que el ángulo de giro deja de ser
     una constante y pasa a ser el índice del hilo: cada filamento gira lo suyo
     alrededor del origen, así que en vez de trece paralelas hay trece radios.
     Como el giro se hace sobre el vector que va del origen al píxel, la x del
     sistema girado es la distancia recorrida por el hilo, y eso da gratis dos
     cosas que el haz no tenía:

       · el ancho crece con la distancia (`hw` va multiplicado por ella): los
         hilos salen finos, casi uno solo, y acaban gruesos y separados;
       · el color también, porque la rampa se lee sobre esa misma distancia.

     Detrás del origen no se pinta nada (`smoothstep` sobre la distancia): sin
     eso, cada hilo tiene su reflejo al otro lado y el abanico sale doble.
     --------------------------------------------------------------------------- */
  function fsAbanico(p) { return [
    "precision highp float;uniform vec2 uRes;uniform float uT;",
    rampa(p),
    "void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    "vec2 p0=(uv-0.5)*vec2(asp,1.0);",
    /* El mismo `k` que la onda: en una pantalla alta el abanico recorre la
       mitad de distancia, y como aquí el grosor, la amplitud y el color van con
       la distancia recorrida, sin corregirlo el abanico sale fino y descolorido
       en el teléfono. Dividiendo la distancia por k, el hilo llega igual de
       abierto y de teñido al borde del cuadro, mida lo que mida. */
    "float k=clamp(asp/2.2,0.46,1.0);",
    /* El origen, fuera del cuadro por la izquierda y algo por debajo del eje:
       dentro se vería el punto en el que se tocan los trece, que es el único
       sitio donde esto parecería un gráfico y no un material. */
    "vec2 piv=vec2(-0.66*asp,-0.34*k);",
    "vec2 v=p0-piv;",
    "vec3 col=" + p.papel + ";float alp=0.0;",
    "for(int i=0;i<13;i++){float fi=float(i);",
    "float ph=fi*0.72;",
    "float th=0.06+(fi-6.0)*0.078;",
    "float ca=cos(th),sa=sin(th);",
    "vec2 q=vec2(v.x*ca+v.y*sa,-v.x*sa+v.y*ca);",
    "float dist=max(q.x,0.0)/k;",
    "float amp=(0.030+0.014*sin(fi*1.3))*dist*k;",
    "float c=amp*sin(q.x*1.05+uT*0.24+ph)+0.030*dist*k*sin(q.x*0.48-uT*0.16+ph*1.6);",
    "float hw=(0.020+0.013*sin(q.x*0.72+uT*0.20+ph*1.4))*k*(0.34+0.92*dist);",
    "float d=q.y/max(hw,0.0001)-c/max(hw,0.0001);",
    "float m=1.0-clamp(abs(d),0.0,1.0);",
    "float rnd=sqrt(max(m*(2.0-m),0.0));",
    "vec2 n=normalize(vec2(clamp(d,-1.0,1.0),max(rnd,0.05)));",
    "float lam=clamp(dot(n,normalize(vec2(-0.40,0.92))),0.0,1.0);",
    "float ht=0.02+dist*0.26+fi*0.014+0.05*sin(q.x*0.42+uT*0.11);",
    "vec3 cc=ramp(ht)*(0.50+0.64*lam)+vec3(1.0)*pow(lam,26.0)*0.16*k*k+vec3(0.121,0.839,0.960)*pow(lam,44.0)*0.10*k*k;",
    "float a=smoothstep(0.0,0.55,m)*(0.72+0.20*sin(fi*2.1+uT*0.2));",
    /* Nada por detrás del origen, y arranque suave para que el punto de salida
       no se lea como un vértice. */
    "a*=smoothstep(0.02,0.62,dist);",
    "col=mix(col,cc,a);alp=alp+(1.0-alp)*a;}",
    /* Hero centrada: el papel se abre en el medio, como en las otras dos. */
    "float wash=smoothstep(0.10*k,0.66*k,length(p0*vec2(0.54,1.0)));",
    "col=mix(" + p.papel + ",col,0.30+0.70*wash);",
    "alp*=0.24+0.76*wash;",
    "col=mix(col," + p.papel + "," + p.velo + ");",
    "if(alp<0.004)discard;",
    "gl_FragColor=vec4(col,clamp(alp,0.0,1.0));}"
  ].join("\n"); }

  /* ---------------------------------------------------------------------------
     FORMA "BARRAS" — el filamento, puesto de pie y cortado a una altura
     Las otras cuatro formas son materiales: se repiten y no dicen nada. Ésta
     dice algo, porque la página va justamente de eso.

     Cada columna es el mismo filamento del haz con dos cambios: se mide de
     través en la x en vez de en la y —de ahí sale el bulto y la luz, igual que
     antes— y se recorta arriba y abajo con dos `smoothstep`, uno en la línea de
     base y otro en su altura. El de arriba es más blando que el de abajo: una
     barra se apoya en su base y se desvanece por la punta, y con los dos cortes
     iguales parecía un ladrillo.

     LA ALTURA RESPIRA, y es lo único que se mueve. Va con un seno lento y
     desfasado por columna, así que el conjunto sube y baja sin que se vea un
     ciclo. No es un dato: es que un cuadro de mando en tiempo real no está
     quieto, y una hero de KPIs congelada se lee como una captura.

     El color sube con la barra —la rampa se lee sobre la altura relativa, no
     sobre la pantalla—, así que todas las columnas empiezan oscuras en la base
     y aclaran hacia la punta midan lo que midan. Es lo que hace que se lean
     como trece cosas del mismo tipo y no como trece colores.
     --------------------------------------------------------------------------- */
  function fsBarras(p) { return [
    "precision highp float;uniform vec2 uRes;uniform float uT;",
    /* Seis tintas y un selector, en vez de una rampa. No es un array: GLSL ES
       1.0 sólo deja indexar arrays con expresiones constantes, y el índice de
       la columna no lo es en todos los drivers. Con `step` encadenado el
       resultado es el mismo y compila en cualquier sitio. */
    "vec3 tinta(float i){float m=mod(i,6.0);",
    "vec3 c=" + p.mods[0] + ";",
    "c=mix(c," + p.mods[1] + ",step(0.5,m));",
    "c=mix(c," + p.mods[2] + ",step(1.5,m));",
    "c=mix(c," + p.mods[3] + ",step(2.5,m));",
    "c=mix(c," + p.mods[4] + ",step(3.5,m));",
    "c=mix(c," + p.mods[5] + ",step(4.5,m));",
    "return c;}",
    "void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    "vec2 q=(uv-0.5)*vec2(asp,1.0);",
    /* El mismo `k` que la onda y el abanico: en una pantalla alta las columnas
       se salen por arriba y se juntan por los lados. Encoge el gráfico entero
       —separación, anchura, altura y línea de base— y con él la escala. */
    "float k=clamp(asp/2.2,0.46,1.0);",
    /* La línea de base NO encoge con la pantalla: se queda pegada abajo. Lo que
       encoge es lo que crece desde ella —altura, anchura y separación—, así que
       en un teléfono las columnas quedan cortas y en el tercio inferior, que es
       justo donde el texto no está. Con la base escalada se subían al medio y
       cruzaban el subtítulo. */
    /* Y AUN ASÍ SE QUEDABAN DEMASIADO ABAJO (14 sep 2026, segunda vuelta). En
       el móvil el titular ocupa casi toda la hero —cuatro líneas más el
       subtítulo y los dos botones apilados—, así que el tercio inferior de
       verdad es mucho más estrecho que en escritorio y las barras salían
       pegadas al canto mismo, la mitad tapadas por lo que viene debajo de la
       hero. `mov` (0 en escritorio) sube la base un poco y da algo más de
       altura; el lavado de la línea 511 —el que ya deshacía la barra alta
       antes de tocar el titular— sigue siendo el que impide que la columna
       más alta llegue a pisar el texto: no hace falta tocarlo. */
    "float mov=1.0-k;",
    "float base=-0.46+mov*0.34;",
    "vec3 col=" + p.papel + ";float alp=0.0;",
    "for(int i=0;i<13;i++){float fi=float(i);",
    "float ph=fi*0.72;",
    "float cx=(fi-6.0)*0.150*k;",
    "float hw=(0.057+0.011*sin(fi*2.1))*k;",
    "float alt=(0.20+0.52*(0.5+0.5*sin(fi*1.37+uT*0.20+ph*0.4)))*(k+mov*0.30);",
    "float top=base+alt;",
    "float dx=(q.x-cx)/hw;",
    "float mx=1.0-clamp(abs(dx),0.0,1.0);",
    /* Punta blanda, base firme. */
    "float my=smoothstep(0.0,0.070*k,top-q.y)*smoothstep(0.0,0.016*k,q.y-base);",
    "float m=mx*my;",
    "float rnd=sqrt(max(m*(2.0-m),0.0));",
    "vec2 n=normalize(vec2(clamp(dx,-1.0,1.0),max(rnd,0.05)));",
    "float lam=clamp(dot(n,normalize(vec2(-0.40,0.92))),0.0,1.0);",
    /* El recorrido de la columna ya no cambia de tono: cambia de valor. Abajo,
       la tinta al 58 %; arriba, la tinta lavada hacia el papel. Es lo que hace
       que seis colores distintos se lean como seis columnas del mismo gráfico y
       no como seis cosas sin relación. */
    "float rel=clamp((q.y-base)/max(alt,0.001),0.0,1.0);",
    "vec3 tin=tinta(fi);",
    "vec3 tono=mix(tin*0.82,mix(tin," + p.papel + ",0.18),pow(rel,0.92));",
    "vec3 cc=tono*(0.50+0.64*lam)+vec3(1.0)*pow(lam,26.0)*0.20*k*k+vec3(0.121,0.839,0.960)*pow(lam,44.0)*0.22*k*k;",
    "float a=smoothstep(0.0,0.50,m)*(0.84+0.12*sin(fi*2.1+uT*0.2));",
    "col=mix(col,cc,a);alp=alp+(1.0-alp)*a;}",
    /* La línea de base, que es lo que convierte trece manchas en un gráfico.
       Va del color del módulo y muy tenue: se ve, no se lee. */
    "float lin=smoothstep(0.0035*k,0.0,abs(q.y-base))*smoothstep(1.05*k,0.80*k,abs(q.x));",
    "col=mix(col,vec3(0.545,0.573,0.612),lin*0.55);alp=alp+(1.0-alp)*lin*0.55;",
    /* EL LAVADO, AQUÍ, ES UNA BANDA, NO UN CÍRCULO. En las otras formas el
       material está repartido por todo el cuadro y basta con abrir el papel en
       el medio. Las columnas viven abajo y suben, así que un círculo centrado
       —o una elipse— las dejaba desteñidas justo en el tramo que más se ve.

       Sólo cuenta la altura: el papel se abre en la franja del titular y el
       color vuelve entero en cuanto se baja hacia la línea de base. El efecto
       es el que se quiere en un cable: sólido abajo y deshaciéndose al entrar
       en el texto. Los lados no hacen falta —el velo de `.ds-hero--centro`
       (ds/hero.css) es el que sostiene la legibilidad—. */
    /* Y la banda del texto tampoco encoge, por lo mismo pero al revés: en una
       pantalla estrecha el titular ocupa MÁS alto, no menos. Umbrales fijos. */
    "float wash=smoothstep(0.13,0.30,abs(q.y+0.02));",
    "col=mix(" + p.papel + ",col,0.30+0.70*wash);",
    "alp*=0.24+0.76*wash;",
    "col=mix(col," + p.papel + "," + p.velo + ");",
    "if(alp<0.004)discard;",
    "gl_FragColor=vec4(col,clamp(alp,0.0,1.0));}"
  ].join("\n"); }

  /* ---------------------------------------------------------------------------
     FORMA "PILA" — trece hojas cortadas por los cantos
     El filamento es el mismo de siempre —medio ancho variable, normal falsa,
     la misma luz y el mismo brillo—, con dos cambios que lo convierten en una
     hoja de papel:

       · ONDULA MUCHO MENOS. La cinta del haz oscila 0.070; aquí, 0.020. Una
         hoja de papel apoyada en una pila no hace olas: se comba. Con la
         amplitud del haz la pila parecía trece cintas puestas en horizontal.
       · TIENE PRINCIPIO Y FINAL (`mlon`). Los otros cuatro dibujos son
         patrones y se salen del cuadro por los cuatro lados; aquí el corte es
         el argumento, porque una pila se reconoce por los cantos escalonados y
         no por las hojas. Los extremos van suavizados —0.055 y 0.075— para que
         el canto sea papel y no un corte de tijera.

     EL ESCALÓN, LOS MISMOS 74 Y 14 PX DE LA PILA QUE HABÍA, en proporción: hacia
     arriba mucho, hacia la izquierda poco. Con el escalón a la derecha la pila
     crece contra el borde de la ventana; hacia la izquierda crece hacia el
     hueco de la hero, y lo que asoma de cada hoja es su principio.

     LA PILA SE ABANICA, y es lo único que se mueve además de la comba: el
     escalón horizontal respira con un seno muy lento (0.13 rad/s), así que el
     conjunto se abre y se cierra como una baraja que se hojea. No se desplaza
     ninguna hoja: nada nace ni muere en el cuadro, que es lo que obligaba a los
     anillos de `/incidencias/` a no crecer.

     LA PILA VIVE A LA DERECHA (`cx0`). Esta hero tiene el texto a la izquierda
     —no es de las centradas—, así que el lavado abre el papel por ahí, como en
     el haz de la home, y la pila se desplaza al hueco que queda libre. Si algún
     día la hero pasa a centrada, hay que mover las dos cosas a la vez.
     --------------------------------------------------------------------------- */
  function fsPila(p) { return [
    "precision highp float;uniform vec2 uRes;uniform float uT;",
    rampa(p),
    "void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    "vec2 p0=(uv-0.5)*vec2(asp,1.0);",
    /* El mismo `k` que la onda, el abanico y las barras: en una pantalla alta
       la pila se sale por arriba y las hojas se pisan. Encoge el escalón, el
       grosor, la comba y el largo —el dibujo entero— y con él la escala. */
    "float k=clamp(asp/2.2,0.46,1.0);",
    /* El plano de la pila: una sola inclinación para las trece hojas. Es la de
       la cascada de recursos que había aquí, no un ángulo nuevo. */
    "float ca=cos(0.15),sa=sin(0.15);",
    "vec2 q=vec2(p0.x*ca+p0.y*sa,-p0.x*sa+p0.y*ca);",
    /* El abanico de la baraja: el escalón horizontal se abre y se cierra.
       Va en unidades de ANCHO (`asp`) y no de `k`, que es la única cuenta de
       esta forma que no se copia de las otras cuatro: el escalón reparte trece
       hojas de lado a lado, así que lo que tiene que caber es la pantalla. Con
       `k` —que es una corrección de escala, no de reparto— en un teléfono la
       pila se abría más de lo que mide el cuadro y las tres o cuatro hojas de
       abajo se quedaban fuera por la derecha. */
    "float sep=(0.047+0.010*sin(uT*0.13))*asp;",
    "vec3 col=" + p.papel + ";float alp=0.0;",
    "for(int i=0;i<13;i++){float fi=float(i);",
    "float ph=fi*0.72;",
    "float esc=fi-6.0;",
    /* Arriba, el escalón entero; a la izquierda, la pestaña. El vertical
       encoge a medias (0.62+0.38k) y no del todo: en una pantalla alta sobra
       sitio por arriba y por abajo, y una pila encogida entera se quedaba en
       una franja fina en el medio. */
    /* EN MÓVIL LA PILA SE VA ARRIBA Y A LA DERECHA (14 sep 2026). En
       escritorio vive a la derecha del texto, que ocupa el 76 %. Por debajo
       de 900px el texto pasa a 100 % de ancho y la pila, centrada en el
       lienzo, cruzaba el párrafo de /gestor-documental/ —captura del
       cliente—. Se probaron dos salidas y las dos se descartaron el mismo
       día: atenuarla a un cuarto de opacidad (dejaba de parecerse a la de
       escritorio) y sacarla a una banda encima del texto (rechazada
       expresamente: «quiero que sea como en PC y esté en el fondo»). Lo
       que sí vale es lo que hace el haz de la home, que el cliente dio por
       bueno: el material queda detrás del texto pero en la esquina
       superior derecha, donde el lavado lo deja vivo y bajo el titular sólo
       asoma su borde lavado. `mov` es 0 en escritorio (k=1), así que allí
       no cambia nada, y en el móvil más estrecho desplaza la pila un 42 %
       del ancho a la derecha y 0.45 del alto hacia arriba. */
    "float mov=1.0-k;",
    "float cy=esc*0.058*(0.62+0.38*k)-0.075*k+mov*0.45;",
    "float cx=0.26*asp-esc*sep+mov*0.42*asp;",
    /* La comba del papel, no la onda de la cinta. */
    "float c=cy+0.020*k*sin(q.x*0.78+uT*0.16+ph)+0.009*k*sin(q.x*0.36-uT*0.11+ph*1.7);",
    "float hw=(0.021+0.005*sin(q.x*0.62+uT*0.18+ph*1.3))*k;",
    "float d=(q.y-c)/hw;",
    "float m=1.0-clamp(abs(d),0.0,1.0);",
    "float rnd=sqrt(max(m*(2.0-m),0.0));",
    "vec2 n=normalize(vec2(clamp(d,-1.0,1.0),max(rnd,0.05)));",
    "float lam=clamp(dot(n,normalize(vec2(-0.40,0.92))),0.0,1.0);",
    /* Los cantos. `largo` va con el ancho de la pantalla para que en cualquier
       proporción la hoja cruce lo mismo. */
    "float largo=0.20*asp+0.10*k;",
    "float mlon=smoothstep(0.0,0.055,q.x-(cx-largo))*smoothstep(0.0,0.075,(cx+largo)-q.x);",
    /* El tono lo pone la ALTURA EN LA PILA, no el recorrido de la hoja. Un
       apunte de x para que una hoja no sea una barra de color plano. */
    "float ht=0.03+(fi/12.0)*0.88+q.x*0.055+0.030*sin(q.x*0.40+uT*0.11);",
    "vec3 cc=ramp(ht)*(0.50+0.64*lam)+vec3(1.0)*pow(lam,26.0)*0.20*k*k+vec3(0.121,0.839,0.960)*pow(lam,44.0)*0.22*k*k;",
    "float a=smoothstep(0.0,0.55,m)*mlon*(0.72+0.20*sin(fi*2.1+uT*0.2));",
    "col=mix(col,cc,a);alp=alp+(1.0-alp)*a;}",
    /* El lavado abre el papel a la izquierda, que es donde vive el texto de
       esta hero. Los dos umbrales van por `k`: sin escalar, en un móvil
       estrecho `p0.x` nunca baja de un valor bajo el que el lavado cierre
       del todo. */
    "float wash=smoothstep(-0.62*k,0.30*k,p0.x+p0.y*0.10);",
    "col=mix(" + p.papel + ",col,0.30+0.70*wash);",
    "alp*=0.26+0.74*wash;",
    /* Hubo aquí, durante unas horas del 14 de septiembre de 2026, un segundo
       atenuador que bajaba la pila a un cuarto de opacidad en móvil porque el
       párrafo la cruzaba. Se quitó el mismo día: la pila tiene que verse como
       en escritorio, y lo que la saca de debajo del párrafo es `mov` (arriba,
       en cx/cy), no la opacidad. */
    "col=mix(col," + p.papel + "," + p.velo + ");",
    "if(alp<0.004)discard;",
    "gl_FragColor=vec4(col,clamp(alp,0.0,1.0));}"
  ].join("\n"); }

  function hacerFS(p) { if (p.forma === "onda") return fsOnda(p);
                        if (p.forma === "trama") return fsTrama(p);
                        if (p.forma === "abanico") return fsAbanico(p);
                        if (p.forma === "barras") return fsBarras(p);
                        if (p.forma === "pila") return fsPila(p); return [
    "precision highp float;uniform vec2 uRes;uniform float uT;",
    "vec3 ramp(float t){t=clamp(t,0.0,1.0);",
    "vec3 c=mix(" + p.c[0] + "," + p.c[1] + ",smoothstep(0.0,0.20,t));",
    "c=mix(c," + p.c[2] + ",smoothstep(0.20,0.38,t));",
    "c=mix(c," + p.c[3] + ",smoothstep(0.38,0.60,t));",
    "c=mix(c," + p.c[4] + ",smoothstep(0.60,0.80,t));",
    "return mix(c," + p.c[5] + ",smoothstep(0.80,1.0,t));}",
    "void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    "vec2 p=(uv-0.5)*vec2(asp,1.0);",
    /* El mismo `k` que onda/trama/abanico/barras/pila (más abajo en este
       fichero): en un teléfono en vertical `asp` cae muy por debajo del 2.2:1
       de escritorio sobre el que está calibrado el haz, y trece filamentos
       con la misma separación y el mismo grosor absolutos se apretaban en el
       ancho estrecho hasta solaparse — el «cable» se leía como una mancha, no
       como trece hilos. Éste era el único de los seis dibujos sin esta
       corrección: las otras cinco formas la llevan desde que se hicieron para
       páginas de módulo con la hero ya probada en móvil; el haz es el más
       antiguo del prototipo y no la había recibido nunca. */
    "float k=clamp(asp/2.2,0.46,1.0);",
    /* EL HAZ NO SE ADELGAZA EN MÓVIL (14 sep 2026, segunda vuelta). `k` sola
       encogía la franja entera —ancho, ondulación y separación entre los
       trece filamentos— para que no se apretara en un aspecto estrecho, y
       eso es lo correcto para el RITMO. El problema es que en el móvil el
       titular pasa a ocupar el 100% de la columna (ds/hero.css) y el haz es
       lo único que llena el resto del encuadre: encogido del todo, lo que
       queda es una raya azul fina sobre una página en blanco, no un
       material con presencia. `grosor` parte de `k` pero se acerca a 1
       cuanto más estrecho el aspecto, así que la franja se ENSANCHA en vez
       de adelgazar a la vez que encoge. En escritorio (k=1) grosor=k=1: no
       cambia nada, y es la misma variable que ya usan la trama y los
       anillos para el mismo motivo. */
    "float mov=1.0-k;",
    "float grosor=k+mov*0.85;",
    "float ca=cos(0.44),sa=sin(0.44);",
    "vec2 q=vec2(p.x*ca+p.y*sa,-p.x*sa+p.y*ca);",
    "q.y-=0.06;",
    "vec3 col=" + p.papel + ";float alp=0.0;",
    "for(int i=0;i<13;i++){float fi=float(i);",
    "float ph=fi*0.72;",
    "float amp=(0.070+0.028*sin(fi*1.3))*grosor;",
    "float c=amp*sin(q.x*1.15+uT*0.24+ph)+0.046*grosor*sin(q.x*0.52-uT*0.16+ph*1.6)+(fi-6.0)*0.046*grosor;",
    "float hw=(0.034+0.024*sin(q.x*0.80+uT*0.20+ph*1.4)+0.002*fi)*grosor;",
    "float d=(q.y-c)/hw;",
    "float m=1.0-clamp(abs(d),0.0,1.0);",
    "float rnd=sqrt(max(m*(2.0-m),0.0));",
    "vec2 n=normalize(vec2(clamp(d,-1.0,1.0),max(rnd,0.05)));",
    "float lam=clamp(dot(n,normalize(vec2(-0.40,0.92))),0.0,1.0);",
    "float ht=0.06+q.x*0.68+fi*0.024+0.05*sin(q.x*0.45+uT*0.11);",
    /* El brillo especular (el blanco y el cian) va multiplicado por `k*k`, no
       por `k` a secas: en un cable ya fino, el blanco aditivo —pensado para
       una banda ancha de escritorio— seguía leyéndose como un hilo blanco
       pegado al cable y no como un tono de luz DENTRO del cable, aunque ya
       atemperado a la mitad. La corrección lineal no bastaba porque en un
       cable delgado el ojo separa el brillo del color en cuanto ocupa una
       fracción visible del ancho, por poco intenso que sea; con el cuadrado
       de `k` el recorte es mucho más fuerte cuanto más estrecha la pantalla
       (0.21 del original en el móvil más comprimido, frente al 0.46 de
       antes) y en escritorio (k=1) sigue sin cambiar nada. */
    "vec3 cc=ramp(ht)*(0.50+0.64*lam)+vec3(1.0)*pow(lam,26.0)*0.20*k*k+vec3(0.121,0.839,0.960)*pow(lam,44.0)*0.22*k*k;",
    "float a=smoothstep(0.0,0.55,m)*(0.72+0.20*sin(fi*2.1+uT*0.2));",
    "col=mix(col,cc,a);alp=alp+(1.0-alp)*a;}",
    /* El lavado NO va por `k` aquí: el usuario ya confirmó que la home se ve
       bien tal cual, y tocar este umbral es lo que rompió el texto en
       /gestor-documental/ (ver `wash` de la pila, más abajo) sin que nadie
       hubiera reportado un problema aquí. No se arregla lo que no está roto
       a base de una analogía; si algún día se reporta que el haz también
       tapa texto en móvil, el arreglo es el mismo que el de la pila. */
    "alp*=smoothstep(-1.35,-0.34,p.x*0.90+p.y*0.48);",
    "float wash=smoothstep(-0.66,0.28,p.x+p.y*0.10);",
    "col=mix(" + p.papel + ",col,0.30+0.70*wash);",
    "alp*=0.26+0.74*wash;",
    "col=mix(col," + p.papel + "," + p.velo + ");",
    "if(alp<0.004)discard;",
    "gl_FragColor=vec4(col,clamp(alp,0.0,1.0));}"
  ].join("\n"); }

  function mount(cv, opciones) {
    if (!cv) return;
    var p = PALETAS[(opciones && opciones.tema) || "marca"] || PALETAS.marca;

    var gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true, preserveDrawingBuffer: true });
    if (!gl) {
      cv.style.background = p.caida;
      return;
    }

    function mk(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
    var pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, hacerFS(p)));
    gl.linkProgram(pr);
    gl.useProgram(pr);

    var bf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var la = gl.getAttribLocation(pr, "a");
    gl.enableVertexAttribArray(la);
    gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);

    var uR = gl.getUniformLocation(pr, "uRes"), uT = gl.getUniformLocation(pr, "uT");
    gl.clearColor(0, 0, 0, 0);

    function resize() {
      var dpr = Math.min(1.75, window.devicePixelRatio || 1);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uR, cv.width, cv.height);
    }
    window.addEventListener("resize", resize);

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(cv);
    }

    var t0 = performance.now();
    function frame(now) {
      var s = (now - t0) / 1000;
      if (visible) { gl.uniform1f(uT, s); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3); }
      requestAnimationFrame(frame);
    }

    resize();
    if (reduced) { gl.uniform1f(uT, 7.0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    else requestAnimationFrame(frame);
  }

  window.SolvedHeroWave = { mount: mount };
})();
