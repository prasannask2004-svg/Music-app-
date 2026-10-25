import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Radio, Music2, Video, Users2, Sparkles, SlidersHorizontal, Smartphone } from 'lucide-react';

interface NavbarProps {
  activeTab: 'stage' | 'catalog' | 'room' | 'connect';
  setActiveTab: (tab: 'stage' | 'catalog' | 'room' | 'connect') => void;
  onOpenConnectModal: () => void;
  onOpenInstallModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConnectModal,
  onOpenInstallModal
}) => {
  const {
    roomId,
    participants,
    playbackMode,
    setPlaybackMode,
    themeStyle,
    setThemeStyle,
    connectionStatus
  } = useAudioPlayer();

  const getThemeAccent = () => {
    switch (themeStyle) {
      case 'gaana': return 'text-rose-400 border-rose-500/30';
      case 'ytmusic': return 'text-red-400 border-red-500/30';
      case 'spotify': return 'text-emerald-400 border-emerald-500/30';
      case 'apple': return 'text-rose-400 border-rose-500/30';
      case 'aura':
      default: return 'text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-6 py-3.5 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-rose-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('stage')} 
              className="text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors whitespace-nowrap cursor-pointer text-left"
            >
              Aura Beats
            </button>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded-md hidden sm:inline-block">
              v2.1
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-Line) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('stage')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'stage'
                ? 'text-white border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            {playbackMode === 'video' ? <Video className="w-4 h-4" /> : <Music2 className="w-4 h-4" />}
            <span>Now Playing</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'text-white border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Music Catalog
          </button>

          <button
            onClick={() => setActiveTab('room')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'room'
                ? 'text-white border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Users2 className="w-4 h-4" />
            <span>Sync Lounge</span>
            <span className="text-xs text-cyan-400 font-mono tabular-nums">({participants.length})</span>
          </button>

          <button
            onClick={onOpenConnectModal}
            className="whitespace-nowrap shrink-0 transition-colors text-slate-400 hover:text-slate-200 pb-0.5 border-b-2 border-transparent cursor-pointer flex items-center gap-1.5"
          >
            <Radio className="w-4 h-4 text-rose-400" />
            <span>Connect Apps & Servers</span>
          </button>

          <button
            onClick={onOpenInstallModal}
            className="whitespace-nowrap shrink-0 transition-colors text-cyan-400 hover:text-cyan-300 pb-0.5 border-b-2 border-transparent cursor-pointer flex items-center gap-1.5 font-medium"
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Install / APK</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Lounge Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mode Switch Button (Audio vs Video) */}
          <div className="hidden sm:flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setPlaybackMode('audio')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                playbackMode === 'audio'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Audio Spectrum Mode"
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
            <button
              onClick={() => setPlaybackMode('video')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                playbackMode === 'video'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Music Video Mode"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
          </div>

          {/* Room Lounge Pill indicator */}
          <button
            onClick={() => setActiveTab('room')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-sm shadow-cyan-950"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono tracking-wider">{roomId}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
