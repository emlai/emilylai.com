import * as THREE from './vendor/three.module.js';

// A real mesh, lit with a generated studio environment. No remote assets.
let audio;
export const SOUND_PROFILES = {
  weighted: { duration:.075, body:550, decay:90, weight:.12, snap:.62, rebound:.012 },
  crisp: { duration:.065, body:650, decay:100, weight:.08, snap:.62, rebound:.007 },
  heavy: { duration:.13, body:185, decay:42, weight:.34, snap:.52, rebound:.014 },
  damped: { duration:.085, body:135, decay:68, weight:.26, snap:.25, rebound:.009 },
  chunky: { duration:.16, body:110, decay:34, weight:.43, snap:.43, rebound:.021 },
  metallic: { duration:.19, body:920, decay:30, weight:.20, snap:.56, rebound:.011 },
  relay: { duration:.09, body:390, decay:76, weight:.18, snap:.7, rebound:.025 },
  latch: { duration:.14, body:235, decay:48, weight:.32, snap:.4, rebound:.032 }
};
export async function playToggleSound(profile='weighted', dark=false) {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audio ||= new Audio();
    if (audio.state === 'suspended') await audio.resume();
    const p=SOUND_PROFILES[profile] || SOUND_PROFILES.weighted;
    const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*p.duration),audio.sampleRate);
    const data=buffer.getChannelData(0),pitch=dark?.96:1.04;
    let seed=1947;const noise=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2147483648-1;};
    for(let i=0;i<data.length;i++){
      const t=i/audio.sampleRate,n=noise();
      const transient=p.snap*n*Math.exp(-t*510);
      const rebound=t<p.rebound?0:n*.24*Math.exp(-(t-p.rebound)*330);
      const body=p.weight*Math.exp(-t*p.decay)*(Math.sin(2*Math.PI*p.body*pitch*t)*.62+Math.sin(2*Math.PI*p.body*2.73*t)*.24+Math.sin(2*Math.PI*p.body*6.31*t)*.14);
      const mechanism=n*.1*Math.exp(-t*95);
      data[i]=Math.tanh((transient+rebound+body+mechanism)*1.3)*.65*Math.min(t/.0004,1)*Math.min((p.duration-t)/.005,1);
    }
    const source=audio.createBufferSource();source.buffer=buffer;source.connect(audio.destination);source.start();source.onended=()=>source.disconnect();
  } catch { /* Audio must never block a theme change. */ }
}
function noiseTexture() {
  const size=1024,c=document.createElement('canvas');c.width=size;c.height=size;
  const ctx=c.getContext('2d'),img=ctx.createImageData(size,size);
  let seed=8921;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const columns=Array.from({length:size},()=>random());
  const streaks=Array.from({length:size},()=>random());
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    if(random()<.025)streaks[x]=random();
    const u=x/size;
    const illumination=166+25*Math.exp(-Math.pow((u-.23)/.31,2))-13*Math.exp(-Math.pow((u-.74)/.18,2));
    const v=illumination+(columns[x]-.5)*14+(streaks[x]-.5)*13+(random()-.5)*7;
    const i=(y*size+x)*4;img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=255;
  }
  ctx.putImageData(img,0,0);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function roundedPlate(w,h,r,depth){
  const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  return new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:16});
}
function studio(renderer){
  // Broad photography softboxes, with dark flags for a steel reflection.
  const room=new THREE.Scene();room.background=new THREE.Color(.085,.088,.095);
  const panel=(w,h,x,y,z,power)=>{
    const material=new THREE.MeshBasicMaterial({color:new THREE.Color(power,power,power),side:THREE.DoubleSide});
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);m.position.set(x,y,z);m.lookAt(0,0,0);room.add(m);
  };
  panel(8,4,-3,4,5,2.4);
  panel(2,8,5,.5,2,2.8);
  panel(6,4,-1,-5,3,.6);
  panel(5,7,-5,0,-3,1.4);
  panel(3.5,5,.3,.5,6,.7);
  const pmrem=new THREE.PMREMGenerator(renderer),rt=pmrem.fromScene(room,.035,.1,30);
  room.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});pmrem.dispose();return rt;
}

function machiningTexture(){
  // Lathe-cut end grain: fine concentric marks and its characteristic radial sheen.
  const size=1024,data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const dx=x-size/2,dy=y-size/2,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
    const sheen=.58+.22*Math.cos(2*a-.85)+.065*Math.cos(4*a+.4);
    const v=255*sheen+Math.sin(r*2.1)*3.5;
    const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;
  }
  const t=new THREE.DataTexture(data,size,size);t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;return t;
}

export class SilverToggle extends HTMLElement {
  connectedCallback(){
    (this.shadowRoot || this.attachShadow({mode:'open'})).innerHTML=`<style>
    :host{display:inline-block;width:84px;height:44px;flex:none;vertical-align:middle;--focus:#777}
    button{appearance:none;display:block;width:100%;height:100%;border:0;background:transparent;padding:0;cursor:pointer;position:relative;border-radius:5px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    button:focus-visible{outline:2px solid var(--focus);outline-offset:3px}
    canvas{visibility:hidden;display:block;width:100%;height:100%;pointer-events:none}
    .fallback[hidden]{display:none!important}
    .fallback{position:absolute;inset:0;background:var(--steel-toggle-light,url("${new URL('./toggle-light.png',import.meta.url).href}")) center/100% 100% no-repeat}
    button[aria-checked=true] .fallback{background-image:var(--steel-toggle-dark,url("${new URL('./toggle-dark.png',import.meta.url).href}"))}
    </style><button type="button" role="switch" aria-label="Dark mode" aria-checked="false" title="Switch to dark mode"><span class="fallback" aria-hidden="true"></span></button>`;
    this.button=this.shadowRoot.querySelector('button');
    this.dark=document.documentElement.dataset.theme==='dark';
    this.angle=this.dark?.65:-.65;
    this.button.addEventListener('click',()=>this.toggle());
    this.button.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const dark=e.key==='ArrowRight';if(dark!==this.dark)this.toggle();}
    });
    this.observer=new MutationObserver(()=>this.sync());this.observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    try{this.build();}catch(error){this.dataset.renderer='fallback';this.renderer?.domElement.remove();this.renderer?.dispose();this.renderer=null;this.shadowRoot.querySelector('.fallback').hidden=false;}
    this.sync();
  }
  build(){
    const renderer=this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio,2),3));renderer.setClearColor(0,0);
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.button.append(renderer.domElement);
    const scene=this.scene=new THREE.Scene();this.env=studio(renderer);scene.environment=this.env.texture;
    const camera=this.camera=new THREE.OrthographicCamera(-2.8,2.8,1.5,-1.5,.1,30);camera.position.set(0,1.1,12);camera.lookAt(0,0,0);
    const brush=this.brush=noiseTexture();brush.repeat.set(1,1);const machining=this.machining=machiningTexture();
    const steel=new THREE.MeshStandardMaterial({color:0xe7e7e7,metalness:.82,roughness:.34,map:brush,bumpMap:brush,bumpScale:.0045,envMapIntensity:.95});
    const polished=new THREE.MeshStandardMaterial({color:0xc9cbd0,metalness:1,roughness:.22,envMapIntensity:1.2});
    const gripSteel=new THREE.MeshStandardMaterial({color:0xcfd0d2,metalness:.85,roughness:.29,envMapIntensity:1.2});
    const turned=new THREE.MeshStandardMaterial({color:0xffffff,metalness:.7,roughness:.3,map:machining,envMapIntensity:.8});
    const black=new THREE.MeshStandardMaterial({color:0x141416,metalness:.5,roughness:.36});
    const plateGeometry=roundedPlate(4.45,1.62,.13,.085);
    const position=plateGeometry.attributes.position,uv=plateGeometry.attributes.uv;
    for(let i=0;i<uv.count;i++)uv.setXY(i,(position.getX(i)+2.25)/4.5,(position.getY(i)+.84)/1.68);
    const plate=new THREE.Mesh(plateGeometry,[steel,polished]);scene.add(plate);plate.receiveShadow=true;plate.castShadow=true;
    const back=new THREE.Mesh(roundedPlate(4.47,1.63,.13,.055),black);back.position.z=-.065;scene.add(back);
    const mesh=(geo,mat,x=0,y=0,z=0,parent=scene)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
    const cylinder=(r1,r2,h,mat,x,y,z,parent=scene)=>{const m=mesh(new THREE.CylinderGeometry(r1,r2,h,96),[mat,turned,turned],x,y,z,parent);m.rotation.x=Math.PI/2;return m;};
    for(const x of [-1.78,1.78]){
      cylinder(.185,.185,.04,black,x,0,.13);
      cylinder(.165,.175,.065,turned,x,0,.17);
      const slot=mesh(new THREE.BoxGeometry(.24,.028,.006),black,x,0,.207);slot.rotation.z=0;
    }
    const profile=[[.46,.115],[.445,.13],[.42,.175],[.38,.235],[.33,.285],[.29,.30],[.26,.285],[.225,.24],[.207,.17],[.205,.12]];
    const collarProfile=new THREE.SplineCurve(profile.map(([r,z])=>new THREE.Vector2(r,z))).getPoints(80);
    const collarSteel=new THREE.MeshStandardMaterial({color:0xc9cbd0,metalness:1,roughness:.28,bumpMap:brush,bumpScale:.0015,envMapIntensity:1.2});
    const socket=mesh(new THREE.LatheGeometry(collarProfile,128),collarSteel);
    // +Y becomes +Z, exposing the rolled collar and its recessed inner bore.
    socket.rotation.x=Math.PI/2;
    const bore=mesh(new THREE.CircleGeometry(.207,96),black,0,0,.125);
    mesh(new THREE.SphereGeometry(.155,48,32),black,0,0,.155);
    const lever=this.lever=new THREE.Group();lever.position.z=.17;scene.add(lever);
    cylinder(.092,.092,.31,polished,0,0,.19,lever);
    cylinder(.138,.138,.70,gripSteel,0,0,.66,lever);
    const facets=[];
    const point=(a,z,r)=>[Math.cos(a)*r,Math.sin(a)*r,z];
    for(let row=0;row<12;row++)for(let col=0;col<36;col++){
      const a=col/36*Math.PI*2,b=(col+1)/36*Math.PI*2,z=.37+row*.05;
      const corners=[point(a,z,.139),point(b,z,.139),point(b,z+.05,.139),point(a,z+.05,.139)];
      const peak=point((a+b)/2,z+.025,.152);
      for(let k=0;k<4;k++)facets.push(...corners[k],...corners[(k+1)%4],...peak);
    }
    const gripGeometry=new THREE.BufferGeometry();gripGeometry.setAttribute('position',new THREE.Float32BufferAttribute(facets,3));gripGeometry.computeVertexNormals();
    mesh(gripGeometry,gripSteel,0,0,0,lever);
    for(const z of [.32,.35,.98,1.02])cylinder(.148,.148,.028,polished,0,0,z,lever);
    cylinder(.143,.14,.033,turned,0,0,1.043,lever);
    const shadow=new THREE.Mesh(new THREE.PlaneGeometry(18,10),new THREE.ShadowMaterial({opacity:.16}));shadow.position.z=-.12;shadow.receiveShadow=true;scene.add(shadow);
    const key=new THREE.DirectionalLight(0xffffff,3.5);key.position.set(-3,5,7);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=2;key.shadow.camera.bottom=-2;key.shadow.normalBias=.015;key.shadow.bias=-.0002;key.shadow.radius=4;scene.add(key);
    scene.add(new THREE.HemisphereLight(0xffffff,0x73757b,.65));
    this.resize=new ResizeObserver(()=>{const w=this.clientWidth,h=this.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.left=-2.65;camera.right=2.65;camera.top=2.65*h/w;camera.bottom=-camera.top;camera.updateProjectionMatrix();this.draw();});this.resize.observe(this);
    this.dataset.renderer='webgl';
  }
  draw(){if(this.renderer&&this.lever){this.lever.rotation.y=this.angle;this.renderer.render(this.scene,this.camera);this.renderer.domElement.style.visibility='visible';this.shadowRoot.querySelector('.fallback').hidden=true;}}
  sync(){
    this.dark=document.documentElement.dataset.theme==='dark';
    this.button.setAttribute('aria-checked',String(this.dark));this.button.title=`Switch to ${this.dark?'light':'dark'} mode`;
    const target=this.dark?.65:-.65;
    cancelAnimationFrame(this.frame);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.angle=target;this.draw();return;}
    if(Math.abs(this.angle-target)<.0001){this.draw();return;}
    const from=this.angle,start=performance.now();
    const animate=now=>{const t=Math.min((now-start)/230,1);const ease=1-Math.pow(1-t,3)*Math.cos(t*Math.PI*2);this.angle=from+(target-from)*ease;this.draw();if(t<1)this.frame=requestAnimationFrame(animate);};this.frame=requestAnimationFrame(animate);
  }
  toggle(){
    const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';
    try{localStorage.setItem('theme',dark?'dark':'light');}catch{}
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#171717':'#FFFFFF';
    if(!this.hasAttribute('muted')){
      const src=this.getAttribute('sound-src');
      if(src){
        if(!this.sample || this.samplePath!==src){this.sample?.pause();this.sample=new Audio(src);this.samplePath=src;this.sample.volume=.65;}
        this.sample.currentTime=0;this.sample.play().catch(()=>playToggleSound(this.getAttribute('sound')||'weighted',dark));
      }else void playToggleSound(this.getAttribute('sound')||'weighted',dark);
    }
    this.dispatchEvent(new CustomEvent('themechange',{bubbles:true,detail:{theme:dark?'dark':'light'}}));
  }
  disconnectedCallback(){this.sample?.pause();cancelAnimationFrame(this.frame);this.resize?.disconnect();this.observer?.disconnect();this.scene?.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});this.brush?.dispose();this.machining?.dispose();this.env?.dispose();this.renderer?.dispose();}
}
if(!customElements.get('silver-toggle'))customElements.define('silver-toggle',SilverToggle);
export function replaceThemeControl(selector='.mode'){
  const old=document.querySelector(selector);if(!old)return null;const toggle=document.createElement('silver-toggle');old.replaceWith(toggle);return toggle;
}
