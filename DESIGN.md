# Emily Lai — implemented layout system

This is the authoritative layout specification for the shipped site. GRID.md and
EMILYLAI-DESIGN-LLM.md are historical proposals; their conflicting prescriptions
do not override this document. Preserve the desk metaphor, content, and interaction
model when refining the interface.

## Structure

Desktop uses a two-column CSS Grid: identity/folders and a window stage. The window
contains a flex title bar and a nested grid: list, divider, reader. At widths of
900px and below, the home becomes one column; opening a folder shows a full-screen
list, and opening an entry replaces that list with the reader.

Closed desktop retains the left-aligned identity and empty right-hand stage.
Open desktop retains the same identity alignment. Mobile home, list, and reader
are separate states. Search overlays these states without changing their grid.

## Dimensions and spacing

- Primary spacing tokens: 8, 16, 24, 32, 48px; 4px half-steps support compact details.
- Desktop page padding varies continuously from 32 to 48px; stage gap from 24 to
  48px; sidebar from 280 to 340px. The CSS clamp formulas interpolate these values
  across roughly 901–1297px. Do not reinstate a sudden geometry change at 1200px.
- Window maximum width: 920px. Minimum: 520px, limited by available stage width.
- Window height follows the dynamic viewport minus page padding and 16px breathing
  room; existing viewport-aware minimum/maximum height and drag bounds still apply.
- Default list width: 38%. Minimum list: 208px. Divider: 8px. Minimum reader: 272px,
  including its padding. CSS subtracts the divider before limiting the list width.
  JavaScript reads these same custom properties for dragging and keyboard bounds.
- Desktop list/reader padding: 16px. Mobile page/reader side inset: 20px.
- Folder gap: 4px; folder icon/label gap: 8px. Folder top spacing: 48px desktop,
  32px mobile. Mobile folder rows use 12px vertical padding.
- The title bar sizes to its contents. Tabs have no vertical offset or overflowing
  selected-state pseudo-element; only their horizontal axis should scroll.
- Mobile search, theme, and palette-close controls: 44px square.

Fluid track widths, text wrapping, 1px borders, optical icon adjustments, native
media aspect ratios, and existing motion geometry are deliberate exceptions to
spacing multiples. The token scale does not force every coordinate onto a grid.

## Typography and surfaces

Times New Roman/Times for prose; system sans for chrome, including search input.
Identity title: 32px. Reading text: 17px, generally 1.5 line height. Long prose has
a 70ch maximum and shrinks naturally. Metadata and controls keep their existing
compact roles. Outer window radius: 8px; inner surfaces: 4px. Circular and segmented
theme controls retain their shapes. Dark mode changes palette, not layout.

## Interaction invariants

Desktop supports at most four open folder tabs and a draggable/resizable window.
Mobile shows visible folder tabs and one active folder; close returns home, back
returns to the list. Background content becomes inert while the mobile window is
open. Preserve keyboard navigation, focus restoration, reduced motion, safe-area
padding, content loading, and persisted window state.

## Verification

Check home, empty list/reader, selected reader, search, light/dark themes, and
resized window/divider extremes. Cover 320px through wide desktop widths, short
landscape windows, and both sides of responsive boundaries. Assert child overflow
and tab scroll geometry as well as page overflow. Render every entry and inspect
representative images, videos, embeds, and long copy. A browser engine emulating
mobile is not physical-device or Safari verification.

The local audit tools live in tools/ (not published). Report exact viewport/state
coverage and distinguish tested, failed, and unavailable browsers before release.
