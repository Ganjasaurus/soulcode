# Soulcode

A kid-friendly visual game studio inspired by the spacious canvas and compact tool folders in [clai](https://github.com/Ganjasaurus/clai). Charcoal UI, cyan accents, locally bundled DM Sans, and original procedural toy-like artwork.

## Make a game

1. Pick a starter: Crystal Quest, Star Patrol, Neon Rally, The Moon Door, Sky Steps, or a blank world.
2. Drag an asset into the world. Select it to change its appearance or add a behavior.
3. Open **Build** to paint floors, place blocks, stamp walls, or expand the map. Layer 0 stacks onto faces in 3D; higher layers draw at a chosen height. The eraser removes the targeted block. **Map size & ground** contains world dimensions and the ground toggle.
4. Open **Draw** to make a transparent sprite, then drop it from **Yours** into the world. Select a placed sprite and choose **Edit sprite** to change it later.
5. Use the camera button beside **2D / 3D** to choose top-down, side-on platformer, isometric, first-person, or third-person play. Camera settings apply when playing; the editor keeps its freely navigable view.
6. Press **Play**. **Stop** restores the editor without changing the level.
7. **Export game** downloads a standalone HTML game or an editable `.soulcode` backup.

Two fingers pan the editor, pinch zooms, and small trackpad scrolls pan. Mouse users can select the hand tool (**H**), hold Shift, or use the middle button to pan; right-drag or the orbit tool rotates 3D. In first- and third-person games, drag to look, use WASD/arrows to move, and Q/R to turn. Space jumps or shoots. Sky Steps uses left/right and Space.

## Implemented

- 2D canvas and real Three.js 3D rendering. Perspective first/third-person cameras, orthographic isometric camera, smooth following, relevant height/distance/angle/direction settings, and third-person wall avoidance.
- Maps up to 64 × 64 cells, seven floor/material palettes, individual floor painting, gaps, blocks, thin platforms, pillars, and three-block wall stamps. Blocks stack through 16 layers. Terrain supports collision, gravity, jumping onto platforms, ceiling collisions, and falling/respawning. Sky Steps is a playable platformer slice.
- Terrain batches geometry by material and shape, pre-renders 2D tile layers, and uses nearby-column collision lookup. A brush stroke groups undo and batches renderer updates to animation frames. Third-person camera obstruction uses a short terrain sweep instead of scanning every block mesh.
- Visible selection boxes and labels in both view modes, including hidden selected objects. Dragging, transform sliders, colors, duplication, visibility, undo/redo, grid, zoom, and orbit controls.
- Sprite studio with pencil, eraser, flood fill, line, rectangle, ellipse, brush size, colors, filled/outline shapes, transparent/solid background, undo/redo, PNG download, and 16–128 px canvases. Reopening an imported image fits it into a square canvas up to 128 px; exported image assets otherwise keep their dimensions and aspect ratio.
- Player movement, jumping, star shooting, driving, follow, waypoint patrol, wandering, float, spin, solid collision, collectibles, hazards, portals, story interactions, and particles.
- Scoring, hearts, time limits, victory/retry, touch controls, pause, and sound toggling.
- Multiple scenes, scene duplication/deletion, editable story text and choice destinations, fade/slide transitions. New starters reset project rules, stories, camera, media, terrain, and transient editor state.
- PNG/JPEG/WebP/GIF imports (converted to still PNG sprites), plus browser-supported audio. Audio can be assigned to collection/story interaction or looping background music.
- Uploaded images are flat sprites in 2D and transparent billboards in 3D. The default upright billboard rotates around its vertical axis toward the camera, like a Doom-style character; optional screen-facing mode also follows camera tilt. Behaviors and collision remain in the 3D world. A single image does not acquire a modeled back or sides.
- Standalone HTML games embed their player, project, artwork, and audio. No network requests are required during exported gameplay. Editable project import/export retains media, behaviors, terrain, and camera settings. Older v1 projects migrate to default terrain/cameras on load.
- Autosave and multiple project storage in IndexedDB, with explicit failure reporting. Projects are browser-local; export a backup to move devices or preserve work before clearing browser data.

This is a bounded game maker for small games and stories. Limits are 30 scenes per project, 200 objects and 4,096 blocks per scene, 60 uploaded assets, an 8 MB per-file import limit, and a 28 MB encoded media budget. Rendering is batched, but frame rate depends on device, display resolution, visible objects, and shadows. Terrain uses simple collision volumes; there is no rigid-body physics, slope/ramp simulation, infinite streaming terrain, arbitrary 3D model import, animation timeline, multiplayer, or native app/console build. GIF imports use a still frame. The 3D player falls back to 2D when WebGL is unavailable. Side-view world construction uses the central Z lane; use the Sky Steps starter for a side-on level.

## Development

```sh
npm ci
npm run build
npm test
npm run dev
```

Open `http://localhost:4173`. Static production files are in `dist/`; `.openai/hosting.json` identifies the private hosted Site. `src/model.js` defines assets/templates and validates imports; `src/terrain.js` implements map data/collision; `src/simulation.js` implements game rules; `src/renderer.js` draws both dimensions; `src/runtime.js` runs previews/exports; `src/app.js` manages the editor. `src/pixels.js` and `src/sprite-studio.js` implement drawing, and `src/workbench.js` contains the building and camera UI.

Rebuild after changing source JavaScript. The editor and downloadable player are bundled separately from the same source engine. Runtime dependencies and fonts are local; no external CDN is needed.

## Verification

- `npm test`: 31 Node checks cover all six template round trips, legacy migration, source isolation, movement/bounds, collection, collision, hazards, follow/patrol, shooting, racing, portal/story transitions, timers, disabled behaviors, import validation, terrain walls/floors/gaps/ceilings, map growth, bounded collision lookup, camera-relative movement and aiming, sprite alpha/fill/shapes, and completing the platformer starter.
- With the local server running, `npm run test:browser` exercises editor flows, both dimensions, media import/export, all camera presets, selection restoration, map painting/resizing, touch pan/pinch without edits, sprite editing/transparency, starter isolation, persistence, and a 390 px mobile viewport. Set `SOULCODE_BROWSER` if Chromium is not at `/usr/bin/chromium`.
- Exported 2D, 3D, first-person, and platformer HTML is exercised in browser contexts with networking disabled. This environment blocks `file://` navigation, so exported HTML is loaded directly into the browser document for these checks.
- A separate renderer harness checks that a 4,096-block homogeneous scene uses two terrain batches and that first/third-person views use actual perspective cameras. Headless software-rendered frame times are diagnostic, not a hardware frame-rate guarantee. QA artifacts remain outside production bundles.

## Suggested next layer

Keep behaviors as the beginner view, add “When / If / Do” event cards, then offer an optional text view over the same validated logic graph. Useful events/actions include touch, timer, score threshold, switches, inventory, dialogue, spawning, checkpoints, and scene changes. This layer is proposed, not implemented.

An AI assistant should first produce validated project patches using a documented command/schema vocabulary, with preview, undo, and simulation checks. That supports hosted models and optional local models without making game runtime depend on AI. Fine-tuning a custom model can wait until there is a useful library of tested games and edit examples.

## Credits

Original interface and game artwork created for Soulcode. Three.js is MIT-licensed (license included in `dist/THREE-LICENSE.txt`). DM Sans is under the SIL Open Font License (included in `dist/fonts/OFL.txt`).
