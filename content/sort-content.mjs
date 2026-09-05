// Sorts every bucket except work newest first (posts by real post date, roles and notes by their latest post or year)
// and renumbers the order column. Usage: node content/sort-content.mjs
import fs from 'node:fs';
function parseCSV(s){const rows=[];let row=[],cell='',q=false;for(let i=0;i<s.length;i++){const ch=s[i];if(q){if(ch==='"'){if(s[i+1]==='"'){cell+='"';i++;}else q=false;}else cell+=ch;}else if(ch==='"')q=true;else if(ch===','){row.push(cell);cell='';}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&s[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';}else cell+=ch;}if(cell||row.length){row.push(cell);rows.push(row);}return rows;}
const rows=parseCSV(fs.readFileSync('content/content.csv','utf8'));const H=rows[0];const R=rows.slice(1).filter(r=>r.length>1);
const w={};new Function('window',fs.readFileSync('previews.js','utf8')+'return window;')(w);const PV=w.PREVIEWS;
const key=r=>{const o=(String(r[9]||'').match(/sort:\s*(\d{4}-\d{2}-\d{2})/)||[])[1];if(o)return o;const ids=[...String(r[5]).matchAll(/status\/(\d+)/g)].map(m=>m[1]);const ds=ids.map(i=>(PV[i]||{}).date).filter(Boolean).sort();if(ds.length)return ds[ds.length-1];const y=String(r[2]).match(/\d{4}/g)||['0000'];return y[y.length-1]+'-12-31';};
const buckets=[...new Set(R.map(r=>r[0]))];let fin=[];
for(const b of buckets){let rs=R.filter(r=>r[0]===b);if(b!=='work')rs.sort((a,c)=>key(c).localeCompare(key(a)));rs.forEach((r,i)=>r[1]=String(i+1));fin=fin.concat(rs);}
const q=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"';fs.writeFileSync('content/content.csv',[H,...fin].map(r=>r.map(q).join(',')).join('\n')+'\n');
for(const b of buckets)console.log(b+':',fin.filter(r=>r[0]===b).map(r=>r[3].slice(0,22)).join(' / '));
