/* Solved — elemento de la hero de Integraciones ("Convergencia").
   ---------------------------------------------------------------------------
   Hermano de `hero-wave.js`: mismo shader de 13 filamentos, misma rampa de
   marca, misma iluminación y el mismo lavado que abre el papel donde vive el
   texto. La única diferencia es narrativa: los filamentos entran separados y
   en gris —los sistemas que ya tienes— se estrechan en un talle y salen como
   una sola cinta con el color completo de Solved. Muchos sistemas entran,
   una capa sale.

   Los tres controles del relato viven en el shader:
     xw      posición del talle a lo largo del haz
     spread  apertura del abanico (1.28 al entrar → 0.05 en el talle → 0.22 al salir)
     sat     dónde se enciende la rampa de marca (justo después del talle)

   `k` reescala esas posiciones con la relación de aspecto del canvas para que
   la composición aguante igual en móvil que en escritorio.

   Si no hay WebGL cae a un degradado CSS equivalente.
   Registra window.SolvedIntegrationsWeave. */
(function () {
  "use strict";

  var VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}";

  var FS = [
    "precision highp float;uniform vec2 uRes;uniform float uT;",

    /* Rampa de marca — idéntica a la de la hero, no tocar. */
    "vec3 ramp(float t){t=clamp(t,0.0,1.0);",
    "vec3 c=mix(vec3(0.043,0.329,0.784),vec3(0.059,0.408,0.957),smoothstep(0.0,0.20,t));",
    "c=mix(c,vec3(0.353,0.588,1.0),smoothstep(0.20,0.38,t));",
    "c=mix(c,vec3(0.486,0.227,0.929),smoothstep(0.38,0.60,t));",
    "c=mix(c,vec3(0.827,0.310,0.616),smoothstep(0.60,0.80,t));",
    "return mix(c,vec3(0.976,0.451,0.086),smoothstep(0.80,1.0,t));}",

    "void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    "vec2 p=(uv-0.5)*vec2(asp,1.0);",
    "float ca=cos(0.44),sa=sin(0.44);",
    "vec2 q=vec2(p.x*ca+p.y*sa,-p.x*sa+p.y*ca);",
    "q.y-=0.06;",

    /* --- El talle -------------------------------------------------------- */
    "float k=clamp(asp/2.30,0.52,1.20);",
    "float xw=0.18*k;",
    "float pre=smoothstep(-0.95*k,xw,q.x);",
    "float post=smoothstep(xw,1.35*k,q.x);",
    "float spread=mix(1.28,0.05,pre);",
    "spread=mix(spread,0.22,post);",

    "vec3 col=vec3(1.0);float alp=0.0;",
    "for(int i=0;i<13;i++){float fi=float(i);",
    "float ph=fi*0.72;",

    /* La ondulación se aplana al pasar por el talle. */
    "float amp=(0.070+0.028*sin(fi*1.3))*(0.22+0.78*spread);",

    /* Eje del filamento: lo que se pellizca es la separación entre hebras.
       El centro del abanico está en 4.6 y no en 6.0 para que se abra hacia
       abajo y despeje el titular. */
    "float c=amp*sin(q.x*1.15+uT*0.24+ph)+0.046*spread*sin(q.x*0.52-uT*0.16+ph*1.6)+(fi-4.6)*0.090*spread;",

    /* Hebras finas al entrar, cinta con cuerpo al salir. */
    "float hw=(0.030+0.022*sin(q.x*0.80+uT*0.20+ph*1.4)+0.002*fi)*(0.52+1.25*post);",

    "float d=(q.y-c)/hw;",
    "float m=1.0-clamp(abs(d),0.0,1.0);",
    "float rnd=sqrt(max(m*(2.0-m),0.0));",
    "vec2 n=normalize(vec2(clamp(d,-1.0,1.0),max(rnd,0.05)));",
    "float lam=clamp(dot(n,normalize(vec2(-0.40,0.92))),0.0,1.0);",

    /* Color: la rampa se enciende sólo después del talle. */
    "float ht=0.06+q.x*0.68+fi*0.024+0.05*sin(q.x*0.45+uT*0.11);",
    "vec3 rc=ramp(ht);",
    "float sat=smoothstep(xw-0.40*k,xw+0.18*k,q.x);",
    "float lum=dot(rc,vec3(0.30,0.59,0.11));",
    "vec3 neutro=mix(vec3(lum),vec3(0.42,0.45,0.52),0.55);",
    "rc=mix(neutro,rc,0.06+0.94*sat);",

    "vec3 cc=rc*(0.50+0.64*lam)+vec3(1.0)*pow(lam,26.0)*0.20+vec3(0.121,0.839,0.960)*pow(lam,44.0)*0.22*sat;",
    "float a=smoothstep(0.0,0.55,m)*(0.72+0.20*sin(fi*2.1+uT*0.2));",
    "col=mix(col,cc,a);alp=alp+(1.0-alp)*a;}",

    /* Un respiro de luz en el talle: el punto donde todo se junta. */
    "float kx=(q.x-xw)/(0.26*k),ky=q.y/0.14;",
    "float nudo=exp(-kx*kx-ky*ky);",
    "col=mix(col,vec3(1.0),nudo*0.22);",
    "alp=alp+(1.0-alp)*nudo*0.10;",

    /* Máscara y lavado: idénticos a la hero, el texto sigue sobre papel. */
    "alp*=smoothstep(-1.35,-0.34,p.x*0.90+p.y*0.48);",
    "float wash=smoothstep(-0.66,0.28,p.x+p.y*0.10);",
    "col=mix(vec3(1.0),col,0.30+0.70*wash);",
    "alp*=0.26+0.74*wash;",
    "col=mix(col,vec3(1.0),0.09);",
    "if(alp<0.004)discard;",
    "gl_FragColor=vec4(col,clamp(alp,0.0,1.0));}"
  ].join("\n");

  function mount(cv) {
    if (!cv) return;

    var gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true, preserveDrawingBuffer: true });
    if (!gl) {
      cv.style.background = "linear-gradient(28deg,rgba(255,255,255,0) 38%,#C3C8D1 52%,#5A96FF 68%,#0F68F4 79%,#7C3AED 90%,#F97316 100%)";
      return;
    }

    function mk(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
    var pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FS));
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

  window.SolvedIntegrationsWeave = { mount: mount };
})();
