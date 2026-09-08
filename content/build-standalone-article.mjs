import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const source = 'content/articles/website-build.json';
const output = 'website-build/index.html';
const article = JSON.parse(await readFile(source, 'utf8'));
const toggleVersion = createHash('sha256')
  .update(await readFile('silver-toggle/silver-toggle.min.js'))
  .digest('hex')
  .slice(0, 12);
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
let body = article.html
  .replaceAll('src="media/', 'src="../media/')
  .replaceAll('poster="media/', 'poster="../media/');
const title = escape(article.title);
const description = 'How I used Astra, Fable, Grok, Codex, and 180+ prompts to design and build my personal website—and what I learned.';
const cover = `../${article.cover}`;
const mediaPath = path => `../${String(path).replace(/^\//, '')}`;
const videoFigure = ({ src, poster, caption, portrait = false }) => `<figure class="video${portrait ? ' video-portrait' : ''}"><video controls playsinline preload="none" poster="${escape(mediaPath(poster))}"><source src="${escape(mediaPath(src))}" type="video/mp4"></video><figcaption>${escape(caption)}</figcaption></figure>`;
let updates = String(article.updatesHtml || '')
  .replaceAll('src="media/', 'src="../media/')
  .replaceAll('poster="media/', 'poster="../media/');
if (article.updatesImage) {
  const updateImage = `<figure><img src="${escape(mediaPath(article.updatesImage))}" alt="${escape(article.updatesImageAlt)}" loading="lazy" decoding="async" width="1254" height="1254"><figcaption>${escape(article.updatesImageCaption)}</figcaption></figure>`;
  updates = updates.replace('<h4>September 8th, 2026</h4>', `${updateImage}<h4>September 8th, 2026</h4>`);
}

const introSentence = '<p>I spent the last 3 days playing with the latest frontier models to build my personal website.</p>';
body = body.replace(introSentence, `${introSentence}${videoFigure({src:article.introVideo,poster:article.introPoster,caption:'A walkthrough of the new emilylai.com.'})}`);
const firstToggleRender = /(<figure><img[^>]+article-2096694660421104069-15\.jpg[\s\S]*?<\/figure>)/;
body = body.replace(firstToggleRender, `$1${videoFigure({src:article.toggleVideo,poster:article.togglePoster,caption:'Testing the first steel toggle render.'})}`);
body = body.replace('Then we worked on the sound.</p>', `Then we worked on the sound.</p>${videoFigure({src:article.soundsVideo,poster:article.soundsPoster,caption:'Comparing the full set of toggle sounds.'})}`);
const grokSentence = '<p>I also tried Grok 4.6 in the Aside browser to paste the draft and assets in the X composer for me. This is a 5 minute video sped up to 10 seconds. It made strange messages to test it could type.</p>';
body = body.replace(grokSentence, `${grokSentence}${videoFigure({src:article.grokVideo,poster:article.grokPoster,caption:'Five minutes of browser control, sped up to ten seconds.',portrait:true})}`);

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
:root{--bg:#fff;--ink:#161616;--text:#2a2a2a;--gray:#666;--hair:#d6d6d6;--serif:"Times New Roman",Times,serif;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;--steel-toggle-light:url("../silver-toggle/toggle-light.png");--steel-toggle-dark:url("../silver-toggle/toggle-dark.png");color-scheme:light}
html[data-theme="dark"]{--bg:#171717;--ink:#f2f2f2;--text:#d9d9d9;--gray:#a0a0a0;--hair:#343434;color-scheme:dark}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:84px}body{margin:0;background:var(--bg);color:var(--text);font:18px/1.65 var(--serif);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration-color:var(--hair);text-decoration-thickness:1px;text-underline-offset:.16em}a:hover{text-decoration-color:currentColor}
::selection{background:var(--ink);color:var(--bg)}:focus-visible{outline:1.5px solid var(--ink);outline-offset:4px}
.top{position:sticky;top:0;z-index:20;margin:0;padding:14px max(40px,calc((100vw - 1180px)/2 + 40px));display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--hair);background:color-mix(in srgb,var(--bg) 92%,transparent);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);font:14px/1.3 var(--sans)}
.brand-tools{display:flex;align-items:center;gap:16px;min-width:0}
.home{text-decoration:none;font-size:18px;font-weight:600;color:var(--ink)}.back{text-decoration:none;color:var(--gray)}.back:hover{color:var(--ink)}
.mode{box-sizing:border-box;display:inline-flex;position:relative;flex:none;width:84px;height:44px;padding:0;gap:0;border:0;border-radius:5px;background:transparent}
.mode::before{content:"";position:absolute;inset:0;width:100%;height:100%;background:var(--steel-toggle-light) center/100% 100% no-repeat;pointer-events:none}
html[data-theme="dark"] .mode::before{background-image:var(--steel-toggle-dark)}
.mode button{box-sizing:border-box;width:42px;height:44px;padding:0;border:0;border-radius:4px;background:transparent;cursor:pointer;z-index:1}
.mode button svg{display:none}.mode button:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
silver-toggle{display:inline-block;flex:none;width:84px;height:44px}
.hero{max-width:1180px;margin:34px auto 64px;padding:0 40px;display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,1.1fr);gap:64px;align-items:center}
.eyebrow{margin:0 0 20px;color:var(--gray);font:13px/1.3 var(--sans);letter-spacing:.06em;text-transform:uppercase}
h1{margin:0;color:var(--ink);font:600 clamp(38px,5.2vw,70px)/1.02 var(--sans);letter-spacing:-.045em;text-wrap:balance}
.date{margin:20px 0 0;color:var(--gray);font:14px/1.4 var(--sans)}
.hero img{display:block;width:100%;height:auto;border:1px solid var(--hair)}
.article{width:min(720px,calc(100% - 48px));margin:0 auto 120px}
.article p{white-space:pre-line;margin:0 0 1.5em}.article ul{margin:0 0 1.75em;padding-left:1.2em}.article li+li{margin-top:.45em}.article ul+h3{margin-top:2.15em}
.article h3{margin:3.2em 0 1em;color:var(--ink);font:600 30px/1.15 var(--sans);letter-spacing:-.025em;text-wrap:balance}
.article h4{margin:2.8em 0 1em;color:var(--ink);font:600 22px/1.25 var(--sans);letter-spacing:-.015em}.article h4 strong{font-weight:inherit}
.article h5{margin:2em 0 .75em;color:var(--ink);font:600 14px/1.3 var(--sans);text-transform:uppercase;letter-spacing:.05em}
.prompt{margin:0 0 2.25em;padding:20px 22px;overflow:auto;border:1px solid var(--hair);background:color-mix(in srgb,var(--bg) 94%,var(--ink));color:var(--text);font:14px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere}
figure{margin:2.4em 0 2.8em}figure img,figure video{display:block;width:100%;height:auto;border:1px solid var(--hair);background:#fff}figcaption{margin-top:10px;color:var(--gray);font:13px/1.45 var(--sans)}
.video video{max-height:78vh;object-fit:contain;background:#111}.video-portrait video{width:min(520px,100%);margin-inline:auto}
.reflection,.reflection-label{font-family:var(--sans);line-height:1.5;color:var(--ink)}
.updates{margin-top:84px;padding-top:24px;border-top:1px solid var(--hair)}.updates>h3{margin-top:0}.updates h4{margin-top:2.5em}.updates figure{margin-top:2.1em}
.source{margin-top:72px;padding-top:24px;border-top:1px solid var(--hair);color:var(--gray);font:14px/1.5 var(--sans)}
@media(max-width:800px){body{font-size:17px}.top{padding:10px 20px;gap:12px}.brand-tools{gap:10px}.back{max-width:116px;text-align:right}.hero{margin:20px auto 48px;padding:0 20px;grid-template-columns:1fr;gap:34px}.hero img{order:-1}h1{font-size:clamp(36px,11vw,52px)}.article{width:min(100% - 40px,720px);margin-bottom:80px}.article h3{font-size:27px}.article h4{font-size:21px}figure{margin:2em -4px 2.5em}.prompt{margin-inline:-4px;padding:17px 16px;font-size:13px}}
@media(max-width:360px){.home{font-size:16px}.brand-tools{gap:8px}.back{max-width:100px;font-size:12px}}
</style>
</head>
<body>
<header class="top"><div class="brand-tools"><a class="home" href="../">Emily Lai</a><div class="mode" role="group" aria-label="Color scheme"><button type="button" data-mode="light" aria-pressed="true" aria-label="Light mode" title="Light mode"><svg aria-hidden="true"><use href="../assets/icons.svg#sun"></use></svg></button><button type="button" data-mode="dark" aria-pressed="false" aria-label="Dark mode" title="Dark mode"><svg aria-hidden="true"><use href="../assets/icons.svg#moon"></use></svg></button></div></div><a class="back" href="../">← Back to emilylai.com</a></header>
<main>
<section class="hero">
  <div><p class="eyebrow">Writing</p><h1>${title}</h1><p class="date">${escape(article.date)}</p></div>
  <img src="${cover}" alt="Collage from the personal website build process" width="1600" height="900" fetchpriority="high">
</section>
<article class="article">${body}<section class="updates" aria-labelledby="updates-title"><h3 id="updates-title">Updates</h3>${updates}</section><div class="source"><p>Originally published on <a href="https://x.com/emilylai/status/2096694660421104069" target="_blank" rel="noopener">X</a>.</p><a href="../">← Go back to emilylai.com</a></div></article>
</main>
<script>
(() => {
  const mode = document.querySelector('.mode');
  const paint = () => mode?.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === button.dataset.mode)));
  mode?.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    document.documentElement.dataset.theme = button.dataset.mode;
    try { localStorage.setItem('theme', button.dataset.mode); } catch (error) {}
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
for (const event of ['pointerover', 'focusin', 'touchstart']) {
  mode?.addEventListener(event, loadToggle, {once: true, passive: true});
}
</script>
</body>
</html>`;

await mkdir('website-build', { recursive: true });
await writeFile(output, html);
