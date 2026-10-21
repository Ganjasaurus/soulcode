# Soulcode

A kid-friendly visual game studio inspired by the spacious canvas and compact tool folders in [clai](https://github.com/Ganjasaurus/clai). Charcoal UI, cyan accents, locally bundled DM Sans, and original procedural toy-like artwork.

## Make a game

1. Drag an asset into the world, or click an asset to add it.
2. Select an object. Change its size and color, or add a behavior.
3. Press **Play**. **Stop** restores the editor without changing the level.
4. **Export game** downloads a standalone HTML game or an editable `.soulcode` backup.

The studio opens in a playable Crystal Quest scene. Starters also include Star Patrol (space shooter), Neon Rally (racing), The Moon Door (branching adventure), and a blank world.

## Implemented

- 2D canvas and real Three.js 3D rendering, switchable for every project.
- Dragging, selection, transform sliders, colors, duplication, visibility, undo/redo, grid, zoom, and 3D orbit controls.
- Player movement, jumping, star shooting, driving, follow, waypoint patrol, wandering, float, spin, solid collision, collectibles, hazards, portals, story interactions, and particles.
- Scoring, hearts, time limits, victory/retry, touch controls, pause, and sound toggling.
- Multiple scenes, scene duplication/deletion, editable story text and choice destinations, fade/slide transitions.
- PNG/JPEG/WebP/GIF imports (converted to still PNG sprites), plus browser-supported audio. Images become sprites in 2D and billboards in 3D. Audio can be assigned to a collection/story interaction or looping background music.
- Image asset downloads as PNG. Editable project import/export retains uploaded media and behavior settings.
- Standalone HTML games embed their player, project, artwork, and audio. No network requests are required during exported gameplay.
- Autosave and multiple project storage in IndexedDB, with explicit failure reporting. Projects are browser-local; export a backup to move devices or preserve work before clearing browser data.

This is a bounded game maker for small top-down games and stories. It has 30 scenes per project, 200 objects per scene, 60 uploaded assets, an 8 MB per-file import limit, and a 28 MB encoded media budget. 3D is a fixed-ground, orbitable miniature world; it does not include terrain sculpting, full rigid-body physics, arbitrary 3D model imports, skeletal animation, multiplayer, or native app/console builds. GIF imports use a still frame. The 3D player falls back to 2D when WebGL is unavailable.

## Development

```sh
npm ci
npm run build
npm test
npm run dev
```

Open `http://localhost:4173`. Static production files are in `dist/`; `.openai/hosting.json` identifies the private hosted Site. `src/model.js` defines assets/templates and validates project imports, `src/simulation.js` implements game rules, `src/renderer.js` draws both dimensions, `src/runtime.js` runs previews/exports, and `src/app.js` manages the editor.

Rebuild after changing source JavaScript. The editor and downloadable player are bundled separately from the same source engine. Runtime dependencies and fonts are served locally; no external CDN is needed.

## Verification

- 14 Node tests cover template round trips, movement and bounds, source isolation, collection, collision, hazards, follow/patrol, shooting, racing, portal/story transitions, timers, disabled behaviors, and import validation.
- Browser checks cover object creation, dragging, undo/redo, sliders, path editing, both view modes, preview restoration, image/audio upload, project round trips, story editing/branching, genre starters, local persistence, and a 390 px mobile viewport.
- Exported 2D and 3D HTML is exercised in browser contexts with networking disabled, including embedded uploaded media. This environment blocks `file://` navigation, so exported HTML is loaded directly into the browser document for these checks.

## Credits

Original interface and game artwork created for Soulcode. Three.js is MIT-licensed (license included in `dist/THREE-LICENSE.txt`). DM Sans is under the SIL Open Font License (included in `dist/fonts/OFL.txt`).
