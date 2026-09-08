import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = 'content/articles/peptides.json';
const output = 'peptides/index.html';
const article = JSON.parse(await readFile(source, 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const toggleVersion = createHash('sha256')
  .update(await readFile('silver-toggle/silver-toggle.min.js'))
  .digest('hex')
  .slice(0, 12);
const body = article.html
  .replace('UPDATE: NOT MEDICAL ADVICE', escape(article.podcastNavLabel))
  .replace('>ORIGINAL POSTS<', `>${escape(article.originalsLabel)}<`)
  .replaceAll('src="media/', 'src="../media/')
  .replaceAll('poster="media/', 'poster="../media/');

const html = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#ffffff">
<title>${escape(article.title)} | Emily Lai</title>
<meta name="description" content="${escape(article.description)}">
<link rel="canonical" href="https://emilylai.com/peptides/">
<meta property="og:type" content="article">
<meta property="og:title" content="${escape(article.title)}">
<meta property="og:description" content="${escape(article.description)}">
<meta property="og:url" content="https://emilylai.com/peptides/">
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@emilylai">
<meta name="twitter:title" content="${escape(article.title)}">
<meta name="twitter:description" content="${escape(article.description)}">
<link rel="icon" href="../assets/favicons/favicon-el.svg" type="image/svg+xml">
<script>(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='dark')?'dark':'light';document.querySelector('meta[name="theme-color"]').content=t==='dark'?'#171717':'#ffffff'}catch(e){}})();</script>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  datePublished: '2026-01-03',
  dateModified: '2026-05-22',
  author: {'@type': 'Person', name: 'Emily Lai', url: 'https://emilylai.com/'},
  mainEntityOfPage: 'https://emilylai.com/peptides/'
}).replaceAll('<', '\\u003c')}</script>
<style>
:root{--bg:#fff;--ink:#161616;--text:#292929;--muted:#666;--hair:#d5d5d5;--panel:#f4f4f2;--alert:#f3ece9;--alert-border:#b5543d;--serif:"Times New Roman",Times,serif;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;--steel-toggle-light:url("../silver-toggle/toggle-light.png");--steel-toggle-dark:url("../silver-toggle/toggle-dark.png");color-scheme:light}
html[data-theme="dark"]{--bg:#171717;--ink:#f2f2f2;--text:#d9d9d9;--muted:#aaa;--hair:#383838;--panel:#202020;--alert:#29211f;--alert-border:#d07a63;color-scheme:dark}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:var(--bg);color:var(--text);font:18px/1.68 var(--serif);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration-color:var(--hair);text-decoration-thickness:1px;text-underline-offset:.17em}a:hover{text-decoration-color:currentColor}::selection{background:var(--ink);color:var(--bg)}:focus-visible{outline:2px solid var(--ink);outline-offset:4px}
.top{position:sticky;top:0;z-index:20;margin:0;padding:14px max(40px,calc((100vw - 1180px)/2 + 40px));display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--hair);background:color-mix(in srgb,var(--bg) 92%,transparent);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);font:14px/1.3 var(--sans)}
.brand-tools{display:flex;align-items:center;gap:16px;min-width:0}.home{text-decoration:none;font-size:18px;font-weight:600;color:var(--ink)}.back{text-decoration:none;color:var(--muted)}.back:hover{color:var(--ink)}
.mode{box-sizing:border-box;display:inline-flex;position:relative;flex:none;width:84px;height:44px;padding:0;gap:0;border:0;border-radius:5px;background:transparent}.mode::before{content:"";position:absolute;inset:0;background:var(--steel-toggle-light) center/100% 100% no-repeat;pointer-events:none}html[data-theme="dark"] .mode::before{background-image:var(--steel-toggle-dark)}.mode button{box-sizing:border-box;width:42px;height:44px;padding:0;border:0;border-radius:4px;background:transparent;cursor:pointer;z-index:1}.mode button svg{display:none}.mode button:focus-visible{outline:2px solid var(--ink);outline-offset:2px}silver-toggle{display:inline-block;flex:none;width:84px;height:44px}
.hero{max-width:1180px;margin:34px auto 64px;padding:0 40px}.eyebrow,.kicker,.chapter-number,.chapter-date{font-family:var(--sans);font-weight:650;letter-spacing:.075em;text-transform:uppercase}.eyebrow{margin:0 0 20px;color:var(--muted);font:13px/1.3 var(--sans);letter-spacing:.06em}.hero h1{max-width:1000px;margin:0;color:var(--ink);font:600 clamp(38px,5.2vw,70px)/1.02 var(--sans);letter-spacing:-.045em;text-wrap:balance}.subtitle{max-width:760px;margin:20px 0 0;color:var(--text);font:18px/1.45 var(--serif)}.updated{margin:10px 0 0;color:var(--muted);font:14px/1.4 var(--sans)}
.article{width:min(760px,calc(100% - 48px));margin:0 auto 120px}.article p{margin:0 0 1.45em}.article ul,.article ol{margin:0 0 1.75em;padding-left:1.25em}.article li+li{margin-top:.48em}.article h2{margin:0;color:var(--ink);font:700 clamp(34px,5vw,54px)/1.02 var(--sans);letter-spacing:-.04em;text-wrap:balance}.article h3{margin:2.8em 0 .85em;color:var(--ink);font:700 24px/1.15 var(--sans);letter-spacing:-.02em}.article h4{margin:0 0 .85em;color:var(--ink);font:700 16px/1.3 var(--sans);letter-spacing:.045em}.lede{color:var(--ink);font-size:23px;line-height:1.5}.kicker,.chapter-number,.chapter-date{font-size:12px;line-height:1.4}.chapter-number{margin:0 0 14px;color:var(--alert-border)}.chapter-date{margin:14px 0 38px;color:var(--muted)}
.disclaimer{margin:0 0 64px;padding:24px 26px;border:1px solid var(--alert-border);background:var(--alert);font:15px/1.55 var(--sans)}.disclaimer p:last-child{margin-bottom:0}.contents{margin:0 0 90px;padding:26px 0;border-block:1px solid var(--hair);font:14px/1.45 var(--sans)}.contents .kicker{margin-bottom:16px;color:var(--muted)}.contents ol{display:grid;grid-template-columns:1fr 1fr;gap:10px 32px;margin:0;padding:0;list-style-position:inside}.contents li+li{margin:0}.contents a{text-decoration:none}.contents a:hover{text-decoration:underline;text-underline-offset:4px}
.chapter{padding-top:10px;margin-bottom:120px}.chapter+.chapter{padding-top:78px;border-top:1px solid var(--hair)}.timeline-list strong{font:650 13px/1.4 var(--sans);letter-spacing:.04em}.note,.dose{font-family:var(--sans);font-size:14px;line-height:1.55}.note{margin:28px 0 42px!important;padding:18px 20px;background:var(--panel);border-left:3px solid var(--ink)}.log{margin:0 0 28px;padding:24px 25px;background:var(--panel);border-top:1px solid var(--hair)}.log p:last-child{margin-bottom:0}.dose{padding-top:14px;border-top:1px solid var(--hair);color:var(--muted)}
figure{margin:2.5em 0 3em}figure img,figure video{display:block;width:100%;height:auto;border:1px solid var(--hair);background:#fff}figcaption{margin-top:10px;color:var(--muted);font:13px/1.45 var(--sans)}.video video{max-height:78vh;object-fit:contain;background:#111}.portrait img{width:min(600px,100%);margin-inline:auto}.portrait figcaption{width:min(600px,100%);margin-inline:auto;margin-top:10px}
.routine{counter-reset:step;list-style:none;padding:0!important}.routine li{display:grid;grid-template-columns:34px 1fr;align-items:baseline;padding:12px 0;border-bottom:1px solid var(--hair)}.routine li::before{counter-increment:step;content:counter(step,decimal-leading-zero);color:var(--muted);font:12px/1 var(--sans)}.columns{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:40px 0}.columns>div{padding:22px;background:var(--panel)}.columns ul{margin-bottom:0}
.table-wrap{overflow-x:auto;margin:24px 0 42px}table{width:100%;border-collapse:collapse;font:15px/1.4 var(--sans)}th,td{padding:13px 12px;border-bottom:1px solid var(--hair);text-align:left}th{color:var(--muted);font-size:11px;letter-spacing:.06em}th:last-child,td:last-child{text-align:right;white-space:nowrap}
.source-note{margin:0 0 60px;padding:26px;background:var(--panel);font:15px/1.55 var(--sans)}.source-note .kicker,.originals .kicker{color:var(--muted)}.source-note p:last-child{margin-bottom:0}.small{font-size:13px;color:var(--muted)}.originals{padding-top:26px;border-top:1px solid var(--hair);font:14px/1.5 var(--sans)}.originals ul{display:flex;flex-wrap:wrap;gap:10px 24px;padding:0;list-style:none}.originals li+li{margin:0}.footer-back{display:inline-block;margin-top:34px;color:var(--muted);font:14px/1.4 var(--sans);text-decoration:none}.footer-back:hover{color:var(--ink)}
@media(max-width:800px){body{font-size:17px}.top{padding:10px 20px;gap:12px}.brand-tools{gap:10px}.back{max-width:116px;text-align:right}.hero{margin:20px auto 48px;padding:0 20px}.hero h1{font-size:clamp(36px,11vw,52px)}.subtitle{font-size:17px}.article{width:min(100% - 40px,760px);margin-bottom:80px}.contents ol{grid-template-columns:1fr}.chapter{margin-bottom:90px}.chapter+.chapter{padding-top:58px}.article h2{font-size:36px}.article h3{font-size:22px}.lede{font-size:21px}.columns{grid-template-columns:1fr}.disclaimer,.source-note{margin-inline:-4px;padding:21px 20px}.log{margin-inline:-4px;padding:21px 20px}figure{margin:2.2em -4px 2.7em}}
@media(max-width:360px){.home{font-size:16px}.brand-tools{gap:8px}.back{max-width:100px;font-size:12px}}
</style>
</head>
<body>
<header class="top"><div class="brand-tools"><a class="home" href="../">Emily Lai</a><div class="mode" role="group" aria-label="Color scheme"><button type="button" data-mode="light" aria-pressed="true" aria-label="Light mode" title="Light mode"><svg aria-hidden="true"><use href="../assets/icons.svg#sun"></use></svg></button><button type="button" data-mode="dark" aria-pressed="false" aria-label="Dark mode" title="Dark mode"><svg aria-hidden="true"><use href="../assets/icons.svg#moon"></use></svg></button></div></div><a class="back" href="../">← Back to emilylai.com</a></header>
<main>
<header class="hero"><p class="eyebrow">Writing</p><h1>${escape(article.title)}</h1><p class="subtitle">${escape(article.subtitle)}</p><p class="updated">${escape(article.updated)}</p></header>
<article class="article">${body}<a class="footer-back" href="../">← Go back to emilylai.com</a></article>
</main>
<script>
(() => {
  const mode = document.querySelector('.mode');
  const paint = () => mode?.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === button.dataset.mode)));
  mode?.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    document.documentElement.dataset.theme = button.dataset.mode;
    try { localStorage.setItem('theme', button.dataset.mode); } catch (error) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = button.dataset.mode === 'dark' ? '#171717' : '#ffffff';
    paint();
  }));
  paint();
})();
</script>
<script type="module">
const mode = document.querySelector('.mode');
let loadingToggle;
const loadToggle = () => {
  if (loadingToggle || !mode?.isConnected) return;
  loadingToggle = import('../silver-toggle/silver-toggle.min.js?v=${toggleVersion}').then(({replaceThemeControl}) => {
    const toggle = replaceThemeControl('.mode');
    if (toggle) toggle.setAttribute('sound', 'weighted');
  }).catch(() => {});
};
for (const event of ['pointerover', 'focusin', 'touchstart']) mode?.addEventListener(event, loadToggle, {once:true,passive:true});
</script>
</body>
</html>`;

await mkdir('peptides', {recursive: true});
await writeFile(output, html);
