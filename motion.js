/* The desk's motion: real surfaces, reversible springs, no animation dependency. */
(function(){
'use strict';
const win=document.getElementById('win'),panes=document.getElementById('panes');
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=()=>innerWidth<=900;
const notes=new Map();
let root=null,tab=null,gesture=null,callbacks={},suppressClickUntil=0;
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
const haptic=()=>{if(!reduce.matches&&matchMedia('(pointer: coarse)').matches&&navigator.vibrate)navigator.vibrate(6);};

// Critically damped motion retains position and velocity when redirected.
function spring(state,target,render,done,velocity=state.velocity||0){
 cancelAnimationFrame(state.frame);state.target=target;state.velocity=velocity;state.done=done;
 if(reduce.matches){state.value=target;state.frame=0;state.done=null;render(target);done();return;}
 let last=performance.now(),started=last;
 function tick(now){
  let dt=Math.min((now-last)/1000,.032);last=now;
  while(dt>0){const step=Math.min(dt,.008);state.velocity+=((target-state.value)*900-state.velocity*58)*step;state.value+=state.velocity*step;dt-=step;}
  render(clamp(state.value));
  if((Math.abs(target-state.value)<.002&&Math.abs(state.velocity)<.03)||now-started>420){state.value=target;state.velocity=0;render(target);state.frame=0;state.done=null;done();}
  else state.frame=requestAnimationFrame(tick);
 }
 state.frame=requestAnimationFrame(tick);
}

function noteState(pane){
 let s=notes.get(pane);
 if(!s){s={pane,reader:pane.querySelector('.reader'),list:pane.querySelector('.list'),shade:pane.querySelector('.nav-shade'),value:0,velocity:0,frame:0};notes.set(pane,s);}
 return s;
}
function prepareNote(s){
 s.width=innerWidth;s.pane.classList.add('moving');
 s.reader.style.willChange='transform';s.list.style.willChange='transform';
}
function drawNote(s,value){
 if(reduce.matches)return;
 s.reader.style.transform='translate3d('+(s.width*value)+'px,0,0)';
 s.list.style.transform='translate3d('+(-s.width*.2*(1-value))+'px,0,0)';
 s.shade.style.opacity=.09*(1-value);
}
function cleanNote(s){
 s.pane.classList.remove('moving');s.reader.style.removeProperty('transform');s.reader.style.removeProperty('will-change');
 s.list.style.removeProperty('transform');s.list.style.removeProperty('will-change');s.shade.style.removeProperty('opacity');
}
function settleNote(s,target,done,velocity){
 prepareNote(s);spring(s,target,v=>drawNote(s,v),()=>{done?.();cleanNote(s);},velocity);
}
function noteOpen(pane){
 if(!mobile())return;
 const s=noteState(pane),wasMoving=!!s.frame;
 if(!wasMoving)s.value=1;
 prepareNote(s);drawNote(s,s.value);settleNote(s,0,null);haptic();
}
function noteBack(pane,done){
 const s=noteState(pane);settleNote(s,1,done);haptic();
}

function drawRoot(value){
 if(reduce.matches)return;
 win.style.transform='translate3d('+(root.width*value)+'px,0,0) scale('+(1-Math.min(value*.15,.035))+')';
}
function cleanRoot(){
 win.classList.remove('window-moving');win.style.removeProperty('transform');win.style.removeProperty('transform-origin');win.style.removeProperty('will-change');
}
function prepareRoot(){
 if(!root)root={value:0,velocity:0,frame:0};
 root.width=innerWidth;win.classList.add('window-moving');win.style.willChange='transform';
}
function folderOpen(origin){
 if(!mobile()){
  if(!reduce.matches){win.getAnimations().forEach(a=>a.cancel());win.animate([{opacity:0,scale:'.985'},{opacity:1,scale:'1'}],{duration:180,easing:'cubic-bezier(.16,1,.3,1)'});}
  return;
 }
 prepareRoot();if(!root.frame)root.value=.16;
 win.style.transformOrigin=(origin?origin.left+origin.width/2:innerWidth/2)+'px '+(origin?origin.top+origin.height/2:innerHeight/2)+'px';
 drawRoot(root.value);
 if(!reduce.matches)win.animate([{opacity:.35},{opacity:1}],{duration:140,easing:'ease-out'});
 spring(root,0,drawRoot,cleanRoot);haptic();
}
function folderClose(done){
 if(!mobile()){done();return;}
 prepareRoot();spring(root,1,drawRoot,()=>{done();cleanRoot();});haptic();
}
function tabChange(pane,direction){
 if(!mobile()||reduce.matches)return;
 pane.getAnimations().forEach(a=>a.cancel());
 pane.animate([{transform:'translateX('+(direction*18)+'px)',opacity:.55},{transform:'translateX(0)',opacity:1}],{duration:170,easing:'cubic-bezier(.16,1,.3,1)'});
}
function reset(){
 gesture=null;
 cleanTab();
 notes.forEach(s=>{cancelAnimationFrame(s.frame);s.frame=0;const done=s.done;s.done=null;done?.();cleanNote(s);s.value=s.pane.classList.contains('has-cur')?0:1;});
 if(root){cancelAnimationFrame(root.frame);root.frame=0;const done=root.done;root.done=null;done?.();cleanRoot();root=null;}
}

// Adjacent folders are real panes: reveal the next list under the finger.
function prepareTab(pane,next,direction){
 cleanTab();
 tab={pane,next,direction,width:innerWidth,value:0,velocity:0,frame:0};
 next.classList.add('tab-preview');next.setAttribute('aria-hidden','true');
 pane.style.willChange='transform';next.style.willChange='transform';
 drawTab(0);return tab;
}
function drawTab(value){
 if(!tab||reduce.matches)return;
 tab.pane.style.transform='translate3d('+(-tab.direction*tab.width*value)+'px,0,0)';
 tab.next.style.transform='translate3d('+(tab.direction*tab.width*(1-value))+'px,0,0)';
}
function cleanTab(){
 if(!tab)return;cancelAnimationFrame(tab.frame);
 for(const p of [tab.pane,tab.next]){p.style.removeProperty('transform');p.style.removeProperty('will-change');}
 tab.next.classList.remove('tab-preview');tab.next.removeAttribute('aria-hidden');tab=null;
}

// Horizontal intent is established before preventing native vertical scrolling.
panes.addEventListener('touchstart',e=>{
 if(!mobile()||e.touches.length!==1||!document.getElementById('palette').hidden)return;
 const t=e.touches[0];
 // Reserve the browser edge and the native video's bottom control strip.
 // Capture-phase listeners let the picture itself participate in swipe-back.
 const video=e.target.closest('video'),controls=video&&t.clientY>video.getBoundingClientRect().bottom-48;
 if(t.clientX<18||t.clientX>innerWidth-18||controls||e.target.closest('.row,iframe,input,textarea')||!getSelection().isCollapsed)return;
 if(tab?.frame)return;
 const pane=e.target.closest('.pane.on');if(!pane)return;
 const note=pane.classList.contains('has-cur'),state=note?noteState(pane):root;
 gesture={pane,note,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastTime:performance.now(),velocity:0,base:state?.value||0,locked:false};
},{passive:true,capture:true});
panes.addEventListener('touchmove',e=>{
 if(!gesture)return;
 if(e.touches.length!==1){cancelGesture();return;}
 const g=gesture,t=e.touches[0],dx=t.clientX-g.startX,dy=t.clientY-g.startY;
 if(!g.locked){
  if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)){gesture=null;return;}
  if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.25)return;
  const direction=dx<0?1:-1,next=(direction===1||!g.note)?callbacks.neighbor?.(direction):null;
  if(direction===1&&!next){gesture=null;return;}
  g.locked=true;
  if(next){g.tab=true;g.direction=direction;g.state=prepareTab(g.pane,next,direction);}
  else if(g.note){g.state=noteState(g.pane);prepareNote(g.state);}else{prepareRoot();g.state=root;}
  cancelAnimationFrame(g.state.frame);g.state.frame=0;g.state.done=null;g.base=g.state.value;
 }
 if(e.cancelable)e.preventDefault();
 const now=performance.now(),dt=Math.max(1,now-g.lastTime);
 const sign=g.tab?-g.direction:1;
 g.velocity=sign*(t.clientX-g.lastX)/dt;g.lastX=t.clientX;g.lastTime=now;
 g.state.value=clamp(g.base+sign*dx/g.state.width);g.state.velocity=0;
 cancelAnimationFrame(g.paint);
 g.paint=requestAnimationFrame(()=>{if(g.tab)drawTab(g.state.value);else if(g.note)drawNote(g.state,g.state.value);else drawRoot(g.state.value);});
},{passive:false,capture:true});
function finishGesture(cancelled=false){
 const g=gesture;gesture=null;if(!g?.locked)return;
 cancelAnimationFrame(g.paint);suppressClickUntil=performance.now()+350;
 const speed=performance.now()-g.lastTime<100?g.velocity:0;
 const commit=!cancelled&&(g.state.value>.32||(speed>.45&&g.state.value>.07))&&speed>-.25;
 const velocity=speed*1000/g.state.width;
 if(g.tab)spring(g.state,commit?1:0,drawTab,()=>{const next=g.state.next;cleanTab();if(commit)callbacks.tab(next);},velocity);
 else if(g.note)settleNote(g.state,commit?1:0,commit?()=>callbacks.back(g.pane):null,velocity);
 else spring(g.state,commit?1:0,drawRoot,()=>{if(commit)callbacks.close();cleanRoot();},velocity);
 if(commit)haptic();
}
function cancelGesture(){finishGesture(true);}
panes.addEventListener('touchend',()=>finishGesture(),{passive:true,capture:true});
panes.addEventListener('touchcancel',cancelGesture,{passive:true,capture:true});
panes.addEventListener('pointerdown',()=>{suppressClickUntil=0;},{passive:true});
panes.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
let width=innerWidth;
addEventListener('resize',()=>{if(width!==innerWidth){reset();width=innerWidth;}});
reduce.addEventListener('change',reset);
document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});

window.DeskMotion={connect:handlers=>{callbacks=handlers;},noteOpen,noteBack,folderOpen,folderClose,tabChange,reset,haptic};
})();
