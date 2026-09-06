# Production assets

Run `npm ci` then `npm run build` after changing JavaScript, CSS, or content.
Commit the source files and regenerated `dist/`, `silver-toggle/silver-toggle.min.js`, and `index.html` together. GitHub Pages serves these committed files directly.

The builder combines the five ordered site scripts, bundles only the imported Three.js code, minifies CSS, updates cache hashes, and prerenders the public folder list. Source files and the Three.js license remain in the repository.

## September 6 performance check

Local Chrome mobile emulation (390px), 4x CPU slowdown, 100ms latency, 200 KB/s downloads. Local server served uncompressed files; third-party requests were blocked equally in both runs. These are individual lab runs, not real-user Core Web Vitals or production guarantees.

| Measurement | Before | After |
| --- | ---: | ---: |
| Script/style/resource body bytes, excluding HTML | 2,278,808 | 776,716 |
| First contentful paint | 1,144 ms | 840 ms |
| First visible 3D frame | 12,852 ms | 5,090 ms |
| Layout shift | 0.035 | 0 |

Existing lazy media, video preload=none, local optimized image mappings, and system fonts are preserved. The toggle retains the same geometry, lighting, materials, shadows, and Weighted snap audio. It skips an unnecessary startup animation when already at its target position.

Browser checks: 1440px, 390px, 320px contact opening/dismissal, mobile folder contact, reader content, theme switching, overflow, and JavaScript errors. Delayed and failed 3D loading checked at 1440px and 390px. Physical-device Safari and real-user INP were not measured.
