import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { INITIAL_TRACKS, PLAYLIST_CATEGORIES } from '../data/catalog';
import { Track } from '../types';
import { Search, Play, Plus, Check, Radio, Link as LinkIcon, Music, Video, Sparkles } from 'lucide-react';

export const CatalogBrowser: React.FC = () => {
  const { currentTrack, setTrack, addToQueue, isPlaying } = useAudioPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customArtist, setCustomArtist] = useState('');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);

  // Filtered tracks
  const filteredTracks = INITIAL_TRACKS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.genre.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'spotify') return t.platform === 'spotify';
    if (selectedCategory === 'apple') return t.platform === 'apple';
    if (selectedCategory === 'synthwave') return t.genre.toLowerCase().includes('synth');
    if (selectedCategory === 'chill') return t.genre.toLowerCase().includes('chill') || t.genre.toLowerCase().includes('lo-fi');
    if (selectedCategory === 'dance') return t.genre.toLowerCase().includes('disco') || t.genre.toLowerCase().includes('funk') || t.genre.toLowerCase().includes('electro');
    return true;
  });

  const handleQueueTrack = (track: Track) => {
    addToQueue(track);
    setAddedTrackId(track.id);
    setTimeout(() => setAddedTrackId(null), 1500);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customAudioUrl.trim()) return;

    const imported: Track = {
      id: `imported-${Date.now()}`,
      title: customTitle.trim(),
      artist: customArtist.trim() || 'Custom Artist',
      album: 'Imported Web Stream',
      coverUrl: customCoverUrl.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      duration: 180,
      audioUrl: customAudioUrl.trim(),
      videoUrl: customVideoUrl.trim() || undefined,
      platform: 'aura',
      genre: 'Custom Stream',
      accentColor: '#06b6d4'
    };

    setTrack(imported);
    setShowImportModal(false);
    setCustomTitle('');
    setCustomArtist('');
    setCustomAudioUrl('');
    setCustomVideoUrl('');
    setCustomCoverUrl('');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header with Search and Import button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Music & Video Library
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Connect Spotify & Apple Music Catalogs
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tracks, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Import Media Link Button */}
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import Link</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PLAYLIST_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTracks.map((track) => {
          const isCurrent = currentTrack.id === track.id;
          return (
            <div
              key={track.id}
              className={`group glass-panel rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? 'border-cyan-500/50 bg-cyan-950/20 shadow-lg shadow-cyan-950/40'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              <div>
                {/* Artwork with platform chip */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3.5 bg-slate-900">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setTrack(track)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-xl cursor-pointer"
                    title="Play track now"
                  >
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </button>

                  {/* Platform Indicator */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md backdrop-blur-md ${
                        track.platform === 'spotify'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : track.platform === 'apple'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {track.platform === 'spotify' ? 'Spotify' : track.platform === 'apple' ? 'Apple Music' : 'Aura'}
                    </span>
                  </div>

                  {/* Video Available Indicator */}
                  {track.videoUrl && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="p-1 rounded-md bg-black/60 text-slate-300 backdrop-blur-md flex items-center gap-1 text-[10px] border border-white/10">
                        <Video className="w-3 h-3 text-rose-400" />
                        <span>MV</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-base font-bold text-white tracking-tight truncate">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {track.artist}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <span>{track.genre}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                  {track.bpm && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{track.bpm} BPM</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => setTrack(track)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent && isPlaying
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-white/[0.05] hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCurrent && isPlaying ? 'Playing' : 'Play Now'}</span>
                </button>

                <button
                  onClick={() => handleQueueTrack(track)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    addedTrackId === track.id
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                  title="Add to Lounge Queue"
                >
                  {addedTrackId === track.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Import Track / Media Stream Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-white/15 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-cyan-400" />
                Import Media Stream
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Paste direct audio (MP3/WAV/AAC) or music video (MP4) URLs to play in your synchronized lounge.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Track Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neon Horizon"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Artist Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stellar Echoes"
                  value={customArtist}
                  onChange={(e) => setCustomArtist(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Audio Stream URL (MP3 / HTTPS) *
                </label>
                <input
                  type="url"
                  placeholder="https://domain.com/stream.mp3"
                  value={customAudioUrl}
                  onChange={(e) => setCustomAudioUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Music Video Stream URL (MP4, optional)
                </label>
                <input
                  type="url"
                  placeholder="https://domain.com/video.mp4"
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium transition-all"
                >
                  Play in Lounge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
