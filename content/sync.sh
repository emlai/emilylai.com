#!/bin/bash
# Rebuilds the site data from content/content.csv in the right order.
cd "$(dirname "$0")/.." || exit 1
A=$(ls -d ~/Downloads/twitter-2026-08-26-*/ | head -1)
node content/build-content.mjs content/content.csv content.js >/dev/null
node content/build-previews.mjs "$A"
node content/sort-content.mjs >/dev/null
node content/build-content.mjs content/content.csv content.js
