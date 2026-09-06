---
name: Silver toggle
description: A physical steel theme switch for Emily Lai's site.
colors:
  plate-silver: "#e7e7e7"
  polished-silver: "#c9cbd0"
  socket-dark: "#141416"
  focus: "#777777"
components:
  silver-toggle:
    width: "84px"
    height: "44px"
---

# Design System: Silver toggle

## Overview

A slim brushed steel plate with two screws with horizontal slots and a machined, knurled lever. This document records the isolated component, not a new visual system for the surrounding site. The material direction follows the supplied steel hardware photos: subdued neutral directional grain, a spline-smoothed rolled collar with a dark recessed bore, and turned metal ends. The result is a code-led interpretation with no approved comparison comp.

## Colors

Plate silver and polished silver are Three.js material base colors, modulated by generated HDR studio panels. The plate uses a neutral metal material with directional brush color and bump maps. Its bevel and exposed lathe collar use a separate polished material; the knurled grip uses a slightly rougher steel material. Screw heads and the lever end use concentric machining texture with radial sheen. Socket dark defines the mounting recess and screw slots. The focus color is exposed through the component's `--focus` custom property.

## Typography

The switch has no visible lettering. Preserve the site's existing typography when integrating it. Accessible naming belongs to the button semantics.

## Layout

The default host is an inline, nonshrinking header control with the dimensions recorded above. Its transparent canvas includes room around the narrower plate and its shadow. The isolated enlarged demo scales the same mesh with a responsive 2.5 aspect ratio; it is not a separate illustration.

## Elevation & Depth

Use actual mesh depth, reflective metal, beveled edges, and directional lighting. The lever casts an offset shadow onto the plate. Broad HDR panels and dark studio surroundings supply reflection structure without remote assets. ACES tone mapping retains the highlight range. Canvas resolution uses a 2× minimum pixel ratio, capped at 3×. Rendering occurs for initialization, resize, and state animation, with no perpetual idle render loop.

## Shapes

The plate is a beveled horizontal rectangle with gently rounded corners. Two screw heads with horizontal screwdriver slots sit at opposite ends. The central socket has an exposed spline-smoothed rolled lathe profile around a black recessed bore and carries a cylindrical lever with physical pyramidal knurl facets and radial tooling marks on its end.

## Components

`<silver-toggle>` is a self-contained custom element backed by real Three.js geometry and shadow-DOM button semantics. Import `silver-toggle.js`; keep its local vendor modules available. `replaceThemeControl(selector)` replaces a matching existing control.

- Left selects light; right selects dark. The lever rotates between −0.65 and +0.65 radians over 230ms, with a brief mechanical overshoot. Reduced-motion preference makes the state immediate.
- Click, native button keyboard activation, and ArrowLeft/ArrowRight operate the switch. A `role="switch"`, “Dark mode” accessible name, `aria-checked`, changing action title, and visible focus outline expose state and action.
- The host page's `data-theme` is authoritative. Changes synchronize multiple instances. User activation persists the theme in localStorage, updates an existing theme-color meta tag, and emits a bubbling `themechange` event with the selected theme.
- Three Web Audio presets are available: `crisp`, `heavy` (default), and `damped`. The preview offers audition buttons with pressed states. Set `sound` to select a preset or `sound-src` for a supplied recording, with preset fallback on playback failure. These synthesized sounds do not reproduce the reference recording. Add `muted` to suppress sound.
- WebGL failure reveals a functional CSS fallback. Disconnection releases resources; reconnection rebuilds the rendering and observation setup.

## Do's and Don'ts

- Do preserve the slim plate, two screws, silver finish, and left/right mapping.
- Do preserve keyboard access, reduced motion, fallback operation, and render-on-change behavior.
- Don't describe synthesized sound as an exact captured recording.
- Don't replace the real mesh with a static image in the standard rendering path.


## Expanded sound palette

Seven presets are available: crisp, weighted (default), damped, chunky, metallic, relay, and latch. The live preview auditions and selects each. The saved build journal includes all seven as WAV samples.


Current sound default: `weighted` (Weighted snap). It retains the crisp attack with slightly lower resonance and more body. Crisp and relay remain available for comparison.
