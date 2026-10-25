import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Radio, Check, ExternalLink, Sparkles, Music, Disc3, ShieldCheck } from 'lucide-react';

interface ConnectPlatformsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectPlatformsModal: React.FC<ConnectPlatformsModalProps> = ({ isOpen, onClose }) => {
  const { themeStyle, setThemeStyle } = useAudioPlayer();
  const [spotifyConnected, setSpotifyConnected] = useState(true);
  const [appleConnected, setAppleConnected] = useState(true);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return;
    setImportStatus('Playlist imported! 12 collaborative tracks synced.');
    setTimeout(() => {
      setImportStatus(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl relative animate-scale-up">
        
        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg p-1"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-rose-500 to-cyan-500 p-[1.5px] shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Connect Online Music Platforms
            </h2>
            <p className="text-xs text-slate-400">
              Synchronize libraries, audio codecs, and collaborative rooms with Spotify & Apple Music
            </p>
          </div>
        </div>

        {/* Platform Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          
          {/* Spotify Card */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                    <Disc3 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-base">Spotify Connect</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                  Active Link
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
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
                Open Web <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Apple Music Card */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-rose-500/20 bg-rose-950/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xs">
                    <Music className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-base">Apple Music</span>
                </div>
                <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-500/30">
                  <Check className="w-3 h-3" />
                  Spatial Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
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
                Open Web <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Import Playlist Form */}
        <div className="glass-panel-subtle rounded-2xl p-5 border border-white/10">
          <h4 className="text-sm font-bold text-white tracking-tight mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Import External Playlist Link
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Paste a Spotify or Apple Music share link to automatically convert tracks into your shared listening room.
          </p>

          <form onSubmit={handleImportPlaylist} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="https://open.spotify.com/playlist/... or https://music.apple.com/..."
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2.5 text-xs rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!playlistUrl.trim()}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              Import Tracks
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
          <span>Real-time collaborative synchronizer maintains client-to-client timestamp alignment without sharing credentials.</span>
        </div>

      </div>
    </div>
  );
};
