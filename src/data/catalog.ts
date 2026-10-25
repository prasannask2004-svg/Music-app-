import { Track } from '../types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight City Lights',
    artist: 'Neon Mirage',
    album: 'Synthetic Dreams 2026',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    duration: 214,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-lights-at-night-42838-large.mp4',
    platform: 'spotify',
    platformUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    genre: 'Synthwave',
    bpm: 124,
    accentColor: '#06b6d4',
    upvotes: 42,
    lyrics: [
      { time: 4, text: "Skylines glowing in electric cyan..." },
      { time: 10, text: "Reflecting chrome across the glass highway" },
      { time: 16, text: "We drift through shadows of the late night rush" },
      { time: 24, text: "Feel the frequency vibrate through the bass" },
      { time: 32, text: "Synchronized heartbeats in the digital room" },
      { time: 45, text: "Lost in the pulse of midnight infinity" },
      { time: 58, text: "Take my hand as the neon waves crash in" },
      { time: 72, text: "Never look back, tomorrow is a distant glow" }
    ]
  },
  {
    id: 'track-2',
    title: 'Spatial Aurora (Dolby Atmos)',
    artist: 'Kira & The Resonance',
    album: 'Apple Spatial Sessions',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    duration: 188,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=chill-abstract-intention-12099.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-northern-lights-in-the-night-sky-41481-large.mp4',
    platform: 'apple',
    platformUrl: 'https://music.apple.com/us/album/spatial-aurora/159823412',
    genre: 'Ambient Chill',
    bpm: 88,
    accentColor: '#fb7185',
    upvotes: 67,
    lyrics: [
      { time: 5, text: "Celestial curtains ripple in violet green" },
      { time: 14, text: "Whispers of cold air under silent stars" },
      { time: 23, text: "Breathe in the stillness of deep space" },
      { time: 35, text: "Harmonics rising through floating glass" },
      { time: 48, text: "Where time dissolves into pure light" },
      { time: 64, text: "Echoes that linger when the world sleeps" }
    ]
  },
  {
    id: 'track-3',
    title: 'Tokyo Rain Loft',
    artist: 'Chilled Cat Beats',
    album: 'Lo-Fi Shibuya Memories',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    duration: 165,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=spirit-blossom-15285.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-glass-roof-41517-large.mp4',
    platform: 'spotify',
    platformUrl: 'https://open.spotify.com/album/37i9dQZF1DXdLEN7aqioXM',
    genre: 'Lo-Fi Hip-Hop',
    bpm: 82,
    accentColor: '#a855f7',
    upvotes: 89,
    lyrics: [
      { time: 6, text: "Gentle drops tapping on window panes" },
      { time: 15, text: "Vinyl crackle humming on the turntable" },
      { time: 27, text: "Warm coffee steaming in the quiet room" },
      { time: 40, text: "Midnight sketches in a spiral notebook" },
      { time: 55, text: "Notes blending with steady precipitation" },
      { time: 70, text: "Calm serenity floating till sunrise" }
    ]
  },
  {
    id: 'track-4',
    title: 'Cyberpunk Odyssey',
    artist: 'Vektor 9',
    album: 'Neural Grid 2088',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    duration: 230,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-2099-10701.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-with-neon-signs-and-rain-42841-large.mp4',
    platform: 'aura',
    genre: 'Cyber Electro',
    bpm: 130,
    accentColor: '#38bdf8',
    upvotes: 55,
    lyrics: [
      { time: 8, text: "Upload consciousness into the optical stream" },
      { time: 18, text: "Data cascading through synaptic towers" },
      { time: 30, text: "Sub-bass roaring through titanium alleys" },
      { time: 44, text: "We are the ghosts inside the audio shell" },
      { time: 60, text: "Accelerate beyond the firewall barrier" },
      { time: 75, text: "Overclocked frequencies shining like sparks" }
    ]
  },
  {
    id: 'track-5',
    title: 'Silk & Golden Velvet',
    artist: 'Aria Montclaire',
    album: 'Apple Master Classical Reworks',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    duration: 195,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=piano-moment-9835.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-playing-the-piano-41981-large.mp4',
    platform: 'apple',
    platformUrl: 'https://music.apple.com/us/album/silk-golden-velvet/164789123',
    genre: 'Neo-Classical',
    bpm: 74,
    accentColor: '#f59e0b',
    upvotes: 38,
    lyrics: [
      { time: 7, text: "Keys of ivory breathing under candlelight" },
      { time: 19, text: "Echoes of Chopin wrapped in modern warmth" },
      { time: 32, text: "String quartet swells in rich stereophony" },
      { time: 48, text: "Every breath between notes speaks louder" },
      { time: 65, text: "A gentle cadence fading into golden mist" }
    ]
  },
  {
    id: 'track-6',
    title: 'Sunset Boulevard Groove',
    artist: 'Pacific Funk Syndicate',
    album: 'Coastline Express',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    duration: 204,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_24a2ef69b6.mp3?filename=groove-funk-modern-party-125438.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-along-a-coastal-road-at-sunset-42861-large.mp4',
    platform: 'spotify',
    platformUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
    genre: 'Nu-Disco / Funk',
    bpm: 118,
    accentColor: '#10b981',
    upvotes: 76,
    lyrics: [
      { time: 5, text: "Golden sun dipping into Pacific waves" },
      { time: 14, text: "Top down cruising with the bassline turned high" },
      { time: 26, text: "Slap bass and vintage analog brass" },
      { time: 38, text: "Everybody moving on the rooftop patio" },
      { time: 52, text: "Keep that rhythm alive all through dusk" }
    ]
  }
];

export const PLAYLIST_CATEGORIES = [
  { id: 'all', name: 'All Tracks' },
  { id: 'spotify', name: 'Spotify Hits' },
  { id: 'apple', name: 'Apple Music Spatial' },
  { id: 'synthwave', name: 'Synth & Retrowave' },
  { id: 'chill', name: 'Lo-Fi & Study' },
  { id: 'dance', name: 'Electronic & Funk' }
];
