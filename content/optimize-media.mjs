// Keep originals; serve smaller WebP variants with intrinsic image dimensions.
// Run after fetching new posts, before build-content.mjs. Requires cwebp and sips.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const sources=['content/content.csv','previews.js','content/dojo-slides.json'];
const paths=new Set(sources.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/media\/[\w./-]+\.(?:jpe?g|png|webp)/g)].map(m=>m[0])));
const manifest={};let before=0,after=0;
const maxReaderWidth=2048;
function dimensions(src){
 const info=execFileSync('sips',['-g','pixelWidth','-g','pixelHeight',src],{encoding:'utf8'});
 return {w:+info.match(/pixelWidth: (\d+)/)[1],h:+info.match(/pixelHeight: (\d+)/)[1]};
}
for(const src of paths){
 if(!fs.existsSync(src))throw new Error('Missing image: '+src);
 let {w,h}=dimensions(src);
 let dest=src;
 if(!src.endsWith('.webp')){
  const candidate=src.replace(/\.(?:jpe?g|png)$/,'-optimized.webp');
  const resize=w>maxReaderWidth;
  if(!fs.existsSync(candidate)||fs.statSync(candidate).mtimeMs<fs.statSync(src).mtimeMs||(resize&&dimensions(candidate).w!==maxReaderWidth)){
   const args=resize?['-resize',String(maxReaderWidth),'0']:[];
   execFileSync('cwebp',['-quiet','-q','84',...args,src,'-o',candidate]);
  }
  if(fs.statSync(candidate).size<fs.statSync(src).size){
   dest=candidate;
   if(resize)({w,h}=dimensions(candidate));
  }
 }
 before+=fs.statSync(src).size;after+=fs.statSync(dest).size;
 manifest[src]={src:dest,w,h};
}
fs.writeFileSync('content/media-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({images:paths.size,originalBytes:before,servedBytes:after,savedPercent:Math.round((1-after/before)*100)}));
