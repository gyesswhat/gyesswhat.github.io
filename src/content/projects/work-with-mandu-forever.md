## Overview

Mandu is a desktop pet I built for myself: a transparent, frameless,
always-on-top 3D dumpling-dog that lives in the corner of the screen, tracks
the cursor with its eyes, and wags when clicked. A docked to-do window sits
above it — finish a task and mandu drops a fresh dumpling into its bowl, so
the growing pile becomes a small visible record of the day's work.

Solo build end-to-end (Electron shell, Three.js scene, macOS/Windows
packaging) across two commits.

## Key Contributions

### 1. Solo End-to-End Build
Designed and built the entire widget alone — 3D scene, window management,
IPC plumbing between the pet and to-do windows, and cross-platform packaging.

### 2. Desktop Widget Shell (Electron)
- Built a transparent, frameless, always-on-top window that stays click-through
  everywhere except over the model itself, toggling `setIgnoreMouseEvents`
  per-frame via a raycast hit test so the desktop underneath stays usable.
- Registered a custom `app://` protocol to serve the app's own files, working
  around a `file://`-origin CORS restriction on relative ES module imports.
- Persisted window position across restarts (`mandu-position.json`) and kept a
  second, independently toggleable to-do window docked to it — dragging mandu
  moves both together.

### 3. 3D Scene & Interaction (Three.js)
- Implemented cursor-tracking look-at on the model (yaw/pitch/roll) and a
  click-triggered tail-wag reaction.
- Built the "todo → dumpling" gamification loop: completing a to-do drops a
  dumpling from off-screen into a physics-lite fall onto a pile in the model's
  bowl, with pile state persisted and restored on launch.
- Added a right-click context menu (reset position / quit).

### 4. Packaging
- Fixed a packaged-build regression where the model failed to render
  (`net.fetch(file://…)` behaves differently under the packaging sandbox) by
  serving assets through the custom protocol via `fs` instead, and configured
  the macOS/Windows `electron-builder` icon and target setup.