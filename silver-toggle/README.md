# Silver theme toggle

A reusable Three.js web component for emilylai.com. Real geometry, brushed steel, beveled plate, horizontal screwdriver slots, a smoothly rolled collar with a black recessed bore, turned end caps, and 432 raised grip facets. The lever pivots left for light and right for dark. Three original synthesized clicks are available: Crisp snap, Heavy click (default), and Damped clunk. No reference audio was extracted or matched.

## Preview

The demo is available in the online preview shared with this package. Its enlarged toggle and header toggle stay synchronized, with buttons to audition all three sounds. The portable ZIP contains the component, vendor dependencies, docs, and installer. It excludes the demo `index.html` and `site-preview/`. The local preview uses symlinks and is not a portable deployment bundle.

## Install in emilylai.com

For the exact branch, install, commit, and push commands, see [GITHUB.md](GITHUB.md). `install.py` installs the component into a site folder and refuses to overwrite an existing installation.

For manual installation, copy `silver-toggle.js` and the complete `vendor/` folder into a new `silver-toggle/` folder at the site's root. Add this just before `</body>` in the site's index.html:

```html
<script type="module">
  import { replaceThemeControl } from './silver-toggle/silver-toggle.js';
  replaceThemeControl('.mode');
</script>
```

The helper replaces the existing pair of mode buttons. It updates the site's existing `html[data-theme]`, `localStorage.theme`, and theme-color meta tag. Existing theme CSS continues to work. No framework or build step is required. The original site's files have not been edited or deployed.

For a new placement:

```html
<silver-toggle></silver-toggle>
<script type="module" src="./silver-toggle/silver-toggle.js"></script>
```

Default size is 84 × 44 CSS pixels, including the full clickable area. Resize with CSS:

```css
silver-toggle { width: 84px; height: 44px; }
```

Set `sound="crisp"`, `sound="heavy"`, or `sound="damped"` to choose a preset. Heavy is the default. Set `sound-src="./silver-toggle/click.wav"` to use your own short recording; the preset is used if playback fails. Add `muted` to disable the sound. The preview's Sound button affects both preview controls. Listen for `themechange` to integrate other behavior; `event.detail.theme` is `light` or `dark`.

## Behavior

- Native button with switch semantics, checked state, focus ring, and Enter/Space support.
- ArrowLeft selects light; ArrowRight selects dark.
- Reduced-motion users get an immediate position change.
- Sound starts only in response to a user action. Audio failure does not block the theme switch.
- WebGL failure uses a simpler CSS fallback.
- Rendering happens during a switch and on resize, with no permanent animation loop.
- Three.js 0.180.0 is vendored with its MIT license. The built-in component requires no external requests. A custom `sound-src` loads the supplied audio URL.

## Verification

Local in-app browser: WebGL rendered, click changed theme, ArrowLeft changed back, both preview controls stayed synchronized, and the stored theme survived reload. Earlier checks covered desktop and a 390 CSS-pixel viewport, including the local site header. The latest refinement was captured at desktop width only; the current mobile viewport override did not apply. This refinement was reviewed in desktop screenshots for horizontal slots, smoother collar, and quieter grain. Sound selection and pressed states were checked in the browser. Physical mobile devices and reference audio matching were not tested. The original synthesized clicks are available to audition in the online preview. The installer passed a temporary-copy installation and duplicate-install refusal check; the original site repository was unchanged.


## Expanded sound palette

Seven presets are available: crisp, weighted (default), damped, chunky, metallic, relay, and latch. The live preview auditions and selects each. The saved build journal includes all seven as WAV samples.


Current sound default: `weighted` (Weighted snap). It retains the crisp attack with slightly lower resonance and more body. Crisp and relay remain available for comparison.
