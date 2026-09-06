#!/bin/bash
# Rebuilds the site data from content/content.csv in the right order.
set -e
cd "$(dirname "$0")/.." || exit 1
A=$(ls -d ~/Downloads/twitter-2026-08-26-*/ | head -1)
node content/build-content.mjs content/content.csv content.js >/dev/null
node content/build-previews.mjs "$A"
if command -v cwebp >/dev/null && command -v sips >/dev/null; then
 node content/optimize-media.mjs
fi
node content/sort-content.mjs >/dev/null
node content/build-content.mjs content/content.csv content.js
node content/build-fallback.mjs
node scripts/build.mjs
