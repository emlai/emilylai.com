/* emilylai.com: the desk. Data comes from content.js (BUCKETS) and previews.js (PREVIEWS). */
(function(){
'use strict';
const F=document.getElementById('folders'),T=document.getElementById('tabs'),P=document.getElementById('panes'),WIN=document.getElementById('win');
const isMobile=()=>innerWidth<=900;
const Motion=window.DeskMotion;
const MAXTABS=4;
const ICON='<svg class="i folder-icon" viewBox="0 0 24 24" aria-hidden="true"><path class="folder-back" d="M3 8V5.5A1.5 1.5 0 0 1 4.5 4h5L12 7h7.5A1.5 1.5 0 0 1 21 8.5V19H3Z"/><path class="folder-front" d="M3 9h18v10.5a.5.5 0 0 1-.5.5h-17a.5.5 0 0 1-.5-.5Z"/></svg>';
const XICON='<svg class="i" aria-hidden="true"><use href="assets/icons.svg#x"/></svg>';
const CONTACT='<div class="mcontact"><button type="button" class="contact-trigger" aria-expanded="false" aria-controls="contact-options">contact</button><a href="https://x.com/emilylai" target="_blank" rel="me noopener" aria-label="X, @emilylai"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5.4-7-6.2 7H1l8-9.2L.6 2h7.1l4.9 6.4L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z"/></svg></a><a href="https://linkedin.com/in/laiemily" target="_blank" rel="me noopener" aria-label="LinkedIn, laiemily"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zM7.1 20.4H3.6V9h3.5v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.5c0 1 .8 1.8 1.8 1.8h20.4c1 0 1.8-.8 1.8-1.8V1.7C24 .8 23.2 0 22.2 0z"/></svg></a></div>';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const md=s=>esc(s).replace(/\[([^\]]+)\]\((https?:[^)\s]+|#[A-Za-z0-9_-]+)\)/g,(m,label,url)=>url[0]==='#'?'<a href="'+url+'">'+label+'</a>':'<a href="'+url+'" target="_blank" rel="noopener">'+label+'</a>');
const linkedText=s=>String(s).split(/(https?:\/\/[^\s<>]+)/g).map((part,i)=>i%2?'<a href="'+esc(part)+'" target="_blank" rel="noopener">'+esc(part.replace(/^https?:\/\//,''))+'</a>':esc(part)).join('');
const plain=s=>String(s).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'$1');
const fmt=d=>{const [y,m,dd]=d.split('-');return (+dd)+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]+' '+y};
const store={get(k,f){try{const v=localStorage.getItem(k);return v==null?f:JSON.parse(v)}catch(e){return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

let seen=new Set(store.get('seen',[]));
const unlocked=()=>BUCKETS.filter(b=>!b.egg).every(b=>seen.has(b.id));
const visible=()=>BUCKETS.filter(b=>!b.egg||unlocked());
let open=[],active=null,pendingDiscovery=false;
// Pointer navigation should not inherit the keyboard focus ring.
addEventListener('pointerdown',()=>document.documentElement.dataset.input='pointer',{capture:true,passive:true});
addEventListener('keydown',()=>document.documentElement.dataset.input='keyboard',{capture:true});
function revealDiscovery(){if(!pendingDiscovery)return;pendingDiscovery=false;const egg=F.querySelector('.egg');if(!egg||matchMedia('(prefers-reduced-motion: reduce)').matches)return;egg.classList.add('just-unlocked');const finish=e=>{if(e.target!==egg||e.animationName!=='discovery-glow')return;egg.classList.remove('just-unlocked');egg.removeEventListener('animationend',finish);};egg.addEventListener('animationend',finish);}

/* client logos: files that exist in media/logos, shown under matching roles */
const LOGOS={'Hype':[['kraken.com','Kraken'],['optimism.io','Optimism'],['sui.io','Sui'],['consensys.io','Consensys'],['bitfinex.com','Bitfinex'],['polygon.technology','Polygon']],'Jump 450':[['fool.com','Motley Fool'],['moneylion.com','MoneyLion'],['jtv.com','Jewelry TV'],['gorjana.com','Gorjana'],['integrativenutrition.com','Institute for Integrative Nutrition'],['talentless.co','Talentless'],['foursigmatic.com','Four Sigmatic']]};
function logosHTML(label){const k=Object.keys(LOGOS).find(k=>label.startsWith(k));if(!k)return '';return '<div class="logos">'+LOGOS[k].map(([d,n])=>'<img src="media/logos/'+d+'.png" alt="'+esc(n)+'" title="'+esc(n)+'" loading="lazy" onerror="this.remove()">').join('')+'</div>';}
/* render */
function renderFolders(){F.innerHTML=visible().map(b=>'<li'+(b.egg?' class="egg"':'')+'><button type="button" aria-expanded="false" aria-controls="p-'+b.id+'" data-w="'+b.id+'">'+ICON+'<span class="lbl">'+esc(b.name)+'</span><span class="n">'+b.items.length+'</span></button></li>').join('');}
function rowHTML(it,i,prev){if(Array.isArray(it)){const py=prev?(Array.isArray(prev)?prev[0]:prev.y):null;const first=py!==it[0];return '<li'+(first?' class="first"':'')+'>'+(first?'<span class="d">'+esc(it[0])+'</span>':'')+'<span>'+(it[2]?'<a href="'+it[2]+'" data-u="'+it[2]+'">'+esc(it[1])+'</a>':esc(it[1]))+'</span></li>';}
 const py=prev?(Array.isArray(prev)?prev[0]:prev.y):null;const first=py!==it.y;return '<li class="role'+(first?' first':'')+'">'+(first?'<span class="d">'+esc(it.y)+'</span>':'')+'<span><a href="#" class="lbl" data-role="'+i+'">'+esc(plain(it.label))+'</a></span></li>';}
function renderPanes(){P.innerHTML=BUCKETS.map(b=>'<div class="pane" id="p-'+b.id+'" role="tabpanel" aria-labelledby="h-'+b.id+'"><div class="list"><h2 id="h-'+b.id+'">'+esc(b.name)+'</h2><p class="meta">'+b.items.length+' entries</p><ul>'+b.items.map((it,i)=>rowHTML(it,i,b.items[i-1])).join('')+'</ul>'+CONTACT+'</div><div class="divider" role="separator" aria-orientation="vertical" aria-label="Resize columns" aria-valuemin="22" aria-valuemax="70" aria-valuenow="38" tabindex="0"></div><div class="nav-shade" aria-hidden="true"></div><aside class="reader" tabindex="-1" aria-label="Entry content"><p class="empty">Select an entry to read it here.</p></aside></div>').join('');}
function remember(){store.set('desk',{open,active,transform:isMobile()?'':WIN.style.transform||'',w:isMobile()?'':WIN.style.width||'',h:isMobile()?'':WIN.style.height||''});}
function keepWindowInView(){if(isMobile()||!open.length)return;const r=WIN.getBoundingClientRect(),m=/translate\((-?[\d.]+)px, ?(-?[\d.]+)px\)/.exec(WIN.style.transform||'');const dx=r.left<24?24-r.left:Math.min(0,innerWidth-24-r.right),dy=r.top<24?24-r.top:Math.min(0,innerHeight-24-r.bottom);if(dx||dy)WIN.style.transform='translate('+((m?+m[1]:0)+dx)+'px, '+((m?+m[2]:0)+dy)+'px)';}
function dividerBounds(pane){const style=getComputedStyle(pane),width=pane.clientWidth;const min=parseFloat(style.getPropertyValue("--list-min")),reader=parseFloat(style.getPropertyValue("--reader-min")),divider=parseFloat(style.getPropertyValue("--divider-width"));return {width,min,max:Math.max(min,width-reader-divider)};}
function updateDividers(){if(isMobile())return;P.querySelectorAll('.pane.on .divider').forEach(d=>{const {width,min,max}=dividerBounds(d.parentElement);if(!width)return;d.setAttribute('aria-valuemin',Math.round(min/width*100));d.setAttribute('aria-valuemax',Math.round(max/width*100));d.setAttribute('aria-valuenow',Math.round(d.previousElementSibling.clientWidth/width*100));});}
function pauseMedia(root){root.querySelectorAll('video').forEach(v=>v.pause());root.querySelectorAll('iframe[src*="youtube-nocookie.com"]').forEach(f=>{f.dataset.resumeSrc=f.src.replace(/[?&]autoplay=1/,'');f.removeAttribute('src');});}
function sync(focusTab){if(isMobile()&&open.length>1)open=[active];remember();
 WIN.classList.toggle('open',open.length>0);document.body.classList.toggle('m-open',open.length>0&&isMobile());
 WIN.inert=!open.length;
 document.querySelector('.layout>aside').inert=open.length>0&&isMobile();
 document.querySelector('.contact').inert=open.length>0&&isMobile();
 const tabIds=isMobile()?visible().filter(b=>!b.egg||store.get('eggOpened',false)).map(b=>b.id):open;
 if(T.dataset.ids!==tabIds.join("|")){T.innerHTML=tabIds.map(id=>{const b=BUCKETS.find(x=>x.id===id);return '<div class="tab" role="tab" id="t-'+id+'" tabindex="'+(id===active?0:-1)+'" aria-selected="'+(id===active)+'" aria-controls="p-'+id+'" data-t="'+id+'"><span class="name">'+esc(b.name)+'</span><button type="button" class="x" aria-label="Close '+esc(b.name)+'" data-x="'+id+'">'+XICON+'</button></div>'}).join('');T.dataset.ids=tabIds.join("|");}
 T.querySelectorAll("[data-t]").forEach(t=>{const selected=t.dataset.t===active;t.setAttribute("aria-selected",String(selected));t.tabIndex=selected?0:-1;});
 P.querySelectorAll('.pane').forEach(p=>{p.classList.toggle('on',p.id==='p-'+active);p.querySelector('.list').inert=isMobile()&&p.classList.contains('has-cur');p.querySelector('.reader').inert=isMobile()&&!p.classList.contains('has-cur');});
 P.querySelectorAll('.pane').forEach(p=>{if(!p.classList.contains('on')||(isMobile()&&!p.classList.contains('has-cur')))pauseMedia(p);else p.querySelectorAll('iframe[data-resume-src]').forEach(f=>{f.src=f.dataset.resumeSrc;delete f.dataset.resumeSrc;});});
 updateDividers();
 F.querySelectorAll('button').forEach(b=>b.setAttribute('aria-expanded',String(open.includes(b.dataset.w))));
 const selected=T.querySelector('[aria-selected="true"]');
 if(selected){selected.scrollIntoView({inline:'nearest',block:'nearest'});if(focusTab)selected.focus({preventScroll:true});}}
renderFolders();renderPanes();
WIN.inert=true;
function visit(id){const was=unlocked();seen.add(id);store.set('seen',[...seen]);if(!was&&unlocked()){pendingDiscovery=true;renderFolders();}if(BUCKETS.find(b=>b.id===id)?.egg)store.set('eggOpened',true);}
function closeWindow(immediate=false){if(immediate!==true&&isMobile()&&open.length){Motion.folderClose(()=>closeWindow(true));return;}const id=active;open=[];active=null;sync(false);revealDiscovery();F.querySelector('[data-w="'+id+'"]')?.focus({preventScroll:true});}
function backToList(pane,immediate=false){if(!immediate&&isMobile()&&pane.classList.contains('has-cur')){Motion.noteBack(pane,()=>backToList(pane,true));return;}pauseMedia(pane);pane.classList.remove('has-cur');const a=pane.querySelector('.list li.cur a');pane.querySelector('.list').inert=false;pane.querySelector('.reader').inert=isMobile();a?.focus({preventScroll:true});}
Motion.connect({back:pane=>backToList(pane,true),close:()=>closeWindow(true),
 neighbor:direction=>{const tabs=[...T.querySelectorAll('[data-t]')],i=tabs.findIndex(t=>t.dataset.t===active),id=tabs[i+direction]?.dataset.t;return id?document.getElementById('p-'+id):null;},
 tab:pane=>{const id=pane.id.slice(2);visit(id);open=[id];active=id;P.querySelectorAll('.pane').forEach(p=>p.classList.remove('has-cur'));sync(false);T.querySelector('[aria-selected="true"]')?.focus({preventScroll:true});}
});

/* folders */
F.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.w;const was=unlocked();seen.add(id);store.set('seen',[...seen]);if(!was&&unlocked()){pendingDiscovery=true;renderFolders();}if((BUCKETS.find(x=>x.id===id)||{}).egg)store.set('eggOpened',true);
 if(isMobile()){const origin=b.getBoundingClientRect();open=[id];active=id;document.querySelectorAll('.pane').forEach(p=>p.classList.remove('has-cur'));sync(e.detail===0);Motion.folderOpen(origin);return;}
 if(open.includes(id)){open=open.filter(o=>o!==id);active=open[open.length-1]||null;sync(false);}else{const first=!open.length;open.push(id);if(open.length>MAXTABS)open.shift();active=id;sync(true);if(first)Motion.folderOpen();}});

/* tabs */
T.addEventListener('click',e=>{const x=e.target.closest('.x');const t=e.target.closest('[data-t]');
 if(isMobile()){if(t){const direction=BUCKETS.findIndex(b=>b.id===t.dataset.t)-BUCKETS.findIndex(b=>b.id===active);Motion.reset();visit(t.dataset.t);open=[t.dataset.t];active=t.dataset.t;document.querySelectorAll('.pane').forEach(p=>p.classList.remove('has-cur'));sync(e.detail===0);if(direction){Motion.tabChange(P.querySelector('.pane.on'),Math.sign(direction));Motion.haptic();}}return;}
 if(x){const id=x.dataset.x;if(open.length===1){closeWindow();return;}open=open.filter(o=>o!==id);if(active===id)active=open[open.length-1]||null;sync(true);return;}
 if(t){active=t.dataset.t;sync(true);}});
T.addEventListener('keydown',e=>{if(e.target.closest('.x'))return;const tabs=[...T.querySelectorAll('[data-t]')],i=tabs.findIndex(t=>t.dataset.t===active);let next;
 if(e.key==='ArrowRight')next=tabs[(i+1)%tabs.length];else if(e.key==='ArrowLeft')next=tabs[(i-1+tabs.length)%tabs.length];else if(e.key==='Home')next=tabs[0];else if(e.key==='End')next=tabs[tabs.length-1];else if(e.key==='Enter'||e.key===' ')next=e.target.closest('[data-t]');else if(e.key==='Delete'&&!isMobile()){e.preventDefault();e.target.querySelector('.x')?.click();return;}
 if(next){e.preventDefault();next.click();T.querySelector('[aria-selected="true"]')?.focus({preventScroll:true});}});
WIN.querySelector('.close').addEventListener('click',closeWindow);
addEventListener('keydown',e=>{if(e.key==='Escape'&&open.length&&document.getElementById('palette').hidden){const pane=P.querySelector('.pane.on.has-cur');if(isMobile()&&pane)backToList(pane);else closeWindow();}});

/* reader */
function imageHTML(src,alt='',eager=false){const m=window.MEDIA?.[src];return '<img src="'+esc(m?.src||src)+'" alt="'+esc(alt)+'"'+(m?' width="'+m.w+'" height="'+m.h+'"':'')+' loading="'+(eager?'eager':'lazy')+'"'+(eager?' fetchpriority="high"':'')+' decoding="async">';}
function mediaHTML(med,u){if(!med.length)return '';const mh=med.map(x=>x.t==='photo'?imageHTML(x.src,'Image from the post'):(/\.mp4$/.test(x.src)?'<video controls preload="none" playsinline poster="'+(window.MEDIA?.[x.poster]?.src||x.poster||'')+'" src="'+x.src+'"></video>':'<a class="vid" href="'+u+'" target="_blank" rel="noopener" title="Play on X (opens in a new tab)"><img src="'+(x.poster||x.src)+'" alt="Video from the post" loading="lazy"></a>')).join('');return '<div class="media'+(med.length>=3?' many':'')+'">'+mh+'</div>';}
function postHTML(u,lab,noMedia,cut,noThread,textBeforeMedia=false){const m=u.match(/status\/(\d+)/);const p=m&&PREVIEWS[m[1]];
 if(!p)return '<div class="post"><p class="who"><span>X · @emilylai</span></p><p class="out"><a href="'+u+'" target="_blank" rel="noopener">Open on X ↗</a></p></div>';
 let body=lab?p.text.split(/\n/)[0]:p.text,cutted=false;if(cut){const i=p.text.toLowerCase().indexOf(cut.toLowerCase());if(i>=0){body=p.text.slice(0,i+cut.length);cutted=true;}}const med=noMedia?[]:(p.media||[]);
 const more=(lab||cutted||noThread||!p.thread)?'':p.thread.map(t=>'<div class="cont">'+mediaHTML(t.media||[],u)+'<p class="txt">'+linkedText(t.text)+'</p></div>').join('');
 const text='<p class="txt">'+linkedText(body)+(lab?' <a href="'+u+'" target="_blank" rel="noopener">The rest is on X ↗</a>':'')+'</p>';
 return '<div class="post"><p class="who"><span>X · @'+esc(p.author||'emilylai')+'</span><span>'+fmt(p.date)+'</span></p>'+(textBeforeMedia?text+mediaHTML(med,u):mediaHTML(med,u)+text)+more+(lab?'':'<p class="stats">'+p.likes.toLocaleString()+' likes</p><p class="out"><a href="'+u+'" target="_blank" rel="noopener">'+(cutted?'Read the rest on X ↗':'Open on X ↗')+'</a></p>')+'</div>';}
function cardHTML(s){if(s.kind==='yt')return '<a role="listitem" class="card" href="https://youtu.be/'+s.id+'" data-yt="'+s.id+'"><img src="https://img.youtube.com/vi/'+s.id+'/mqdefault.jpg" alt="" loading="lazy"><span>'+esc(s.title)+'</span></a>';
 const id=(s.url.match(/status\/(\d+)/)||[])[1];const pv=PREVIEWS[id],media=pv?.media?.[0],thumb=media&&(media.t==='photo'?media.src:media.poster);const th=thumb?'<img src="'+thumb+'" alt="" loading="lazy">':'<span class="ph">X</span>';return '<a role="listitem" class="card" href="'+s.url+'" data-u="'+s.url+'" data-series="1">'+th+'<span>'+esc(s.title)+'</span></a>';}
function descHTML(d){if(!d||!d.length)return '';let out='',ul=[];const flush=()=>{if(ul.length){out+='<ul class="bul">'+ul.map(x=>'<li>'+md(x)+'</li>').join('')+'</ul>';ul=[];}};
 for(const line of d){if(line.startsWith('## ')){flush();out+='<p class="sub">'+md(line.slice(3))+'</p>';}else if(line.startsWith('> ')){flush();out+='<p class="para">'+md(line.slice(2))+'</p>';}else ul.push(line.replace(/^- /,''));}flush();return out;}
function imagesHTML(it){return (it.images||[]).filter(img=>(img.src||img)!==it.cover?.src).map(img=>'<div class="media">'+(img.src?'<a href="'+esc(img.src)+'" target="_blank" rel="noopener" aria-label="'+esc(img.alt)+': open full size">'+imageHTML(img.src,img.alt)+'</a>':imageHTML(img))+'</div>').join('');}
function embedHTML(e){const url=e.src.replace('/embed/feed/update/','/feed/update/');return '<div class="li"><p class="who"><span>LinkedIn</span><a href="'+esc(url)+'" target="_blank" rel="noopener">Open original ↗</a></p><iframe src="'+esc(e.src)+'" height="'+e.h+'" loading="lazy" tabindex="-1" title="LinkedIn post preview"></iframe></div>';}
function coverHTML(it){return it.cover?'<div class="media cover">'+imageHTML(it.cover.src,it.cover.alt,true)+'</div>':'';}
function deckHTML(it){if(!it.deck)return '';return '<details class="deck"><summary>View all '+it.deck.slides.length+' slides</summary>'+it.deck.slides.map((slide,i)=>'<figure><a href="'+esc(slide.src)+'" target="_blank" rel="noopener" aria-label="Open slide '+(i+1)+' full size"><img src="'+esc(slide.src)+'" alt="'+esc(slide.text||'Presentation slide '+(i+1))+'" width="1440" height="1080" loading="lazy" decoding="async"></a><figcaption>Slide '+(i+1)+' of '+it.deck.slides.length+'</figcaption></figure>').join('')+'<p class="out"><a href="'+esc(it.deck.url)+'" target="_blank" rel="noopener">Original presentation on SlideShare ↗</a></p></details>';}
/* a single video renders large; several render as a row of cards (or stacked for type stack) */
function seriesHTML(it){if(!it.series)return '';if(it.stack||(it.series.length===1&&it.series[0].kind==='yt'))return it.series.map(stackHTML).join('');return '<div class="row" role="list">'+it.series.map(cardHTML).join('')+'</div><div class="stagebox"></div>';}
/* posts and LinkedIn embeds in one stream, newest first. LinkedIn ids carry their timestamp in the top bits. */
const streams=new WeakMap(),streamObservers=new WeakMap();
function streamHTML(it){if(streams.has(it))return streamStart(streams.get(it));const items=[];for(const u of it.posts||[]){const id=(u.match(/status\/(\d+)/)||[])[1];const p=id&&PREVIEWS[id];const so=!!(it.solo&&it.solo[id]);items.push({id,d:p?p.date:'0000',time:socialTimestamp(u,p?.date),html:postHTML(u,!!it.safe,!!it.safe||so,it.cuts&&it.cuts[id],so,!!it.textBeforeMedia)});}
 for(const e of it.embeds||[]){const m=e.src.match(/:(\d{15,})/);let d='0000';if(m){try{d=new Date(Number(BigInt(m[1])>>22n)).toISOString().slice(0,10)}catch(x){}}items.push({id:m?.[1],d,time:socialTimestamp(e.src,d),html:embedHTML(e)});}
 if(it.newestFirst)items.sort((a,b)=>b.time-a.time);else if(it.embeds?.length&&!it.postsFirst)items.sort((a,b)=>b.d.localeCompare(a.d));for(const id of [...(it.streamOrder||[])].reverse()){const i=items.findIndex(x=>x.id===id);if(i>=0)items.unshift(...items.splice(i,1));}let year='';const html=items.map(x=>{const y=x.d.slice(0,4),heading=it.yearSections&&year&&y!==year?'<div class="year-break"><h3>'+esc(y)+'</h3><p>'+'5 years earlier'+'</p></div>':'';year=y;return heading+x.html;});streams.set(it,html);return streamStart(html);}
function streamStart(items){return items.length?'<div class="more-posts" aria-hidden="true"></div>':'';}
function observeStream(rd,it){const marker=rd.querySelector('.more-posts'),items=it&&streams.get(it);if(!marker||!items)return;let next=0;
 const observer=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting)||!rd.closest('.pane.on'))return;marker.insertAdjacentHTML('beforebegin',items.slice(next,next+2).join(''));if(next===0){const first=rd.querySelector('img');if(first){first.loading='eager';first.fetchPriority='high';}}next+=2;if(next>=items.length){observer.disconnect();marker.remove();streamObservers.delete(rd);}else{observer.unobserve(marker);observer.observe(marker);}},{root:rd,rootMargin:'600px 0px'});
 streamObservers.set(rd,observer);observer.observe(marker);}
function stackHTML(s){if(s.kind==='yt')return '<div class="post"><p class="who"><span>YouTube · @emilylai8</span></p><a class="yt vid" href="https://youtu.be/'+s.id+'" data-yt="'+s.id+'"><img src="https://img.youtube.com/vi/'+s.id+'/hqdefault.jpg" alt="Play: '+esc(s.title)+'"></a><p class="txt">'+esc(s.title)+'</p></div>';return postHTML(s.url,false);}
function select(pane,li){pane.querySelectorAll('.list li').forEach(l=>l.classList.remove('cur'));li.classList.add('cur');pane.classList.add('has-cur');pane.querySelector('.list').inert=isMobile();const rd=pane.querySelector('.reader');streamObservers.get(rd)?.disconnect();streamObservers.delete(rd);rd.inert=false;rd.scrollTop=0;return rd;}
function mobileBack(pane,rd,it){rd.insertAdjacentHTML('afterbegin','<button type="button" class="back"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'+esc(pane.querySelector('h2').textContent)+'</button>');if(isMobile()){Motion.noteOpen(pane);rd.querySelector('.back').focus({preventScroll:true});}else rd.focus({preventScroll:true});observeStream(rd,it);}
P.addEventListener('click',e=>{
 const jump=e.target.closest('a[href="#growth-early-ab"]');
 if(jump){e.preventDefault();document.querySelector('[data-w="growth"]')?.click();const pane=document.getElementById('p-growth');const entry=[...pane.querySelectorAll('a[data-role]')].find(a=>a.textContent.includes('Early A/B tests'));entry?.click();return;}
 const bk=e.target.closest('.back,.media-back');if(bk){backToList(bk.closest('.pane'));return;}
 const y=e.target.closest('a[data-yt]');if(y){e.preventDefault();const rd=y.closest('.reader'),box=rd.querySelector('.stagebox');const html='<div class="video-frame"><button type="button" class="media-back" aria-label="Back to entries" title="Swipe right or tap to go back"><span aria-hidden="true">‹</span></button><iframe src="https://www.youtube-nocookie.com/embed/'+y.dataset.yt+'?autoplay=1" title="Video" allow="autoplay" allowfullscreen></iframe></div>';if(box){box.innerHTML=html;rd.querySelectorAll('.card').forEach(k=>k.classList.toggle('on',k===y));}else y.outerHTML=html;return;}
 const sp=e.target.closest('a[data-series]');if(sp){e.preventDefault();const rd=sp.closest('.reader'),box=rd.querySelector('.stagebox');const b=BUCKETS.find(x=>'p-'+x.id===sp.closest('.pane').id),cur=sp.closest('.pane').querySelector('li.cur a[data-role]'),it=cur&&b.items[+cur.dataset.role],safe=!!(it&&it.safe);box.innerHTML=postHTML(sp.dataset.u,safe,safe);rd.querySelectorAll('.card').forEach(k=>k.classList.toggle('on',k===sp));return;}
 const r=e.target.closest('a[data-role]');if(r){e.preventDefault();const pane=r.closest('.pane'),b=BUCKETS.find(x=>'p-'+x.id===pane.id),it=b.items[+r.dataset.role];const rd=select(pane,r.closest('li'));
  rd.innerHTML=coverHTML(it)+'<p class="who"><span>'+esc(it.y)+'</span></p>'+(it.hideTitle?'':'<p class="rl">'+md(it.label)+'</p>')+descHTML(it.desc)+logosHTML(it.label)+seriesHTML(it)+imagesHTML(it)+deckHTML(it)+(it.link?'<p class="out"><a href="'+it.link+'" target="_blank" rel="noopener">Open '+esc(new URL(it.link).host)+' ↗</a></p>':'')+streamHTML(it);mobileBack(pane,rd,it);return;}
 const a=e.target.closest('a[data-u]');if(!a||a.classList.contains('mail'))return;e.preventDefault();const pane=a.closest('.pane'),u=a.dataset.u,lab=false;const rd=select(pane,a.closest('li'));
 const m=u.match(/status\/(\d+)/),yt=u.match(/youtu\.be\/([\w-]+)/);
 if(m)rd.innerHTML=postHTML(u,lab);
 else if(yt)rd.innerHTML='<p class="who"><span>YouTube · @emilylai8</span></p><a class="yt vid" href="'+u+'" data-yt="'+yt[1]+'"><img src="https://img.youtube.com/vi/'+yt[1]+'/hqdefault.jpg" alt="Play the video here"></a><p class="out"><a href="'+u+'" target="_blank" rel="noopener">Open on YouTube ↗</a></p>';
 else{const host=new URL(u).host;rd.innerHTML='<p class="who"><span>'+esc(host)+'</span></p><p class="out"><a href="'+u+'" target="_blank" rel="noopener">Open '+esc(host)+' ↗</a></p>';}
 mobileBack(pane,rd);});

/* Finger-tracked navigation is handled by motion.js. */

/* column divider */
(function(){let drag=null,sx,sw;const v=store.get('listw',null);if(v)WIN.style.setProperty('--list',v);
 P.addEventListener('pointerdown',e=>{const d=e.target.closest('.divider');if(!d||isMobile())return;drag=d;d.classList.add('on');WIN.classList.add('resizing');d.setPointerCapture(e.pointerId);sx=e.clientX;sw=d.closest('.pane').querySelector('.list').getBoundingClientRect().width;});
 P.addEventListener('pointermove',e=>{if(!drag)return;const {width:pw,min,max}=dividerBounds(drag.closest('.pane'));let w=sw+(e.clientX-sx);w=Math.max(min,Math.min(w,max));WIN.style.setProperty('--list',(w/pw*100).toFixed(1)+'%');updateDividers();});
 const end=()=>{if(!drag)return;drag.classList.remove('on');WIN.classList.remove('resizing');store.set('listw',WIN.style.getPropertyValue('--list'));drag=null;};P.addEventListener('pointerup',end);P.addEventListener('pointercancel',end);
 P.addEventListener('keydown',e=>{const d=e.target.closest('.divider');if(!d)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){updateDividers();const cur=+d.getAttribute('aria-valuenow'),min=+d.getAttribute('aria-valuemin'),max=+d.getAttribute('aria-valuemax');const n=Math.max(min,Math.min(max,cur+(e.key==='ArrowLeft'?-2:2)));WIN.style.setProperty('--list',n+'%');updateDividers();store.set('listw',n+'%');e.preventDefault();}});})();

/* drag the window by its bar (desktop) */
(function(){const bar=WIN.querySelector('.bar');let sx,sy,ox,oy,drag=false;
 bar.addEventListener('pointerdown',e=>{if(isMobile()||e.target.closest('button,[role=tab]'))return;try{bar.setPointerCapture(e.pointerId)}catch(err){return}drag=true;const m=/translate\((-?[\d.]+)px, ?(-?[\d.]+)px\)/.exec(WIN.style.transform||'');ox=m?+m[1]:0;oy=m?+m[2]:0;sx=e.clientX;sy=e.clientY;});
 bar.addEventListener('pointermove',e=>{if(!drag)return;const st=document.querySelector('.stage').getBoundingClientRect();let nx=ox+e.clientX-sx,ny=oy+e.clientY-sy;nx=Math.max(24-st.left,Math.min(nx,innerWidth-st.left-WIN.offsetWidth-24));ny=Math.max(24-st.top,Math.min(ny,innerHeight-st.top-WIN.offsetHeight-24));WIN.style.transform='translate('+nx+'px, '+ny+'px)';});
 const end=()=>{if(drag){drag=false;remember();}};bar.addEventListener('pointerup',end);bar.addEventListener('pointercancel',end);
 let mobile=isMobile();addEventListener('resize',()=>{WIN.style.transform='';if(mobile!==isMobile()){mobile=isMobile();if(mobile){WIN.style.width='';WIN.style.height='';if(open.length>1)open=[active];}sync(false);}document.body.classList.toggle('m-open',open.length>0&&isMobile());});})();

/* theme */
function paint(){const d=document.documentElement.dataset.theme||'light';document.querySelectorAll('.mode button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===d)));const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',d==='dark'?'#171717':'#FFFFFF');}
document.querySelectorAll('.mode button').forEach(b=>b.addEventListener('click',()=>{if(document.documentElement.dataset.theme===b.dataset.mode)return;document.documentElement.dataset.theme=b.dataset.mode;try{localStorage.setItem('theme',b.dataset.mode)}catch(e){}paint();Motion.haptic();}));paint();

/* the window remembers */
(function(){const s=store.get('desk',null);if(s&&!isMobile()&&s.open&&s.open.length){open=s.open.filter(id=>visible().some(b=>b.id===id));active=open.includes(s.active)?s.active:open[open.length-1]||null;if(s.transform)WIN.style.transform=s.transform;if(s.w)WIN.style.width=s.w;if(s.h)WIN.style.height=s.h;sync(false);keepWindowInView();}
 new ResizeObserver(()=>{if(WIN.classList.contains('open')){keepWindowInView();remember();updateDividers();}}).observe(WIN);})();

/* Search exposes every matching entry without changing the folder lists. */
(function(){
 const pal=document.getElementById('palette'),q=document.getElementById('q'),hits=pal.querySelector('.hits'),btn=document.querySelector('.sbtn'),results=document.getElementById('search-results');
 let returnFocus=btn;
 const textOf=it=>{if(Array.isArray(it)){const id=(String(it[2]||'').match(/status\/(\d+)/)||[])[1];return it[0]+' '+it[1]+' '+(id&&PREVIEWS[id]?PREVIEWS[id].text:'');}return [it.y,it.label,...(it.desc||[]),...((it.series||[]).map(s=>s.title)),...((it.posts||[]).map(u=>{const id=(u.match(/status\/(\d+)/)||[])[1];return id&&PREVIEWS[id]?PREVIEWS[id].text:''}))].join(' ');};
 function show(){
  returnFocus=document.activeElement;pal.hidden=false;btn.setAttribute('aria-expanded','true');
  document.querySelector('.layout').inert=true;document.querySelector('.contact').inert=true;
  apply(q.value);q.focus();
 }
 function hide(restore=true){
  pal.hidden=true;btn.setAttribute('aria-expanded','false');document.querySelector('.layout').inert=false;
  document.querySelector('.contact').inert=isMobile()&&open.length>0;q.value='';apply('');
  if(restore&&returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
 }
 function apply(v){
  const s=v.trim().toLowerCase();
  if(!s){hits.textContent='';results.innerHTML='<p>Search by topic, project, or year.</p>';return;}
  const matches=[];
  visible().forEach(b=>b.items.forEach((it,i)=>{if(textOf(it).toLowerCase().includes(s))matches.push({b,it,i});}));
  hits.textContent=matches.length+' found';
  results.innerHTML=matches.length?matches.map(({b,it,i})=>'<button type="button" data-folder="'+b.id+'" data-entry="'+i+'"><span>'+esc(Array.isArray(it)?it[1]:it.label)+'</span><small>'+esc(b.name)+' · '+esc(Array.isArray(it)?it[0]:it.y)+'</small></button>').join(''):'<p>No entries found. Try a different topic or year.</p>';
 }
 function choose(button){
  const id=button.dataset.folder,index=+button.dataset.entry;hide(false);visit(id);
  if(!open.includes(id)){open.push(id);if(open.length>MAXTABS)open.shift();}
  active=id;if(isMobile())open=[id];sync(false);
  P.querySelectorAll('#p-'+id+' .list li')[index].querySelector('a')?.click();
 }
 pal.addEventListener('click',e=>{if(e.target===pal)hide();});
 pal.querySelector('.pclose').addEventListener('click',()=>hide());
 results.addEventListener('click',e=>{const b=e.target.closest('button');if(b)choose(b);});
 btn.addEventListener('click',()=>pal.hidden?show():hide());
 q.addEventListener('input',()=>apply(q.value));
 q.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();const first=results.querySelector('button');if(first)choose(first);}
  if(e.key==='ArrowDown'){e.preventDefault();results.querySelector('button')?.focus();}
 });
 pal.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hide();return;}
  const buttons=[...results.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);
  if(i>=0&&(e.key==='ArrowDown'||e.key==='ArrowUp')){
   e.preventDefault();const next=i+(e.key==='ArrowDown'?1:-1);(next<0?q:buttons[Math.min(next,buttons.length-1)]).focus();
  }
  if(e.key==='Tab'){
   const focusable=[q,pal.querySelector('.pclose'),...buttons],first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });
 addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable))return;
  if(e.key.length===1&&/[a-z0-9]/i.test(e.key)&&!isMobile()&&pal.hidden){e.preventDefault();show();q.value=e.key;apply(q.value);}
 });
 addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.hidden?show():q.focus();}});
})();

/* Contact options, shared by home and mobile folder views. */
(function(){
 const popup=document.getElementById('contact-options');let trigger;
 const close=(restore=false)=>{popup.hidden=true;if(trigger){trigger.setAttribute('aria-expanded','false');if(restore&&trigger.isConnected)trigger.focus();}};
 const position=()=>{if(popup.hidden||!trigger)return;const r=trigger.getBoundingClientRect(),w=popup.offsetWidth,h=popup.offsetHeight;popup.style.left=Math.max(16,Math.min(r.left,innerWidth-w-16))+'px';popup.style.top=Math.max(16,r.top-h-8>=16?r.top-h-8:Math.min(r.bottom+8,innerHeight-h-16))+'px';};
 document.addEventListener('click',e=>{const t=e.target.closest('.contact-trigger');if(t){const opening=popup.hidden||trigger!==t;close();if(opening){trigger=t;popup.hidden=false;t.setAttribute('aria-expanded','true');position();popup.querySelector('a').focus();}return;}if(e.target.closest('#contact-options a'))close(true);else if(!popup.contains(e.target))close();});
 document.addEventListener('keydown',e=>{if(!popup.hidden&&e.key==='Tab'&&e.shiftKey&&e.target===popup.querySelector('a')){e.preventDefault();close(true);return;}if(!popup.hidden&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close(true);}},true);
 document.addEventListener('focusin',e=>{if(!popup.hidden&&!popup.contains(e.target)&&e.target!==trigger)close();});
 addEventListener('resize',()=>close());document.addEventListener('scroll',()=>close(),true);
})();


})();
