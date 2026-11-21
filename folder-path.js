globalThis.folderPath=function(folder,entry){
 const slug=text=>text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const section=slug(folder.name);
 if(!entry)return section;
 const label=Array.isArray(entry)?entry[1]:entry.label;
 const title=label.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'$1');
 return section+'/'+(entry.slug||slug(title));
};
