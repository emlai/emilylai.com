import { readFile, writeFile, mkdir } from 'node:fs/promises';

const source = 'content/articles/2096694660421104069.json';
const output = 'website-build/index.html';
const article = JSON.parse(await readFile(source, 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const body = article.html.replaceAll('src="media/', 'src="../media/');
const title = escape(article.title);
const description = 'How I used Astra, Fable, Grok, Codex, and 180+ prompts to design and build my personal website—and what I learned.';
const cover = `../${article.cover}`;

const html = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Emily Lai</title>
<meta name="description" content="${escape(description)}">
<link rel="canonical" href="https://emilylai.com/website-build/">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="https://emilylai.com/website-build/">
<meta property="og:image" content="https://emilylai.com/${escape(article.cover)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@emilylai">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${escape(description)}">
<meta name="twitter:image" content="https://emilylai.com/${escape(article.cover)}">
<link rel="icon" href="../assets/favicons/favicon-el.svg" type="image/svg+xml">
<script>(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='dark')?'dark':'light'}catch(e){}})();</script>
<style>
:root{--bg:#fff;--ink:#161616;--text:#2a2a2a;--gray:#666;--hair:#d6d6d6;--serif:"Times New Roman",Times,serif;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color-scheme:light}
html[data-theme="dark"]{--bg:#171717;--ink:#f2f2f2;--text:#d9d9d9;--gray:#a0a0a0;--hair:#343434;color-scheme:dark}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font:18px/1.65 var(--serif);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration-color:var(--hair);text-decoration-thickness:1px;text-underline-offset:.16em}a:hover{text-decoration-color:currentColor}
::selection{background:var(--ink);color:var(--bg)}:focus-visible{outline:1.5px solid var(--ink);outline-offset:4px}
.top{max-width:1180px;margin:auto;padding:28px 40px;display:flex;align-items:center;justify-content:space-between;font:14px/1.3 var(--sans)}
.home{text-decoration:none;font-size:18px;font-weight:600;color:var(--ink)}.back{text-decoration:none;color:var(--gray)}.back:hover{color:var(--ink)}
.hero{max-width:1180px;margin:34px auto 72px;padding:0 40px;display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,1.1fr);gap:64px;align-items:center}
.eyebrow{margin:0 0 20px;color:var(--gray);font:13px/1.3 var(--sans);letter-spacing:.06em;text-transform:uppercase}
h1{margin:0;color:var(--ink);font:600 clamp(38px,5.2vw,70px)/1.02 var(--sans);letter-spacing:-.045em;text-wrap:balance}
.dek{max-width:620px;margin:24px 0 0;font-size:21px;line-height:1.45;color:var(--gray);text-wrap:pretty}
.hero img{display:block;width:100%;height:auto;border:1px solid var(--hair)}
.article{width:min(720px,calc(100% - 48px));margin:0 auto 120px}.article>p:first-child{font-size:25px;line-height:1.45;color:var(--ink)}
.article p{white-space:pre-line;margin:0 0 1.45em}.article ul{margin:0 0 2em;padding-left:1.2em}.article li+li{margin-top:.5em}
.article h3{margin:3.5em 0 1em;color:var(--ink);font:600 30px/1.15 var(--sans);letter-spacing:-.025em;text-wrap:balance}
.article h4{margin:3em 0 1em;color:var(--ink);font:600 22px/1.25 var(--sans);letter-spacing:-.015em}.article h4 strong{font-weight:inherit}
figure{margin:2.5em 0 3em}figure img{display:block;width:100%;height:auto;border:1px solid var(--hair);background:#fff}figcaption{margin-top:10px;color:var(--gray);font:13px/1.45 var(--sans)}
.source{margin-top:72px;padding-top:24px;border-top:1px solid var(--hair);color:var(--gray);font:14px/1.5 var(--sans)}
@media(max-width:800px){body{font-size:17px}.top{padding:22px 20px}.hero{margin:20px auto 52px;padding:0 20px;grid-template-columns:1fr;gap:34px}.hero img{order:-1}h1{font-size:clamp(36px,11vw,52px)}.dek{font-size:19px}.article{width:min(100% - 40px,720px);margin-bottom:80px}.article>p:first-child{font-size:22px}.article h3{font-size:27px}.article h4{font-size:21px}figure{margin:2em -4px 2.5em}}
</style>
</head>
<body>
<header class="top"><a class="home" href="../">Emily Lai</a><a class="back" href="../">← Back to the desk</a></header>
<main>
<section class="hero">
  <div><p class="eyebrow">Field notes · Website build</p><h1>${title}</h1><p class="dek">${escape(description)}</p></div>
  <img src="${cover}" alt="Collage from the personal website build process" width="1600" height="900" fetchpriority="high">
</section>
<article class="article">${body}<p class="source">Originally published on <a href="https://x.com/emilylai/status/2096694660421104069" target="_blank" rel="noopener">X</a>.</p></article>
</main>
</body>
</html>`;

await mkdir('website-build', { recursive: true });
await writeFile(output, html);
