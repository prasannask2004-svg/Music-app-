# AuraGlass Sync — Collaborative Music & Video Player

AuraGlass Sync is a real-time collaborative music and video streaming web player featuring unified Spotify and Apple Music integration, audio and video playback toggles, synchronized listening rooms with live presence and reactions, and a deep frosted glassmorphic UI.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were selected based on the recommended defaults and user requirements:

- **Playback Sources & Catalog**: Dual audio/video playback engine supporting Spotify and Apple Music track metadata & embed integrations, direct high-fidelity audio streams, synchronized YouTube music videos, and custom track/stream URL inputs.
- **Collaborative Sync Architecture**: Server-authoritative WebSocket room engine providing sub-second playback synchronization (play/pause/seek), synchronized queue management, real-time active listener avatars, and floating visual reaction bursts.
- **Glass UI Theme**: Dark obsidian canvas with multi-layered frosted glass panels (`backdrop-blur-xl`), specular rim highlights, dynamic ambient lighting mapped to album art colors, and a live canvas audio frequency spectrum visualizer.

---

## 1. Overview & Core Concept

- **What It Does**: AuraGlass Sync combines online music discovery, synchronized multi-user listening lounges, and versatile media playback. Users can listen in Pure Audio Mode with a dynamic reactive visualizer or switch seamlessly to Video Mode for official music videos, all while sharing the session in real-time with friends across synchronized rooms.
- **Target Audience / Persona**: Music enthusiasts, study groups, remote friends having virtual listening parties, and creators wanting synchronized music and video streaming.
- **Key Value**: Solves the friction of fragmented music services and desynchronized group listening by offering a unified room where everyone hears and sees the exact same timestamp with shared queuing and zero audio lag.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Service Browsing**:
   - Explore curated playlists across genres (Synthwave, Chillhop, Electronic, Pop Hits, Acoustic).
   - Switch between **Spotify Mode**, **Apple Music Mode**, and **Aura Master Catalog** styling and library views.
   - Search by song title, artist, or paste external Spotify/Apple Music/YouTube URLs for instant playback.

2. **Playback Experience (Audio vs. Video)**:
   - **Pure Audio Mode**: Large circular rotating vinyl sleeve, dynamic canvas audio visualizer (bars, waves, and orb spectrums responding to Web Audio frequency data), synchronized lyrics stream, and track info.
   - **Music Video Mode**: Cinematic video viewport with floating translucent glass playback HUD, ambient edge glow, and cinema theater focus toggle.
   - **Persistent Bottom Player Bar**: Always-accessible glass deck with track scrubber (time elapsed / remaining with `tabular-nums`), Play/Pause, Skip, Previous, Shuffle, Loop, Volume slider, and Mode switcher.

3. **Collaborative Listening Lounges (Rooms)**:
   - **Create / Join Lounge**: Quick room code generation (e.g. `SYNC-8429`) with 1-click shareable link.
   - **Synchronized Playback**: Host commands (play, pause, seek, next track) broadcast instantly via WebSockets to all connected listeners with drift correction.
   - **Shared Queue & DJ Mode**: Room participants can queue songs, upvote tracks, and reorder.
   - **Live Presence & Chat**: See who is currently in the room, host badge, listener statuses, and send real-time emoji reaction sparks (🔥, 💖, ⚡, 🎵, 🎧) that float up across the glass stage.

### Visual Identity & Theme

- **Aesthetic Direction**: Deep Frosted Glassmorphism with Neon Specular Accents (refined, modern, anti-slop; zero generic unstyled pills).
- **Color Palette**:
  - Neutral Base (60%): Deep obsidian void (`#0A0D14` to `#0F172A`).
  - Glass Surfaces (30%): Ultra-thin specular borders (`border-white/10`), milky frosted glass (`backdrop-blur-2xl bg-white/[0.04]` to `bg-slate-900/60`), and subtle drop shadows.
  - Ambient Accents (10%): Electric Cyan (`#06B6D4`), Neon Purple (`#A855F7`), and Apple Rose (`#FB7185`) dynamically tinted from the active album cover.
- **Typography & Scale**:
  - Display/Headings: `Plus Jakarta Sans` / `Outfit` (bold, tight tracking).
  - Body Prose: `DM Sans` (balanced, highly legible on dark translucent glass).
  - Telemetry & Timestamps: `JetBrains Mono` with `tabular-nums` for timers and counters.
- **Single-Line Controls & Anti-Slop**:
  - No fake AI scores or telemetry tickers.
  - Metadata formatted with typographic bullet separators (`Drake · Certified Lover Boy · 3:24`).
  - Single-line nav links and buttons with `whitespace-nowrap shrink-0`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Audio & Video Playback Architecture**
  - *Chosen Approach*: Unified media controller with HTML5 Audio + Web Audio API Analyser for local audio synthesis and streaming, synchronized with YouTube iframe API and Spotify/Apple Music widgets for video and catalog tracks.
  - *Why*: Direct HTML5 audio unlocks real-time Web Audio API frequency analysis (yielding an authentic, reactive visualizer), while video embedding provides authentic music video streaming.
  - *Alternatives Considered*: Pure Spotify SDK only (requires paid Spotify Premium OAuth for every listener, blocking guests without paid accounts).

- **Decision 2: Server-Authoritative WebSocket Sync for Rooms**
  - *Chosen Approach*: Express HTTP + WebSocket (`ws`) server on port 3000 maintaining synchronized room state: `{ roomId, currentTrack, isPlaying, positionSec, lastSyncTimestamp, queue, users }`.
  - *Why*: Ensures sub-second sync across multiple browser tabs/devices, prevents client clock drift using server timestamps, and handles participant join/leave events cleanly.
  - *Alternatives Considered*: Client-only peer-to-peer WebRTC (complex NAT traversal, fragile room leader disconnection).

- **Decision 3: Glassmorphic Component System with Dark Performance Tuning**
  - *Chosen Approach*: Hardware-accelerated CSS `backdrop-filter: blur(20px)` paired with GPU-rendered HTML5 Canvas for the visualizer, avoiding frame drops on mobile and desktop.
  - *Why*: Delivers an ultra-premium glass aesthetic while maintaining 60fps audio-reactive rendering.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AuraGlass Sync Client                         │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Top Bar: Brand, Catalog Modes (Spotify / Apple Music), Room Lounge │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────┬────────────────────────────────────────┐ │
│ │      Left Workspace       │         Right Interactive Deck         │ │
│ │ ┌───────────────────────┐ │ ┌────────────────────────────────────┐ │ │
│ │ │ Audio Spectrum Visual │ │ │ Real-Time Collaborative Room Panel │ │ │
│ │ │ OR Cinema Video Stage │ │ │ - Active Listeners (Avatars)       │ │ │
│ │ └───────────────────────┘ │ │ - Shared Room Queue & Upvoting     │ │ │
│ │ ┌───────────────────────┐ │ │ - Live Floating Reaction Sparks    │ │ │
│ │ │ Curated Catalog Grid  │ │ └────────────────────────────────────┘ │ │
│ │ │ (Spotify / Apple)     │ │ ┌────────────────────────────────────┐ │ │
│ │ └───────────────────────┘ │ │ Synced Lyrics & Track Details      │ │ │
│ │                           │ └────────────────────────────────────┘ │ │
│ └───────────────────────────┴────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Glass Player Bar: Scrubber, Audio/Video Switch, Equalizer, Volume  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ WebSockets (ws://) & HTTP (/api)
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Node.js Express + WebSocket Server                  │
├────────────────────────────────────────────────────────────────────────┤
│ - Room Manager (create/join room, sync timestamp drift, host handover) │
│ - Synchronized Media Queue & Playback State Machine                    │
│ - Presence Tracker & Real-Time Reaction Relay Engine                   │
│ - Curated Spotify / Apple Music / Video Catalog Service API            │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **`RoomState`**:
  - `id: string` (e.g. "LOUNGE-921")
  - `hostId: string`
  - `name: string`
  - `currentTrack: Track | null`
  - `isPlaying: boolean`
  - `playbackPosition: number` (seconds)
  - `lastUpdated: number` (server epoch timestamp for clock-skew compensation)
  - `queue: Track[]`
  - `participants: User[]`
  - `playbackMode: 'audio' | 'video'`

- **`Track`**:
  - `id: string`
  - `title: string`
  - `artist: string`
  - `album: string`
  - `coverUrl: string`
  - `duration: number` (seconds)
  - `audioUrl: string` (high-quality stream)
  - `videoUrl: string` (YouTube/MP4 video stream)
  - `spotifyId?: string`
  - `appleMusicId?: string`
  - `serviceOrigin: 'spotify' | 'apple' | 'aura'`
  - `lyrics?: { time: number; text: string }[]`

- **`User`**:
  - `id: string`
  - `name: string`
  - `avatarColor: string`
  - `isHost: boolean`
  - `joinedAt: number`

- **`ReactionEvent`**:
  - `id: string`
  - `userId: string`
  - `userName: string`
  - `emoji: string`
  - `timestamp: number`

### Interactive Component & State Mapping

1. **`RoomSyncProvider`**: Connects to the Express WebSocket server, synchronizes room clock offset, dispatches actions (`join_room`, `play`, `pause`, `seek`, `add_queue`, `send_reaction`), and handles network reconnects.
2. **`VisualizerCanvas`**: Direct Web Audio API node analyzing frequency bin amplitudes (FFT size 128/256), rendering fluid glowing neon bars and circular wave spectrums matching album palette.
3. **`VideoStage`**: Responsive video player with fullscreen mode, ambient glow projection behind the viewport, and glass floating controls.
4. **`ServiceSwitcher`**: Instant toggle between Spotify dark neon green styling, Apple Music vibrant ruby magenta styling, and Aura Glass cosmic dark slate styling.
5. **`SharedQueueList`**: Real-time collaborative queue supporting track upvoting, addition from catalog or custom URL, and instant host skip.
