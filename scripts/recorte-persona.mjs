import sharp from '/home/javi/web solved 3.0/node_modules/sharp/lib/index.js';
const SRC='/home/javi/web solved 3.0/assets/tecnico-escanea-maquina.webp';
const XMIN=0.44, DEBUG=process.argv.includes('--debug');

const img=sharp(SRC); const {width:W,height:H}=await img.metadata();
const buf=await img.raw().toBuffer(); const N=W*H;

// 1 · Sólo dos señales inequívocas: la manga de alta visibilidad y lo oscuro
//     (tablet y guantes en sombra). El hormigón y las paredes quedan fuera.
const m=new Uint8Array(N); const x0=Math.floor(W*XMIN);
for(let y=0;y<H;y++) for(let x=x0;x<W;x++){
  const i=y*W+x, r=buf[i*3], g=buf[i*3+1], b=buf[i*3+2];
  const lum=0.299*r+0.587*g+0.114*b;
  const hiviz = g>135 && (g-b)>50 && b<160;
  const oscuro = lum<108;
  if (hiviz||oscuro) m[i]=255;
}
const dbg=async(a,f)=>{ if(!DEBUG) return; await sharp(Buffer.from(a),{raw:{width:W,height:H,channels:1}}).resize(760).png().toFile(f); };
await dbg(m,'m1-base.png');

// 2 · Cierre grande: une tablet, guantes y manga en una sola silueta.
const morf=(src,rad,modo)=>{const t=new Uint8Array(N),o=new Uint8Array(N);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let v=modo==='max'?0:255;
    for(let k=-rad;k<=rad;k++){const xx=x+k<0?0:x+k>W-1?W-1:x+k;const s=src[y*W+xx];v=modo==='max'?(s>v?s:v):(s<v?s:v);} t[y*W+x]=v;}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let v=modo==='max'?0:255;
    for(let k=-rad;k<=rad;k++){const yy=y+k<0?0:y+k>H-1?H-1:y+k;const s=t[yy*W+x];v=modo==='max'?(s>v?s:v):(s<v?s:v);} o[y*W+x]=v;}
  return o;};
let mask=morf(morf(m,22,'max'),22,'min');
// Apertura después del cierre: corta los puentes finos con los que trozos
// oscuros del fondo —una cinta, un bastidor— se colaban pegados a la silueta.
// Sin esto quedan motas grises flotando sobre el panel, que parecen suciedad.
mask=morf(morf(mask,8,'min'),8,'max');
await dbg(mask,'m2-cierre.png');

// 3 · El trozo grande, que ahora sí es la persona.
const visto=new Uint8Array(N); let mejor=null,mejorN=0;
for(let s=0;s<N;s++){ if(!mask[s]||visto[s])continue;
  const pila=[s],comp=[]; visto[s]=1;
  while(pila.length){const i=pila.pop();comp.push(i);const x=i%W,y=(i/W)|0;
    if(x>0&&mask[i-1]&&!visto[i-1]){visto[i-1]=1;pila.push(i-1);}
    if(x<W-1&&mask[i+1]&&!visto[i+1]){visto[i+1]=1;pila.push(i+1);}
    if(y>0&&mask[i-W]&&!visto[i-W]){visto[i-W]=1;pila.push(i-W);}
    if(y<H-1&&mask[i+W]&&!visto[i+W]){visto[i+W]=1;pila.push(i+W);}}
  if(comp.length>mejorN){mejorN=comp.length;mejor=comp;} }
const solo=new Uint8Array(N); for(const i of mejor) solo[i]=255;

// 4 · Rellenar huecos interiores (la pantalla clara de la tablet).
const fuera=new Uint8Array(N); const cola=[];
for(let x=0;x<W;x++){cola.push(x);cola.push((H-1)*W+x);} for(let y=0;y<H;y++){cola.push(y*W);cola.push(y*W+W-1);}
while(cola.length){const i=cola.pop(); if(fuera[i]||solo[i])continue; fuera[i]=1;
  const x=i%W,y=(i/W)|0;
  if(x>0)cola.push(i-1); if(x<W-1)cola.push(i+1); if(y>0)cola.push(i-W); if(y<H-1)cola.push(i+W);}
for(let i=0;i<N;i++) if(!solo[i]&&!fuera[i]) solo[i]=255;
await dbg(solo,'m3-final.png');

// 5 · Alfa suave y composición
// OJO: sharp promociona un raw de 1 canal a sRGB al desenfocar, así que
// `blur()` devuelve 3 canales. Hay que leer con paso, no de uno en uno: es lo
// que hacía que el alfa saliera desalineado y el recorte, invertido.
const bl=await sharp(Buffer.from(solo),{raw:{width:W,height:H,channels:1}}).blur(1.5).raw().toBuffer({resolveWithObject:true});
const paso=bl.info.channels;
const rgba=Buffer.alloc(N*4);
for(let i=0;i<N;i++){rgba[i*4]=buf[i*3];rgba[i*4+1]=buf[i*3+1];rgba[i*4+2]=buf[i*3+2];rgba[i*4+3]=bl.data[i*paso];}
await sharp(rgba,{raw:{width:W,height:H,channels:4}}).png().toFile('recorte.png');
await sharp('recorte.png').flatten({background:{r:255,g:0,b:170}}).resize(900).jpeg({quality:82}).toFile('revision.jpg');
console.log('persona:',(100*mejorN/N).toFixed(1)+'% del plano');
