/* Solved — motor de la seda trenzada.
   Importado sin cambios del design system "Gradient Design System" (Claude Design),
   componente components/brand/weave.js.

   No es una banda con degradado dentro: son filamentos superpuestos, cada uno con su
   onda, fase, grosor y velocidad.

   CLAVE CROMÁTICA: la rampa va A TRAVÉS del haz, no a lo largo. Cada filamento toma su
   color de su posición en la banda — azul profundo en las hebras de abajo, morado y rosa
   en el centro, naranja en las de arriba. A lo largo de cada hebra sólo varía la alfa:
   entra transparente y gana densidad hacia la salida, que es lo que deja el papel blanco
   donde vive el texto.

   El 3D es de sección, no de geometría: cada hebra se ilumina por su corte transversal
   con luz fija arriba a la izquierda — pasadas cada vez más estrechas y desplazadas hacia
   la luz, más un especular de cian en el lomo.
   Sin parallax. Sin reacción al ratón.
   Registra window.SolvedWeave. */
(function () {
  "use strict";

  /* El rosa #D34F9D es color de TRÁNSITO del material: sin él, morado→naranja pasa por
     un marrón sucio justo en el tramo más visible. No existe como color de interfaz. */
  var RAMPS = {
    light: [[0, "#0B54C8"], [0.20, "#0F68F4"], [0.38, "#5A96FF"], [0.60, "#7C3AED"], [0.80, "#D34F9D"], [1, "#F97316"]],
    /* Misma geometría, distinta jerarquía: manda el violeta de IA, el azul acompaña.
       El naranja desaparece y el rosa de tránsito tampoco entra. */
    ai: [[0, "#2E5FF0"], [0.30, "#5A96FF"], [0.58, "#A855F7"], [0.82, "#8B3BE8"], [1, "#6D28D9"]],
  };

  var SPECULAR = [31, 214, 245];
  var LIGHT = { x: -0.62, y: -0.78 };
  var COUNT = 13;

  function lcg(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  function hex(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

  function sample(stops, t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    for (var i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        var a = stops[i - 1], b = stops[i];
        var k = (t - a[0]) / (b[0] - a[0] || 1);
        var ca = hex(a[1]), cb = hex(b[1]);
        return [Math.round(ca[0] + (cb[0] - ca[0]) * k), Math.round(ca[1] + (cb[1] - ca[1]) * k), Math.round(ca[2] + (cb[2] - ca[2]) * k)];
      }
    }
    return hex(stops[stops.length - 1][1]);
  }

  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  function filaments(variant, h) {
    var rnd = lcg(variant === "ai" ? 20260813 : 19770418);
    /* La variante de IA ocupa un tercio menos de superficie: sobre negro el mismo área pesa mucho más. */
    var k = variant === "ai" ? 0.67 : 1;
    var stops = RAMPS[variant] || RAMPS.light;
    var spread = h * 0.80 * k;
    var out = [];
    for (var i = 0; i < COUNT; i++) {
      var u = COUNT === 1 ? 0.5 : i / (COUNT - 1);
      out.push({
        band: u,                                  /* posición en el haz = color */
        color: sample(stops, u),
        offset: (u - 0.5) * spread + (rnd() - 0.5) * h * 0.03,
        /* Estelas rectas y finas, con hueco de papel entre ellas. */
        amp: h * (0.006 + rnd() * 0.020) * k,
        amp2: h * (0.003 + rnd() * 0.007) * k,
        freq: 0.18 + rnd() * 0.30,
        freq2: 0.5 + rnd() * 0.6,
        phase: rnd() * Math.PI * 2,
        phase2: rnd() * Math.PI * 2,
        speed: 0.014 + rnd() * 0.046,             /* velocidades distintas: sin fotograma repetido */
        speed2: 0.008 + rnd() * 0.028,
        thick: h * (0.010 + rnd() * 0.026) * k,
        entry: 0.40 + rnd() * 0.22,               /* dónde empieza a coger densidad */
      });
    }
    return out;
  }

  function lengthGradient(ctx, x0, x1, color, peak, entry) {
    var g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, rgba(color, 0));
    g.addColorStop(entry, rgba(color, peak * 0.10));
    g.addColorStop(Math.min(0.96, entry + 0.22), rgba(color, peak * 0.66));
    g.addColorStop(1, rgba(color, peak));
    return g;
  }

  function grainPattern(ctx) {
    var n = document.createElement("canvas");
    n.width = n.height = 96;
    var nc = n.getContext("2d");
    var img = nc.createImageData(96, 96);
    var rnd = lcg(4242);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = 128 + (rnd() - 0.5) * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    nc.putImageData(img, 0, 0);
    return ctx.createPattern(n, "repeat");
  }

  function stroke(ctx, pts, width, style, alpha, comp, dx, dy) {
    ctx.save();
    ctx.globalCompositeOperation = comp;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = style;
    ctx.lineWidth = Math.max(0.6, width);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (var i = 0; i < pts.length; i += 2) {
      var x = pts[i] + dx, y = pts[i + 1] + dy;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw(ctx, opts) {
    var w = opts.width, h = opts.height, t = opts.time, variant = opts.variant || "light";
    var fils = opts.filaments;
    var angle = (opts.angle == null ? -29 : opts.angle) * Math.PI / 180;
    var diag = Math.sqrt(w * w + h * h) * 1.2;
    var step = Math.max(8, diag / 110);
    var x0 = -diag / 2, x1 = diag / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(angle);

    /* Glow violeta por fuera del núcleo: es lo que hace que se lea emitido, no pintado. */
    if (variant === "ai") {
      var gl = ctx.createRadialGradient(0, 0, 0, 0, 0, diag * 0.32);
      gl.addColorStop(0, "rgba(168,85,247,0.30)");
      gl.addColorStop(1, "rgba(168,85,247,0)");
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gl;
      ctx.fillRect(x0, -h, diag, h * 2);
      ctx.restore();
    }

    for (var f = 0; f < fils.length; f++) {
      var fl = fils[f], pts = [];
      for (var x = x0; x <= x1; x += step) {
        var u = (x - x0) / diag;
        var y = fl.offset
          + Math.sin(u * Math.PI * 2 * fl.freq + fl.phase + t * fl.speed) * fl.amp
          + Math.sin(u * Math.PI * 2 * fl.freq2 + fl.phase2 + t * fl.speed2) * fl.amp2;
        pts.push(x, y);
      }
      var T = fl.thick;
      /* Halo ancho muy tenue + núcleo nítido: estela, no mancha. Sin canto oscuro. */
      stroke(ctx, pts, T * 3.0, fl.gHalo, 0.55, "source-over", 0, 0);
      stroke(ctx, pts, T * 1.6, fl.gHalo, 1, "source-over", 0, 0);
      stroke(ctx, pts, T, fl.gCore, 1, "source-over", 0, 0);
      /* Lomo: pasada estrecha desplazada hacia la luz. */
      stroke(ctx, pts, T * 0.34, fl.gRidge, 1, "source-over", LIGHT.x * T * 0.24, LIGHT.y * T * 0.24);
      /* Especular: sólo donde el lomo coge la luz. El cian vive aquí y en ningún otro
         sitio; sigue significando movimiento, ya no tiñe. */
      stroke(ctx, pts, T * 0.14, fl.gSpec, 1, "lighter", LIGHT.x * T * 0.34, LIGHT.y * T * 0.34);
    }
    ctx.restore();

    /* Capa estática ya cocida: lavado + levantado + grano en un solo blit. */
    if (opts.overlay) ctx.drawImage(opts.overlay, 0, 0, w, h);
  }

  /* Cuece la capa estática. El lavado va en blanco sobre blanco: el texto NO cambia de
     tinta, es el material el que se aparta. */
  function bakeOverlay(w, h, dpr, opts) {
    var c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w * dpr));
    c.height = Math.max(1, Math.round(h * dpr));
    var x = c.getContext("2d");
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var wash = opts.wash;
    if (wash && wash.side !== "none") {
      var amt = wash.amount == null ? 0.94 : wash.amount;
      var end = (wash.end == null ? 0.98 : wash.end) * w;
      var wg = wash.side === "right" ? x.createLinearGradient(w, 0, w - end, 0) : x.createLinearGradient(0, 0, end, 0);
      wg.addColorStop(0, "rgba(255,255,255," + amt + ")");
      wg.addColorStop(0.58, "rgba(255,255,255," + amt + ")");
      wg.addColorStop(0.82, "rgba(255,255,255," + amt * 0.40 + ")");
      wg.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = wg;
      x.fillRect(0, 0, w, h);
    }
    if (opts.lift) { x.fillStyle = "rgba(255,255,255," + opts.lift + ")"; x.fillRect(0, 0, w, h); }
    var g = grainPattern(x);
    if (g) { x.globalAlpha = opts.grainAmount == null ? 0.055 : opts.grainAmount; x.fillStyle = g; x.fillRect(0, 0, w, h); }
    return c;
  }

  function mount(canvas, options) {
    var o = options || {};
    var variant = o.variant || "light";
    var animate = o.animate !== false;
    var ctx = canvas.getContext("2d");
    if (!ctx) return { destroy: function () {} };

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var fils = null, overlay = null, w = 0, h = 0, raf = 0, visible = true, t0 = 0, tNow = 0;

    function paint() {
      draw(ctx, { width: w, height: h, time: tNow, variant: variant, filaments: fils, angle: o.angle, overlay: overlay });
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      /* Renderizar a 1,75× como máximo, no al DPR nativo. */
      var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlay = bakeOverlay(w, h, dpr, { wash: o.wash, lift: o.lift == null ? 0.06 : o.lift, grainAmount: o.grainAmount });

      fils = filaments(variant, h);
      var dg = Math.sqrt(w * w + h * h) * 1.2, gx0 = -dg / 2, gx1 = dg / 2;
      for (var i = 0; i < fils.length; i++) {
        var fl = fils[i];
        fl.gHalo = lengthGradient(ctx, gx0, gx1, fl.color, 0.20, fl.entry);
        fl.gCore = lengthGradient(ctx, gx0, gx1, fl.color, 0.92, fl.entry);
        fl.gRidge = lengthGradient(ctx, gx0, gx1, [255, 255, 255], 0.50, fl.entry);
        fl.gSpec = lengthGradient(ctx, gx0, gx1, SPECULAR, 0.40, fl.entry);
      }
      paint();
    }

    var interval = 1000 / (o.fps || 24), last = 0;
    function frame(ts) {
      if (!t0) t0 = ts;
      if (ts - last >= interval) { last = ts; tNow = (ts - t0) / 1000; paint(); }
      raf = visible ? requestAnimationFrame(frame) : 0;
    }

    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas); else window.addEventListener("resize", resize);
    resize();

    /* prefers-reduced-motion congela la onda en un fotograma estático. */
    if (animate && !reduce) {
      var io = window.IntersectionObserver ? new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
        else if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
      }, { rootMargin: "80px" }) : null;
      if (io) io.observe(canvas);
      raf = requestAnimationFrame(frame);
      return { destroy: function () { if (raf) cancelAnimationFrame(raf); if (io) io.disconnect(); if (ro) ro.disconnect(); } };
    }
    return { destroy: function () { if (ro) ro.disconnect(); } };
  }

  window.SolvedWeave = { mount: mount, draw: draw, bakeOverlay: bakeOverlay, RAMPS: RAMPS, filaments: filaments, grainPattern: grainPattern, sample: sample };
})();
