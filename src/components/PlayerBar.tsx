import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { EqualizerPreset } from '../types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Music2,
  Video,
  Sliders,
  ListMusic
} from 'lucide-react';

interface PlayerBarProps {
  onToggleQueueDrawer?: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ onToggleQueueDrawer }) => {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    togglePlay,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    nextTrack,
    prevTrack,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
    playbackMode,
    setPlaybackMode,
    equalizerPreset,
    setEqualizerPreset
  } = useAudioPlayer();

  const [showEqModal, setShowEqModal] = useState(false);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const eqPresets: { id: EqualizerPreset; label: string }[] = [
    { id: 'flat', label: 'Flat' },
    { id: 'bass', label: 'Bass Boost' },
    { id: 'electronic', label: 'Electronic Neon' },
    { id: 'vocal', label: 'Vocal Presence' },
    { id: 'acoustic', label: 'Acoustic Warmth' },
    { id: 'treble', label: 'Treble Crisp' }
  ];

  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 glass-panel border-t border-white/10 px-4 md:px-8 py-3 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        
        {/* Left Section: Active Track Info */}
        <div className="flex items-center gap-3.5 w-full md:w-1/4 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md shrink-0 border border-white/10 bg-slate-900">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {currentTrack.tamilTitle ? `${currentTrack.tamilTitle} · ` : ''}{currentTrack.tamilArtist || currentTrack.artist}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                currentTrack.platform === 'gaana'
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  : currentTrack.platform === 'ytmusic'
                  ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                  : currentTrack.platform === 'spotify'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : currentTrack.platform === 'apple'
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-cyan-400 bg-cyan-500/10'
              }`}>
                {currentTrack.platform === 'gaana'
                  ? 'Gaana'
                  : currentTrack.platform === 'ytmusic'
                  ? 'YouTube Music'
                  : currentTrack.platform === 'spotify'
                  ? 'Spotify'
                  : currentTrack.platform === 'apple'
                  ? 'Apple Music'
                  : 'Aura Master'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Playback Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
          <div className="flex items-center gap-3 md:gap-5">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-1.5 transition-colors cursor-pointer ${
                shuffle ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Skip Back 10s */}
            <button
              onClick={() => seek(Math.max(0, position - 10))}
              className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Previous Track */}
            <button
              onClick={prevTrack}
              className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-all scale-100 hover:scale-105 active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 ml-0.5 fill-current" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={nextTrack}
              className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Skip Forward 10s */}
            <button
              onClick={() => seek(Math.min(duration, position + 10))}
              className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`p-1.5 transition-colors cursor-pointer ${
                repeat ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Scrubber */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono tabular-nums text-slate-400 w-10 text-right shrink-0">
              {formatTime(position)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={position}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-[11px] font-mono tabular-nums text-slate-500 w-10 text-left shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Section: Mode Switch, Equalizer & Volume */}
        <div className="flex items-center justify-end gap-3 w-full md:w-1/4">
          
          {/* Mode Switch (Audio vs Video) */}
          <button
            onClick={() => setPlaybackMode(playbackMode === 'audio' ? 'video' : 'audio')}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
            title="Toggle Audio / Video Mode"
          >
            {playbackMode === 'video' ? (
              <>
                <Video className="w-4 h-4 text-rose-400" />
                <span className="hidden lg:inline text-rose-300 font-semibold">Video</span>
              </>
            ) : (
              <>
                <Music2 className="w-4 h-4 text-cyan-400" />
                <span className="hidden lg:inline text-cyan-300 font-semibold">Audio</span>
              </>
            )}
          </button>

          {/* Equalizer Preset Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowEqModal(!showEqModal)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Audio Equalizer"
            >
              <Sliders className="w-4 h-4 text-purple-400" />
            </button>

            {/* Equalizer Popover */}
            {showEqModal && (
              <div className="absolute bottom-12 right-0 w-52 glass-panel rounded-2xl p-3 border border-white/15 shadow-2xl z-50">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Equalizer Profile
                </span>
                <div className="space-y-1">
                  {eqPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setEqualizerPreset(preset.id);
                        setShowEqModal(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        equalizerPreset === preset.id
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {equalizerPreset === preset.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 md:w-20"
            />
          </div>

        </div>

      </div>
    </footer>
  );
};
