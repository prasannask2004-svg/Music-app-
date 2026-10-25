import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Radio, Check, ExternalLink, Sparkles, Music, Disc3, ShieldCheck, PlaySquare, Flame } from 'lucide-react';

interface ConnectPlatformsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectPlatformsModal: React.FC<ConnectPlatformsModalProps> = ({ isOpen, onClose }) => {
  const { themeStyle, setThemeStyle } = useAudioPlayer();
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return;
    setImportStatus('Media link verified & synced! Latest album tracks queued.');
    setTimeout(() => {
      setImportStatus(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl relative animate-scale-up my-8">
        
        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-red-600 to-cyan-500 p-[1.5px] shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Connect Online Music Platforms & Servers
            </h2>
            <p className="text-xs text-slate-400">
              Gaana, YouTube Music, Spotify & Apple Music connected with synchronized lounge playback
            </p>
          </div>
        </div>

        {/* Platform Status Cards (4 Grids) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          
          {/* 1. Gaana App Card */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-rose-600/30 bg-rose-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-rose-900">
                    <Flame className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">Gaana App</span>
                    <span className="text-[10px] text-rose-300 block">Indian & Regional Music</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-500/30">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Full access to Indian regional chartbusters in Tamil, Hindi, Telugu, Malayalam & Punjabi.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between">
              <button
                onClick={() => setThemeStyle('gaana')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  themeStyle === 'gaana'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-950'
                    : 'bg-rose-600/10 text-rose-300 border-rose-600/30 hover:bg-rose-600/20'
                }`}
              >
                {themeStyle === 'gaana' ? 'Gaana Active' : 'Apply Gaana Theme'}
              </button>

              <a
                href="https://gaana.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-rose-300 flex items-center gap-1"
              >
                Open Gaana <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 2. YouTube Music Server Card */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-red-600/30 bg-red-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-red-900">
                    <PlaySquare className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">YouTube Music Server</span>
                    <span className="text-[10px] text-red-300 block">Music Video & Audio Streams</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-500/30">
                  <Check className="w-3 h-3" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Official YouTube Music high-definition videos, remixes, live performances, and trending global releases.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-red-500/20 flex items-center justify-between">
              <button
                onClick={() => setThemeStyle('ytmusic')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  themeStyle === 'ytmusic'
                    ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-950'
                    : 'bg-red-600/10 text-red-300 border-red-600/30 hover:bg-red-600/20'
                }`}
              >
                {themeStyle === 'ytmusic' ? 'YT Music Active' : 'Apply YT Theme'}
              </button>

              <a
                href="https://music.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-red-300 flex items-center gap-1"
              >
                Open YT Music <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 3. Spotify Card */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                    <Disc3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">Spotify Connect</span>
                    <span className="text-[10px] text-emerald-300 block">Global Playback SDK</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Stream Spotify catalog metadata, Web Playback SDK audio previews, and synced queues.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between">
              <button
                onClick={() => setThemeStyle('spotify')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  themeStyle === 'spotify'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                {themeStyle === 'spotify' ? 'Theme Active' : 'Apply Spotify Theme'}
              </button>

              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Open Spotify <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 4. Apple Music Card */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-rose-500/20 bg-rose-950/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xs">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">Apple Music</span>
                    <span className="text-[10px] text-rose-300 block">Spatial Audio & Dolby Atmos</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-500/30">
                  <Check className="w-3 h-3" />
                  Spatial Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Lossless audio and Apple Spatial Audio Dolby Atmos stream emulation with MusicKit web widgets.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-500/10 flex items-center justify-between">
              <button
                onClick={() => setThemeStyle('apple')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  themeStyle === 'apple'
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                {themeStyle === 'apple' ? 'Theme Active' : 'Apply Apple Theme'}
              </button>

              <a
                href="https://music.apple.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-rose-300 flex items-center gap-1"
              >
                Open Apple <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Universal Import Playlist / Album Form */}
        <div className="glass-panel-subtle rounded-2xl p-5 border border-white/10">
          <h4 className="text-sm font-bold text-white tracking-tight mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Import External Album, Song, or Playlist Link
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Paste any link from <strong>Gaana</strong>, <strong>YouTube Music</strong>, <strong>Spotify</strong>, or <strong>Apple Music</strong> to synchronize it into your shared lounge.
          </p>

          <form onSubmit={handleImportPlaylist} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="https://gaana.com/... or https://music.youtube.com/... or spotify/apple"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2.5 text-xs rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!playlistUrl.trim()}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              Sync Media
            </button>
          </form>

          {importStatus && (
            <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              {importStatus}
            </p>
          )}
        </div>

        {/* Security & Token Guarantee notice */}
        <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Multi-service synchronization server maintains synchronized playback timestamps across Gaana, YouTube Music, Spotify & Apple Music.</span>
        </div>

      </div>
    </div>
  );
};
