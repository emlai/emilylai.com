// Fetches posts that are newer than the X archive export through the public fxtwitter API and caches them in
// content/fetched.json (media downloaded into media/). Usage: node content/fetch-missing.mjs <id> [id...]
import fs from 'node:fs';
const cachePath='content/fetched.json';const cache=fs.existsSync(cachePath)?JSON.parse(fs.readFileSync(cachePath,'utf8')):{};
const dash=s=>s.replace(/(^|\n)\s*[—–]\s*/g,'$1- ').replace(/\s*[—–]\s*/g,', ');
async function grab(url,dest){if(fs.existsSync(dest))return;const r=await fetch(url);if(!r.ok)throw new Error(r.status+' '+url);fs.writeFileSync(dest,Buffer.from(await r.arrayBuffer()));}
const textOnly=process.argv.includes('--text-only');
for(const id of process.argv.slice(2).filter(a=>/^\d+$/.test(a))){if(cache[id]){console.log(id,'cached');continue;}
 const r=await fetch('https://api.fxtwitter.com/i/status/'+id);if(!r.ok){console.log(id,'HTTP',r.status);continue;}
 const j=await r.json();const t=j.tweet;if(!t){console.log(id,'no tweet');continue;}
 const p={text:dash(t.text.replace(/https:\/\/t\.co\/\w+/g,'').trim()),date:new Date(t.created_at).toISOString().slice(0,10),likes:+t.likes||0,author:t.author&&t.author.screen_name};
 const media=[];let n=0;
 if(!textOnly)for(const ph of (t.media&&t.media.photos)||[]){const f='media/'+id+'-fx'+(++n)+'.jpg';await grab(ph.url,f);media.push({t:'photo',src:f});}
 if(!textOnly)for(const v of (t.media&&t.media.videos)||[]){const f='media/'+id+'-fx'+(++n)+'.mp4',po='media/'+id+'-fx'+n+'-poster.jpg';await grab(v.url,f);if(v.thumbnail_url)await grab(v.thumbnail_url,po);media.push({t:'video',src:f,poster:fs.existsSync(po)?po:''});}
 if(textOnly)p.textOnly=true;
 if(t.article){p.article=(t.article.title||'').trim();if(fs.existsSync('content/articles/'+id+'.json'))p.articleFile='content/articles/'+id+'.json';if(!p.text||/^https?:\/\/\S+$/.test(p.text))p.text=[p.article,t.article.preview_text||''].filter(Boolean).join('\n\n');if(t.article.cover_media&&t.article.cover_media.media_info&&t.article.cover_media.media_info.original_img_url){const f='media/'+id+'-cover.jpg';await grab(t.article.cover_media.media_info.original_img_url,f);media.push({t:'photo',src:f});}}
 if(media.length)p.media=media;cache[id]=p;console.log(id,'ok',p.date,media.length+' media',p.text.slice(0,60).replace(/\n/g,' '));}
fs.writeFileSync(cachePath,JSON.stringify(cache,null,1));
