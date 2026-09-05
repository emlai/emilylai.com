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
const buckets={};
for(const r of data){const [bucket,order,dates,title,type,urls,bullets,series,status,notes]=r;if(!ids[bucket])continue;if((status||'').trim()==='cut')continue;
 const b=buckets[bucket]||(buckets[bucket]={id:ids[bucket],name:bucket,items:[]});
 const cuts={},embeds=[],images=[];const urlList=(urls||'').split(/\n/).map(s=>s.trim()).filter(Boolean).map(line=>{const m=line.match(/^(\S+)\s*\|\s*ends? after:\s*(.+)$/i);if(m){const id=(m[1].match(/status\/(\d+)/)||[])[1];if(id)cuts[id]=m[2].trim();return m[1];}
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
 if(Object.keys(cuts).length)it.cuts=cuts;
 if(embeds.length)it.embeds=embeds;
 if(images.length)it.images=images;
 if(type==='stack')it.stack=true;
 b.items.push({o:+order,v:it});}
const order=['work','growth experiments','lab experiments','learning','speaking','side projects','field notes'];
const out=order.filter(n=>buckets[n]).map(n=>({id:buckets[n].id,name:n,...(EGG[n]?{egg:true}:{}),items:buckets[n].items.sort((a,b)=>a.o-b.o).map(x=>x.v)}));
fs.writeFileSync(outPath,'window.BUCKETS='+JSON.stringify(out)+';\n'+"window.renderList=function(b){return '<ul>'+b.items.map(([y,t,u])=>'<li><span class=\"d\">'+y+'</span><span>'+(u?'<a href=\"'+u+'\">'+t+'</a>':t)+'</span></li>').join('')+'</ul>'};\n");
console.log('wrote',outPath,out.map(b=>b.name+':'+b.items.length).join(', '));
