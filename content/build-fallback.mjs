// Keeps the no-JavaScript index in sync with the published folder data.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

export function fallbackHTML(buckets){
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const link=(url,label)=>'<a href="'+esc(url)+'">'+esc(label)+'</a>';
 return '<noscript><div class="fallback">\n'+buckets.filter(b=>!b.egg).map(b=>'<details><summary>'+esc(b.name)+'</summary>\n'+b.items.map(it=>{
  if(Array.isArray(it))return '<p><small>'+esc(it[0])+'</small><br>'+(it[2]?link(it[2],it[1]):esc(it[1]))+'</p>';
  const desc=(it.desc||[]).map(s=>'<p>'+esc(s.replace(/^(## |&gt; |> |- )/,'' )).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2">$1</a>')+'</p>').join('');
  const sources=[...(it.posts||[]).map((u,i)=>link(u,'Post '+(i+1))),...(it.series||[]).map(s=>link(s.kind==='yt'?'https://youtu.be/'+s.id:s.url,s.title)),...(it.link?[link(it.link,'Visit website')]:[])];
  return '<article><h3>'+esc(String(it.label).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'$1'))+'</h3><small>'+esc(it.y)+'</small>'+desc+(sources.length?'<p>'+sources.join(' · ')+'</p>':'')+'</article>';
 }).join('\n')+'\n</details>').join('\n')+'\n</div></noscript>';
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const source=fs.readFileSync('content.js','utf8');
 const buckets=JSON.parse(source.slice('window.BUCKETS='.length,source.indexOf(';\n')));
 const page=fs.readFileSync('index.html','utf8');
 const updated=page.replace(/<!-- fallback:start -->[\s\S]*?<!-- fallback:end -->/,'<!-- fallback:start -->\n'+fallbackHTML(buckets)+'\n<!-- fallback:end -->');
 if(updated===page)console.log('Fallback already current.');
 else{fs.writeFileSync('index.html',updated);console.log('Updated no-JavaScript folder index.');}
}
