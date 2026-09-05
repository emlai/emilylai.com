// Rebuilds content.js from content/content.csv (the export of the Google Sheet).
// Usage: node content/build-content.mjs [in.csv] [out.js]
import fs from 'node:fs';
const [,, inPath='content/content.csv', outPath='content/content.js']=process.argv;
const text=fs.readFileSync(inPath,'utf8');
function parseCSV(s){const rows=[];let row=[],cell='',q=false;for(let i=0;i<s.length;i++){const ch=s[i];if(q){if(ch==='"'){if(s[i+1]==='"'){cell+='"';i++;}else q=false;}else cell+=ch;}else if(ch==='"')q=true;else if(ch===','){row.push(cell);cell='';}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&s[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';}else cell+=ch;}if(cell||row.length){row.push(cell);rows.push(row);}return rows;}
const rows=parseCSV(text).filter(r=>r.length>1);
const [header,...data]=rows;
const ids={'work':'work','growth experiments':'growth','lab experiments':'lab','learning':'learn','speaking':'talks','side projects':'side','field notes':'notes'};
const EGG={'field notes':true};
const DISPLAY={'field notes':'field notes (unlocked)'};
const buckets={};
for(const r of data){const [bucket,order,dates,title,type,urls,bullets,series,status,notes]=r;if(!ids[bucket])continue;if((status||'').trim()==='cut')continue;
 const b=buckets[bucket]||(buckets[bucket]={id:ids[bucket],name:bucket,items:[]});
 const cuts={},solo={},embeds=[],images=[];const urlList=(urls||'').split(/\n/).map(s=>s.trim()).filter(Boolean).map(line=>{const so=line.match(/^(\S+)\s*\|\s*text only$/i);if(so){const id=(so[1].match(/status\/(\d+)/)||[])[1];if(id)solo[id]=true;return so[1];}
  const m=line.match(/^(\S+)\s*\|\s*ends? after:\s*(.+)$/i);if(m){const id=(m[1].match(/status\/(\d+)/)||[])[1];if(id)cuts[id]=m[2].trim();return m[1];}
  const e=line.match(/^(https:\/\/www\.linkedin\.com\/embed\/\S+)(?:\s*\|\s*height:\s*(\d+))?$/i);if(e){embeds.push({src:e[1],h:+(e[2]||600)});return '';}
  if(/\.(png|jpe?g|webp|gif)$/i.test(line)&&!/^https?:/.test(line)){images.push(line);return '';}return line;}).filter(Boolean);
 if(type==='post'||type==='video'||type==='fact'){b.items.push({o:+order,v:[dates,title,urlList[0]||'']});continue;}
 const it={y:dates,label:title};
 const desc=(bullets||'').split(/\n/).map(s=>s.trim()).filter(Boolean);if(desc.length)it.desc=desc;
 const posts=urlList.filter(u=>/x\.com\/.*\/status\//.test(u));const link=urlList.find(u=>!/x\.com/.test(u)&&!/youtu/.test(u));
 if(posts.length)it.posts=posts;if(link)it.link=link;
 const ser=(series||'').split(/\n/).map(s=>s.trim()).filter(Boolean).map(line=>{const [t,u]=line.split('|').map(x=>x.trim());const yt=u&&u.match(/youtu\.be\/([\w-]+)|v=([\w-]+)/);return yt?{kind:'yt',id:yt[1]||yt[2],title:t}:{kind:'x',url:u,title:t};});
 if(ser.length)it.series=ser;
 if(/first line only/i.test(notes||''))it.safe=true;
 const cover=(notes||'').match(/(?:^|\n)cover:\s*(\S+)\s*\|\s*([^\n]+)/);
 if(cover)it.cover={src:cover[1],alt:cover[2].trim()};
 if(/year sections/i.test(notes||''))it.yearSections=true;
 if(/posts before embeds/i.test(notes||''))it.postsFirst=true;
 if(/hide reader title/i.test(notes||''))it.hideTitle=true;
 const deck=(notes||'').match(/(?:^|\n)deck:\s*(\S+)/);
 if(deck)it.deck=JSON.parse(fs.readFileSync(deck[1],'utf8'));
 if(Object.keys(cuts).length)it.cuts=cuts;
 if(Object.keys(solo).length)it.solo=solo;
 if(embeds.length)it.embeds=embeds;
 if(images.length)it.images=images;
 if(type==='stack')it.stack=true;
 b.items.push({o:+order,v:it});}
const order=['work','growth experiments','lab experiments','learning','speaking','side projects','field notes'];
const out=order.filter(n=>buckets[n]).map(n=>({id:buckets[n].id,name:DISPLAY[n]||n,...(EGG[n]?{egg:true}:{}),items:buckets[n].items.sort((a,b)=>a.o-b.o).map(x=>x.v)}));
fs.writeFileSync(outPath,'window.BUCKETS='+JSON.stringify(out)+';\n'+"window.renderList=function(b){return '<ul>'+b.items.map(([y,t,u])=>'<li><span class=\"d\">'+y+'</span><span>'+(u?'<a href=\"'+u+'\">'+t+'</a>':t)+'</span></li>').join('')+'</ul>'};\n");
console.log('wrote',outPath,out.map(b=>b.name+':'+b.items.length).join(', '));
if(fs.existsSync('content/media-manifest.json'))fs.appendFileSync(outPath,'window.MEDIA='+JSON.stringify(JSON.parse(fs.readFileSync('content/media-manifest.json','utf8')))+';\n');
