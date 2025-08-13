## Flocus Multi-Timer — Details

### Overview
A lightweight, offline-capable web app to run multiple independent timers with customizable backgrounds and ambient sounds. All preferences persist locally; no backend required.

### Core Features
- **Multiple timers**: Create, rename, set duration (minutes), Start/Pause/Reset, and Delete. Timers run independently and are listed in creation order.
- **Auto-starter**: If you have no timers, a default 25-minute "Focus" timer is created on first load.
- **Editable UI**: Rename timers inline and adjust duration at any time.

### Personalization
- **Backgrounds**:
  - Choose from built-in images in `assets/images/backgrounds/`.
  - Upload your own image (stored as a Data URL in local storage).
  - Persisted across sessions.
- **Ambient sounds**:
  - Pick a default sound from a small curated list (CDN hosted), or upload your own audio.
  - Loop playback with volume control and a Play/Pause toggle.
  - Persisted across sessions.
- **Dark mode**: Toggle persists and updates the UI instantly.

### How It Works
- **Timer engine**: Each timer ticks every second. When time reaches 0, the timer is paused. Duration changes apply immediately; remaining time clamps to the new duration when shorter.
- **Persistence**: Preferences and timers are saved via `localStorage` using safe JSON helpers.
- **Offline/PWA**:
  - A service worker caches the app shell (`index.html`, CSS, JS, icons, default backgrounds, manifest) for offline use.
  - CDN ambient audio uses a network-first strategy with cache fallback when offline.
  - Web App Manifest enables installable, standalone experience.

### Quick Start
1. Click "Add Timer" to create a new timer (25 minutes by default).
2. Click the title to rename; change minutes in the numeric input.
3. Use Start/Pause/Reset/Delete on each card.
4. Open Settings (gear icon) to:
   - Set a background or upload your own
   - Select or upload an ambient sound, adjust volume, Play/Pause
   - Toggle dark mode

### Files of Interest
- `index.html`: Structure and settings panel.
- `css/styles.css`: Layout, theme variables, dark mode.
- `js/storage.js`: Safe JSON read/write and storage keys.
- `js/timers.js`: Timer state, lifecycle, formatting, and change notifications.
- `js/backgrounds.js`: Background selection/upload and application.
- `js/sounds.js`: Ambient audio sources, upload, volume, and persistence.
- `js/main.js`: App bootstrap, bindings, and rendering.
- `sw.js`: Service worker caching strategy.
- `manifest.json`: PWA metadata and icons.

### Defaults and Data
- **Default timer**: 25 minutes.
- **Default volume**: 0.4
- **Default ambient sounds:
  - Rain
  - Forest Birds
  - Coffee Shop

### Notes
- Timers do not play a completion alarm; they pause at 00:00.
- Uploaded backgrounds/sounds are stored as Data URLs in local storage; clearing site data removes them.
