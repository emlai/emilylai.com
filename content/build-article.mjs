// Turns an X article into local HTML: node content/build-article.mjs <post id>
// Writes content/articles/<id>.json {title, cover, html} and downloads the images into media/.
import fs from 'node:fs';
const id=process.argv[2];if(!id){console.error('usage: node content/build-article.mjs <post id>');process.exit(1);}
const r=await fetch('https://api.fxtwitter.com/i/status/'+id);const t=(await r.json()).tweet;const a=t.article;if(!a){console.error('no article');process.exit(1);}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dash=s=>s.replace(/\s*[—–]\s*/g,', ');
async function grab(url,dest){if(fs.existsSync(dest))return;const x=await fetch(url);if(!x.ok)throw new Error(x.status+' '+url);fs.writeFileSync(dest,Buffer.from(await x.arrayBuffer()));}
const em=Array.isArray(a.content.entityMap)?Object.fromEntries(a.content.entityMap.map(e=>[String(e.key),e.value])):a.content.entityMap;
const mediaById=Object.fromEntries((a.media_entities||[]).map(m=>[m.media_id,m.media_info]));
let n=0;const out=[];let list=[];
const flush=()=>{if(list.length){out.push('<ul>'+list.join('')+'</ul>');list=[];}};
function inline(b){ // apply bold/italic and links by character ranges
 const chars=[...b.text];const open=Array(chars.length+1).fill('').map(()=>[]),close=Array(chars.length+1).fill('').map(()=>[]);
 for(const s of b.inlineStyleRanges||[]){const tag=s.style==='Bold'?'strong':s.style==='Italic'?'em':null;if(!tag)continue;open[s.offset].push('<'+tag+'>');close[s.offset+s.length].unshift('</'+tag+'>');}
 for(const e of b.entityRanges||[]){const ent=em[String(e.key)];if(ent&&ent.type==='LINK'&&ent.data.url){open[e.offset].push('<a href="'+esc(ent.data.url)+'" target="_blank" rel="noopener">');close[e.offset+e.length].unshift('</a>');}}
 for(const m of (b.data&&b.data.mentions)||[]){open[m.fromIndex].push('<a href="https://x.com/'+esc(m.text)+'" target="_blank" rel="noopener">');close[m.toIndex].unshift('</a>');}
 let s='';for(let i=0;i<=chars.length;i++){s+=close[i].join('');s+=open[i].join('');if(i<chars.length)s+=esc(chars[i]);}return dash(s);}
for(const b of a.content.blocks){
 if(b.type==='unordered-list-item'){list.push('<li>'+inline(b)+'</li>');continue;}flush();
 if(b.type==='atomic'){for(const e of b.entityRanges||[]){const ent=em[String(e.key)];if(!ent||ent.type!=='MEDIA')continue;for(const mi of ent.data.mediaItems||[]){const info=mediaById[mi.mediaId];if(!info||!info.original_img_url)continue;n++;const f='media/article-'+id+'-'+n+'.jpg';await grab(info.original_img_url,f);const cap=ent.data.caption?'<figcaption>'+esc(dash(ent.data.caption))+'</figcaption>':'';out.push('<figure><img src="'+f+'" alt="'+esc(ent.data.caption||'')+'" loading="lazy" decoding="async" width="'+info.original_img_width+'" height="'+info.original_img_height+'">'+cap+'</figure>');}}continue;}
 if(!b.text.trim())continue;
 if(b.type==='header-one')out.push('<h3>'+inline(b)+'</h3>');else if(b.type==='header-two')out.push('<h4>'+inline(b)+'</h4>');else out.push('<p>'+inline(b)+'</p>');}
flush();
let cover='';if(a.cover_media&&a.cover_media.media_info&&a.cover_media.media_info.original_img_url){cover='media/'+id+'-cover.jpg';await grab(a.cover_media.media_info.original_img_url,cover);}
fs.mkdirSync('content/articles',{recursive:true});
fs.writeFileSync('content/articles/'+id+'.json',JSON.stringify({title:dash(a.title||'').trim(),cover,html:out.join('\n')}));
console.log('article',id,'blocks',out.length,'images',n,'html chars',out.join('\n').length);
