/* Shared by the browser and content scripts. IDs retain same-day post order. */
globalThis.socialTimestamp=function(url,fallback=''){
 const x=String(url).match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/);
 const li=String(url).match(/linkedin\.com\/.*(?:activity:|share:|ugcPost:|activity-)(\d+)/);
 try{
  if(x)return Number((BigInt(x[1])>>22n)+1288834974657n);
  if(li)return Number(BigInt(li[1])>>22n);
 }catch{}
 return Date.parse(fallback)||0;
};
