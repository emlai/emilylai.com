// Keep originals; serve smaller WebP variants with intrinsic image dimensions.
// Run after fetching new posts, before build-content.mjs. Requires cwebp and sips.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const sources=['content/content.csv','previews.js','content/dojo-slides.json'];
const paths=new Set(sources.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/media\/[\w./-]+\.(?:jpe?g|png|webp)/g)].map(m=>m[0])));
const manifest={};let before=0,after=0;
for(const src of paths){
 if(!fs.existsSync(src))throw new Error('Missing image: '+src);
 const info=execFileSync('sips',['-g','pixelWidth','-g','pixelHeight',src],{encoding:'utf8'});
 const width=+info.match(/pixelWidth: (\d+)/)[1],height=+info.match(/pixelHeight: (\d+)/)[1];
 let dest=src,w=width,h=height;
 if(!src.endsWith('.webp')){
  const candidate=src.replace(/\.(?:jpe?g|png)$/,'-optimized.webp');
  if(!fs.existsSync(candidate)||fs.statSync(candidate).mtimeMs<fs.statSync(src).mtimeMs)execFileSync('cwebp',['-quiet','-q','84',src,'-o',candidate]);
  if(fs.statSync(candidate).size<fs.statSync(src).size)dest=candidate;
 }
 before+=fs.statSync(src).size;after+=fs.statSync(dest).size;
 manifest[src]={src:dest,w,h};
}
fs.writeFileSync('content/media-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({images:paths.size,originalBytes:before,servedBytes:after,savedPercent:Math.round((1-after/before)*100)}));
