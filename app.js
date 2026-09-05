/* emilylai.com: the desk. Data comes from content.js (BUCKETS) and previews.js (PREVIEWS). */
(function(){
'use strict';
const F=document.getElementById('folders'),T=document.getElementById('tabs'),P=document.getElementById('panes'),WIN=document.getElementById('win');
const isMobile=()=>innerWidth<=900;
const MAXTABS=4;
const ICON='<svg class="i" aria-hidden="true"><use href="assets/icons.svg#folder"/></svg>';
const XICON='<svg class="i" aria-hidden="true"><use href="assets/icons.svg#x"/></svg>';
const CONTACT='<div class="mcontact"><a class="mail" href="#" data-eu="ylime" data-ed="moc.aidemnamuherom">email</a><a href="https://x.com/emilylai" target="_blank" rel="me noopener" aria-label="X, @emilylai"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5.4-7-6.2 7H1l8-9.2L.6 2h7.1l4.9 6.4L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z"/></svg></a><a href="https://linkedin.com/in/laiemily" target="_blank" rel="me noopener" aria-label="LinkedIn, laiemily"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zM7.1 20.4H3.6V9h3.5v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.5c0 1 .8 1.8 1.8 1.8h20.4c1 0 1.8-.8 1.8-1.8V1.7C24 .8 23.2 0 22.2 0z"/></svg></a></div>';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const md=s=>esc(s).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
const fmt=d=>{const [y,m,dd]=d.split('-');return (+dd)+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]+' '+y};
const todayLabel=()=>{const d=new Date();return d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})+' at '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})};
const store={get(k,f){try{const v=localStorage.getItem(k);return v==null?f:JSON.parse(v)}catch(e){return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

let seen=new Set(store.get('seen',[]));
const unlocked=()=>BUCKETS.filter(b=>!b.egg).every(b=>seen.has(b.id));
const visible=()=>BUCKETS.filter(b=>!b.egg||unlocked());
let open=[],active=null;

/* client logos: files that exist in media/logos, shown under matching roles */
const LOGOS={'Hype':[['kraken.com','Kraken'],['optimism.io','Optimism'],['sui.io','Sui'],['consensys.io','Consensys'],['bitfinex.com','Bitfinex'],['polygon.technology','Polygon']],'Jump 450':[['fool.com','Motley Fool'],['moneylion.com','MoneyLion'],['jtv.com','Jewelry TV'],['gorjana.com','Gorjana'],['integrativenutrition.com','Institute for Integrative Nutrition'],['talentless.co','Talentless'],['foursigmatic.com','Four Sigmatic']]};
function logosHTML(label){const k=Object.keys(LOGOS).find(k=>label.startsWith(k));if(!k)return '';return '<div class="logos">'+LOGOS[k].map(([d,n])=>'<img src="media/logos/'+d+'.png" alt="'+esc(n)+'" title="'+esc(n)+'" loading="lazy" onerror="this.remove()">').join('')+'</div>';}
/* render */
function renderFolders(){F.innerHTML=visible().map(b=>'<li'+(b.egg?' class="egg"':'')+'><button type="button" aria-expanded="false" aria-controls="p-'+b.id+'" data-w="'+b.id+'">'+ICON+'<span class="lbl">'+esc(b.name)+'</span><span class="n">'+b.items.length+'</span></button></li>').join('');}
function rowHTML(it,i,prev){if(Array.isArray(it)){const py=prev?(Array.isArray(prev)?prev[0]:prev.y):null;const first=py!==it[0];return '<li'+(first?' class="first"':'')+'>'+(first?'<span class="d">'+esc(it[0])+'</span>':'')+'<span>'+(it[2]?'<a href="'+it[2]+'" data-u="'+it[2]+'">'+esc(it[1])+'</a>':esc(it[1]))+'</span></li>';}
 const py=prev?(Array.isArray(prev)?prev[0]:prev.y):null;const first=py!==it.y;return '<li class="role'+(first?' first':'')+'">'+(first?'<span class="d">'+esc(it.y)+'</span>':'')+'<span><a href="#" class="lbl" data-role="'+i+'">'+esc(it.label)+'</a></span></li>';}
function renderPanes(){P.innerHTML=BUCKETS.map(b=>'<div class="pane" id="p-'+b.id+'" role="tabpanel" aria-labelledby="t-'+b.id+'"><div class="list"><h2 id="h-'+b.id+'">'+esc(b.name)+'</h2><p class="meta">'+b.items.length+' entries</p><ul>'+b.items.map((it,i)=>rowHTML(it,i,b.items[i-1])).join('')+'</ul>'+CONTACT+'</div><div class="divider" role="separator" aria-orientation="vertical" aria-label="Resize columns" tabindex="0"></div><aside class="reader" aria-live="polite"><p class="empty">'+todayLabel()+'</p></aside></div>').join('');}
function remember(){store.set('desk',{open,active,transform:WIN.style.transform||'',w:WIN.style.width||'',h:WIN.style.height||''});}
function sync(focusTab){if(isMobile()&&open.length>1)open=[active];remember();
 WIN.classList.toggle('open',open.length>0);document.body.classList.toggle('m-open',open.length>0&&isMobile());
 const tabIds=isMobile()?visible().map(b=>b.id):open;
 T.innerHTML=tabIds.map(id=>{const b=BUCKETS.find(x=>x.id===id);return '<div class="tab" role="tab" id="t-'+id+'" tabindex="'+(id===active?0:-1)+'" aria-selected="'+(id===active)+'" aria-controls="p-'+id+'" data-t="'+id+'"><span class="name">'+esc(b.name)+'</span><button type="button" class="x" aria-label="Close '+esc(b.name)+'" data-x="'+id+'">'+XICON+'</button></div>'}).join('');
 document.querySelectorAll('.pane').forEach(p=>p.classList.toggle('on',p.id==='p-'+active));
 F.querySelectorAll('button').forEach(b=>b.setAttribute('aria-expanded',String(open.includes(b.dataset.w))));
 if(focusTab&&active){const t=T.querySelector('[aria-selected="true"]');if(t)t.focus({preventScroll:true});}}
renderFolders();renderPanes();

/* folders */
F.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.w;const was=unlocked();seen.add(id);store.set('seen',[...seen]);if(!was&&unlocked())renderFolders();
 if(isMobile()){open=[id];active=id;document.querySelectorAll('.pane').forEach(p=>p.classList.remove('has-cur'));sync(false);return;}
 if(open.includes(id)){open=open.filter(o=>o!==id);active=open[open.length-1]||null;sync(false);}else{open.push(id);if(open.length>MAXTABS)open.shift();active=id;sync(true);}});

/* tabs */
T.addEventListener('click',e=>{const x=e.target.closest('.x');const t=e.target.closest('[data-t]');
 if(isMobile()){if(t){const was=unlocked();seen.add(t.dataset.t);store.set('seen',[...seen]);if(!was&&unlocked()){renderFolders();}open=[t.dataset.t];active=t.dataset.t;document.querySelectorAll('.pane').forEach(p=>p.classList.remove('has-cur'));sync(false);const el=T.querySelector('[aria-selected="true"]');if(el)el.scrollIntoView({inline:'center',block:'nearest'});}return;}
 if(x){const id=x.dataset.x;open=open.filter(o=>o!==id);if(active===id)active=open[open.length-1]||null;sync(true);return;}
 if(t){active=t.dataset.t;sync(true);}});
T.addEventListener('keydown',e=>{const i=open.indexOf(active);if(e.key==='ArrowRight'&&i<open.length-1){active=open[i+1];sync(true);}else if(e.key==='ArrowLeft'&&i>0){active=open[i-1];sync(true);}});
WIN.querySelector('.close').addEventListener('click',()=>{open=[];active=null;sync(false);});
addEventListener('keydown',e=>{if(e.key==='Escape'&&open.length&&!document.activeElement.closest('.search')){open=[];active=null;sync(false);}});

/* reader */
function mediaHTML(med,u){if(!med.length)return '';const mh=med.map(x=>x.t==='photo'?'<img src="'+x.src+'" alt="Image from the post" loading="lazy" decoding="async">':(/\.mp4$/.test(x.src)?'<video controls preload="none" playsinline poster="'+(x.poster||'')+'" src="'+x.src+'"></video>':'<a class="vid" href="'+u+'" target="_blank" rel="noopener" title="Play on X (opens in a new tab)"><img src="'+(x.poster||x.src)+'" alt="Video from the post" loading="lazy"></a>')).join('');return '<div class="media'+(med.length>=3?' many':'')+'">'+mh+'</div>';}
function postHTML(u,lab,noMedia,cut){const m=u.match(/status\/(\d+)/);const p=m&&PREVIEWS[m[1]];
 if(!p)return '<div class="post"><p class="who"><span>X · @emilylai</span></p><p class="out"><a href="'+u+'" target="_blank" rel="noopener">Open on X ↗</a></p></div>';
 let body=lab?p.text.split(/\n/)[0]:p.text,cutted=false;if(cut){const i=p.text.toLowerCase().indexOf(cut.toLowerCase());if(i>=0){body=p.text.slice(0,i+cut.length);cutted=true;}}const med=noMedia?[]:(p.media||[]);
 const more=(lab||cutted||!p.thread)?'':p.thread.map(t=>'<div class="cont">'+mediaHTML(t.media||[],u)+'<p class="txt">'+esc(t.text)+'</p></div>').join('');
 return '<div class="post"><p class="who"><span>X · @'+esc(p.author||'emilylai')+'</span><span>'+fmt(p.date)+'</span></p>'+mediaHTML(med,u)+'<p class="txt">'+esc(body)+(lab?' <a href="'+u+'" target="_blank" rel="noopener">The rest is on X ↗</a>':'')+'</p>'+more+(lab?'':'<p class="stats">'+p.likes.toLocaleString()+' likes</p><p class="out"><a href="'+u+'" target="_blank" rel="noopener">'+(cutted?'Read the rest on X ↗':'Open on X ↗')+'</a></p>')+'</div>';}
function cardHTML(s){if(s.kind==='yt')return '<a role="listitem" class="card" href="https://youtu.be/'+s.id+'" data-yt="'+s.id+'"><img src="https://img.youtube.com/vi/'+s.id+'/mqdefault.jpg" alt="" loading="lazy"><span>'+esc(s.title)+'</span></a>';
 const id=(s.url.match(/status\/(\d+)/)||[])[1];const pv=PREVIEWS[id];const th=pv&&pv.media?'<img src="'+pv.media[0].src+'" alt="" loading="lazy">':'<span class="ph">X</span>';return '<a role="listitem" class="card" href="'+s.url+'" data-u="'+s.url+'" data-series="1">'+th+'<span>'+esc(s.title)+'</span></a>';}
function descHTML(d){if(!d||!d.length)return '';let out='',ul=[];const flush=()=>{if(ul.length){out+='<ul class="bul">'+ul.map(x=>'<li>'+md(x)+'</li>').join('')+'</ul>';ul=[];}};
 for(const line of d){if(line.startsWith('## ')){flush();out+='<p class="sub">'+md(line.slice(3))+'</p>';}else if(line.startsWith('> ')){flush();out+='<p class="para">'+md(line.slice(2))+'</p>';}else ul.push(line.replace(/^- /,''));}flush();return out;}
function imagesHTML(it){return (it.images||[]).map(src=>'<div class="media"><img src="'+src+'" alt="" loading="lazy" decoding="async"></div>').join('');}
function embedHTML(e){return '<div class="li"><iframe src="'+e.src+'" height="'+e.h+'" loading="lazy" title="LinkedIn post" allowfullscreen></iframe></div>';}
/* a single video renders large; several render as a row of cards (or stacked for type stack) */
function seriesHTML(it){if(!it.series)return '';if(it.stack||(it.series.length===1&&it.series[0].kind==='yt'))return it.series.map(stackHTML).join('');return '<div class="row" role="list">'+it.series.map(cardHTML).join('')+'</div><div class="stagebox"></div>';}
/* posts and LinkedIn embeds in one stream, newest first. LinkedIn ids carry their timestamp in the top bits. */
function streamHTML(it){const items=[];for(const u of it.posts||[]){const id=(u.match(/status\/(\d+)/)||[])[1];const p=id&&PREVIEWS[id];items.push({d:p?p.date:'0000',html:postHTML(u,!!it.safe,!!it.safe,it.cuts&&it.cuts[id])});}
 for(const e of it.embeds||[]){const m=e.src.match(/:(\d{15,})/);let d='0000';if(m){try{d=new Date(Number(BigInt(m[1])>>22n)).toISOString().slice(0,10)}catch(x){}}items.push({d,html:embedHTML(e)});}
 if(it.posts&&it.posts.length&&!(it.embeds&&it.embeds.length))return items.map(x=>x.html).join('');
 return items.sort((a,b)=>b.d.localeCompare(a.d)).map(x=>x.html).join('');}
function stackHTML(s){if(s.kind==='yt')return '<div class="post"><p class="who"><span>YouTube · @emilylai8</span></p><a class="yt vid" href="https://youtu.be/'+s.id+'" data-yt="'+s.id+'"><img src="https://img.youtube.com/vi/'+s.id+'/hqdefault.jpg" alt="Play: '+esc(s.title)+'"></a><p class="txt">'+esc(s.title)+'</p></div>';return postHTML(s.url,false);}
function select(pane,li){pane.querySelectorAll('li').forEach(l=>l.classList.remove('cur'));li.classList.add('cur');pane.classList.add('has-cur');const rd=pane.querySelector('.reader');rd.scrollTop=0;return rd;}
function mobileBack(pane,rd){if(isMobile())rd.insertAdjacentHTML('afterbegin','<button type="button" class="back">‹ '+esc(pane.querySelector('h2').textContent)+'</button>');}
P.addEventListener('click',e=>{
 const bk=e.target.closest('.back');if(bk){const pane=bk.closest('.pane');pane.classList.remove('has-cur');pane.querySelectorAll('li').forEach(l=>l.classList.remove('cur'));return;}
 const y=e.target.closest('a[data-yt]');if(y){e.preventDefault();const rd=y.closest('.reader'),box=rd.querySelector('.stagebox');const html='<iframe src="https://www.youtube-nocookie.com/embed/'+y.dataset.yt+'?autoplay=1" title="Video" allow="autoplay" allowfullscreen></iframe>';if(box){box.innerHTML=html;rd.querySelectorAll('.card').forEach(k=>k.classList.toggle('on',k===y));}else y.outerHTML=html;return;}
 const sp=e.target.closest('a[data-series]');if(sp){e.preventDefault();const rd=sp.closest('.reader'),box=rd.querySelector('.stagebox');const b=BUCKETS.find(x=>'p-'+x.id===sp.closest('.pane').id),cur=sp.closest('.pane').querySelector('li.cur a[data-role]'),it=cur&&b.items[+cur.dataset.role],safe=!!(it&&it.safe);box.innerHTML=postHTML(sp.dataset.u,safe,safe);rd.querySelectorAll('.card').forEach(k=>k.classList.toggle('on',k===sp));return;}
 const r=e.target.closest('a[data-role]');if(r){e.preventDefault();const pane=r.closest('.pane'),b=BUCKETS.find(x=>'p-'+x.id===pane.id),it=b.items[+r.dataset.role];const rd=select(pane,r.closest('li'));
  rd.innerHTML='<p class="who"><span>'+esc(it.y)+'</span></p><p class="rl">'+esc(it.label)+'</p>'+descHTML(it.desc)+logosHTML(it.label)+seriesHTML(it)+imagesHTML(it)+(it.link?'<p class="out"><a href="'+it.link+'" target="_blank" rel="noopener">Open '+esc(new URL(it.link).host)+' ↗</a></p>':'')+streamHTML(it);mobileBack(pane,rd);return;}
 const a=e.target.closest('a[data-u]');if(!a||a.classList.contains('mail'))return;e.preventDefault();const pane=a.closest('.pane'),u=a.dataset.u,lab=false;const rd=select(pane,a.closest('li'));
 const m=u.match(/status\/(\d+)/),yt=u.match(/youtu\.be\/([\w-]+)/);
 if(m)rd.innerHTML=postHTML(u,lab);
 else if(yt)rd.innerHTML='<p class="who"><span>YouTube · @emilylai8</span></p><a class="yt vid" href="'+u+'" data-yt="'+yt[1]+'"><img src="https://img.youtube.com/vi/'+yt[1]+'/hqdefault.jpg" alt="Play the video here"></a><p class="out"><a href="'+u+'" target="_blank" rel="noopener">Open on YouTube ↗</a></p>';
 else{const host=new URL(u).host;rd.innerHTML='<p class="who"><span>'+esc(host)+'</span></p><p class="out"><a href="'+u+'" target="_blank" rel="noopener">Open '+esc(host)+' ↗</a></p>';}
 mobileBack(pane,rd);});

/* column divider */
(function(){let drag=null,sx,sw;const v=store.get('listw',null);if(v)WIN.style.setProperty('--list',v);
 P.addEventListener('pointerdown',e=>{const d=e.target.closest('.divider');if(!d||isMobile())return;drag=d;d.classList.add('on');WIN.classList.add('resizing');d.setPointerCapture(e.pointerId);sx=e.clientX;sw=d.closest('.pane').querySelector('.list').getBoundingClientRect().width;});
 P.addEventListener('pointermove',e=>{if(!drag)return;const pw=drag.closest('.pane').getBoundingClientRect().width;let w=sw+(e.clientX-sx);w=Math.max(220,Math.min(w,pw-260));WIN.style.setProperty('--list',(w/pw*100).toFixed(1)+'%');});
 const end=()=>{if(!drag)return;drag.classList.remove('on');WIN.classList.remove('resizing');store.set('listw',WIN.style.getPropertyValue('--list'));drag=null;};P.addEventListener('pointerup',end);P.addEventListener('pointercancel',end);
 P.addEventListener('keydown',e=>{const d=e.target.closest('.divider');if(!d)return;const cur=parseFloat(WIN.style.getPropertyValue('--list'))||38;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){const n=Math.max(22,Math.min(70,cur+(e.key==='ArrowLeft'?-2:2)));WIN.style.setProperty('--list',n+'%');store.set('listw',n+'%');e.preventDefault();}});})();

/* drag the window by its bar (desktop) */
(function(){const bar=WIN.querySelector('.bar');let sx,sy,ox,oy,drag=false;
 bar.addEventListener('pointerdown',e=>{if(isMobile()||e.target.closest('button,[role=tab]'))return;try{bar.setPointerCapture(e.pointerId)}catch(err){return}drag=true;const m=/translate\((-?[\d.]+)px, ?(-?[\d.]+)px\)/.exec(WIN.style.transform||'');ox=m?+m[1]:0;oy=m?+m[2]:0;sx=e.clientX;sy=e.clientY;});
 bar.addEventListener('pointermove',e=>{if(!drag)return;const st=document.querySelector('.stage').getBoundingClientRect();let nx=ox+e.clientX-sx,ny=oy+e.clientY-sy;nx=Math.max(-(st.left-24),nx);ny=Math.max(-(st.top-24),ny);WIN.style.transform='translate('+nx+'px, '+ny+'px)';});
 const end=()=>{if(drag){drag=false;remember();}};bar.addEventListener('pointerup',end);bar.addEventListener('pointercancel',end);
 addEventListener('resize',()=>{if(isMobile()){WIN.style.transform='';if(open.length>1){open=[active];sync(false);}}document.body.classList.toggle('m-open',open.length>0&&isMobile());});})();

/* theme */
function paint(){const d=document.documentElement.dataset.theme||'light';document.querySelectorAll('.mode button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===d)));const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',d==='dark'?'#171717':'#FFFFFF');}
document.querySelectorAll('.mode button').forEach(b=>b.addEventListener('click',()=>{document.documentElement.dataset.theme=b.dataset.mode;try{localStorage.setItem('theme',b.dataset.mode)}catch(e){}paint();}));paint();

/* the window remembers */
(function(){const s=store.get('desk',null);if(s&&!isMobile()&&s.open&&s.open.length){open=s.open.filter(id=>visible().some(b=>b.id===id));active=open.includes(s.active)?s.active:open[open.length-1]||null;if(s.transform)WIN.style.transform=s.transform;if(s.w)WIN.style.width=s.w;if(s.h)WIN.style.height=s.h;sync(false);}
 new ResizeObserver(()=>{if(WIN.classList.contains('open'))remember();}).observe(WIN);})();

/* type to search */
(function(){const pal=document.getElementById('palette'),form=pal.querySelector('.search'),q=document.getElementById('q'),hits=form.querySelector('.hits'),btn=document.querySelector('.sbtn');pal.addEventListener('click',e=>{if(e.target===pal)hide();});pal.querySelector('.pclose').addEventListener('click',()=>hide());
 const textOf=it=>{if(Array.isArray(it)){const id=(String(it[2]||'').match(/status\/(\d+)/)||[])[1];return it[0]+' '+it[1]+' '+(id&&PREVIEWS[id]?PREVIEWS[id].text:'');}return [it.y,it.label,...(it.desc||[]),...((it.series||[]).map(s=>s.title)),...((it.posts||[]).map(u=>{const id=(u.match(/status\/(\d+)/)||[])[1];return id&&PREVIEWS[id]?PREVIEWS[id].text:''}))].join(' ');};
 function show(){pal.hidden=false;btn.setAttribute('aria-expanded','true');q.focus();}
 function hide(){pal.hidden=true;btn.setAttribute('aria-expanded','false');q.value='';apply('');}
 function apply(v){const s=v.trim().toLowerCase();let total=0;visible().forEach(b=>{const pane=document.getElementById('p-'+b.id);if(!pane)return;let n=0;const lis=pane.querySelectorAll('.list li');lis.forEach((li,i)=>{const ok=!s||textOf(b.items[i]).toLowerCase().includes(s);li.classList.toggle('hide',!ok);if(ok)n++;});total+=n;
  const fb=F.querySelector('[data-w="'+b.id+'"]');if(fb){fb.querySelector('.n').textContent=s?n:b.items.length;fb.classList.toggle('empty',!!s&&n===0);}const meta=pane.querySelector('.meta');if(meta)meta.textContent=(s?n:b.items.length)+' entries';
  lis.forEach(li=>{if(!li.classList.contains('first'))return;let el=li,any=!li.classList.contains('hide');while((el=el.nextElementSibling)&&!el.classList.contains('first')){if(!el.classList.contains('hide'))any=true;}const d=li.querySelector('.d');if(d)d.style.visibility=(s&&!any)?'hidden':'';});});hits.textContent=s?total+' found':'';}
 btn.addEventListener('click',()=>pal.hidden?show():hide());
 q.addEventListener('input',()=>apply(q.value));
 q.addEventListener('keydown',e=>{if(e.key==='Escape'){hide();e.preventDefault();}
  if(e.key==='Enter'){e.preventDefault();const li=visible().flatMap(b=>[...document.querySelectorAll('#p-'+b.id+' .list li')]).find(l=>!l.classList.contains('hide')&&l.querySelector('a'));if(!li)return;const pane=li.closest('.pane'),id=pane.id.slice(2);hide();if(!open.includes(id)){open.push(id);if(open.length>MAXTABS)open.shift();}active=id;if(isMobile())open=[id];sync(false);li.querySelector('a').click();}});
 addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey)return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable))return;if(e.key.length===1&&/[a-z0-9]/i.test(e.key)&&!isMobile()&&pal.hidden){show();}});
 addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.hidden?show():q.focus();}});})();

/* email, assembled here so the address is not in the markup */
/* the address is assembled only when someone means to use it; the page never renders it as text */
(function(){const arm=a=>{if(a.dataset.ok)return;const u=[...a.dataset.eu].reverse().join(''),d=[...a.dataset.ed].reverse().join('');a.href='mailto:'+u+'@'+d;a.dataset.ok='1';};
 for(const ev of ['pointerdown','mouseenter','focusin','touchstart','click'])document.addEventListener(ev,e=>{const a=e.target.closest&&e.target.closest('a.mail');if(a)arm(a);},true);})();

})();
