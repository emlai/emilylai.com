// Builds previews.js (post text, date, likes, media) from Emily's X archive export for every post linked in content.js,
// and copies the matching photos into media/. Usage: node content/build-previews.mjs <archive dir> [content.js] [previews.js]
import fs from 'node:fs'; import path from 'node:path';
const [,, A, contentPath='content.js', outPath='previews.js']=process.argv;
if(!A){console.error('usage: node content/build-previews.mjs <archive dir>');process.exit(1);}
const he=s=>s.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const dash=s=>s.replace(/(^|\n)\s*[—–]\s*/g,'$1- ').replace(/\s*[—–]\s*/g,', ');
const raw=fs.readFileSync(path.join(A,'data/tweets.js'),'utf8');const arr=JSON.parse(raw.slice(raw.indexOf('=')+1)).map(x=>x.tweet);const byId=new Map(arr.map(t=>[t.id_str,t]));
const src=fs.readFileSync(contentPath,'utf8');const ids=[...new Set([...src.matchAll(/status\/(\d+)/g)].map(m=>m[1]))];
const FX=fs.existsSync('content/fetched.json')?JSON.parse(fs.readFileSync('content/fetched.json','utf8')):{};
// Editorial restorations survive subsequent archive imports, including long thread replies.
const overrides=JSON.parse(fs.readFileSync('content/preview-overrides.json','utf8'));
const kids=new Map();for(const t of arr){if(t.in_reply_to_status_id_str&&t.in_reply_to_screen_name==='emilylai'){if(!kids.has(t.in_reply_to_status_id_str))kids.set(t.in_reply_to_status_id_str,[]);kids.get(t.in_reply_to_status_id_str).push(t);}}
const clean=s=>dash(he(s.replace(/https:\/\/t\.co\/\w+/g,'').replace(/^(@\w+\s+)+/,'').replace(/\s+\n/g,'\n').trim()));
const mediaDir=path.join(A,'data/tweets_media');const files=fs.readdirSync(mediaDir);const prev={};let copied=0;const missing=[];
function mediaOf(t,id){const ents=(t.extended_entities&&t.extended_entities.media)||(t.entities&&t.entities.media)||[];const out=[];
 for(const m of ents){const base=m.media_url_https.split('/').pop().replace(/\.(jpg|png)$/,'');
  if(m.type==='photo'){const local=files.find(f=>f.startsWith(id+'-')&&f.includes(base));if(local){const dest=path.join('media',local);if(!fs.existsSync(dest)){fs.copyFileSync(path.join(mediaDir,local),dest);copied++;}out.push({t:'photo',src:'media/'+local});}else out.push({t:'photo',src:m.media_url_https});}
  else{const vid=files.find(f=>f.startsWith(id+'-')&&/\.mp4$/.test(f));if(vid){const dest=path.join('media',vid);if(!fs.existsSync(dest)){fs.copyFileSync(path.join(mediaDir,vid),dest);copied++;}out.push({t:'video',src:'media/'+vid,poster:m.media_url_https});}else out.push({t:'video',src:m.media_url_https,poster:m.media_url_https});}}
 return out;}
for(const id of ids){const t=byId.get(id);if(!t){if(FX[id])prev[id]=FX[id];else missing.push(id);continue;}
 const p={text:clean(t.full_text),date:new Date(t.created_at).toISOString().slice(0,10),likes:+t.favorite_count};
 const out=mediaOf(t,id);if(out.length)p.media=out;
 const th=[];let q=[id];while(q.length){const n=[];for(const pid of q)for(const k of (kids.get(pid)||[])){th.push(k);n.push(k.id_str);}q=n;}
 if(th.length)p.thread=th.sort((a,b)=>a.id_str.localeCompare(b.id_str)).map(k=>{const o={text:clean(k.full_text)};const mm=mediaOf(k,k.id_str);if(mm.length)o.media=mm;return {...o,...overrides[k.id_str]};});
 if(FX[id]&&(!p.text||/…$/.test(p.text)||FX[id].article)){p.text=clean(FX[id].text||p.text);if(FX[id].media&&FX[id].media.length)p.media=FX[id].media;}
 prev[id]={...p,...overrides[id]};}
fs.writeFileSync(outPath,'window.PREVIEWS='+JSON.stringify(prev)+';\n');
console.log('previews',Object.keys(prev).length,'copied',copied,'missing (newer than export)',missing);
