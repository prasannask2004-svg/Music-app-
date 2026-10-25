import React, { useState } from 'react';
import { AudioPlayerProvider, useAudioPlayer } from './context/AudioPlayerContext';
import { Navbar } from './components/Navbar';
import { Visualizer } from './components/Visualizer';
import { VideoStage } from './components/VideoStage';
import { CollaborativeRoom } from './components/CollaborativeRoom';
import { CatalogBrowser } from './components/CatalogBrowser';
import { PlayerBar } from './components/PlayerBar';
import { ConnectPlatformsModal } from './components/ConnectPlatformsModal';
import { InstallAppModal } from './components/InstallAppModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { Music2, Video, Users2, Sparkles, Radio, Disc3, ShieldCheck } from 'lucide-react';

function MainAppContent() {
  const {
    playbackMode,
    themeStyle,
    roomId,
    participants,
    currentTrack
  } = useAudioPlayer();

  const [activeTab, setActiveTab] = useState<'stage' | 'catalog' | 'room' | 'connect'>('stage');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Dynamic Theme Atmosphere
  const getThemeBackground = () => {
    switch (themeStyle) {
      case 'gaana':
        return 'from-[#1a0409] via-[#0d0306] to-[#060103]';
      case 'ytmusic':
        return 'from-[#1a0303] via-[#0d0202] to-[#060101]';
      case 'spotify':
        return 'from-[#04120b] via-[#060a0f] to-[#03060a]';
      case 'apple':
        return 'from-[#14060b] via-[#09060d] to-[#04040a]';
      case 'aura':
      default:
        return 'from-[#080d1a] via-[#090b14] to-[#05070d]';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getThemeBackground()} text-slate-100 flex flex-col pb-28 transition-colors duration-700`}>
      
      {/* Dynamic Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 transition-all duration-1000"
          style={{
            backgroundColor:
              themeStyle === 'gaana'
                ? '#e11d48'
                : themeStyle === 'ytmusic'
                ? '#ff0000'
                : themeStyle === 'spotify'
                ? '#10b981'
                : themeStyle === 'apple'
                ? '#fb7185'
                : currentTrack.accentColor || '#06b6d4'
          }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 transition-all duration-1000"
          style={{
            backgroundColor:
              themeStyle === 'gaana'
                ? '#be123c'
                : themeStyle === 'ytmusic'
                ? '#dc2626'
                : themeStyle === 'spotify'
                ? '#059669'
                : themeStyle === 'apple'
                ? '#e11d48'
                : '#a855f7'
          }}
        />
      </div>

      {/* Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-8">
        
        {/* Render Tab Contents */}
        {activeTab === 'stage' && (
          <div className="flex flex-col gap-8">
            {/* Stage: Either Audio Visualizer or Cinema Video */}
            {playbackMode === 'video' ? <VideoStage /> : <Visualizer />}

            {/* Quick Collaborative Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left: Synchronized Lounge Preview */}
              <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Lounge Session: {roomId}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('room')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Open Full Lounge →
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  You are listening together in real-time with {participants.length} connected members. Every track change, seek, and pause is automatically synchronized across all devices.
                </p>

                {/* Active Listeners Quick Strip */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {participants.slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium"
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950"
                        style={{ backgroundColor: p.color || '#06b6d4' }}
                      >
                        {p.avatar || '🎧'}
                      </span>
                      <span className="truncate max-w-[100px]">{p.name}</span>
                    </div>
                  ))}
                  {participants.length > 6 && (
                    <span className="text-xs text-slate-500 font-mono">
                      +{participants.length - 6} more
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setActiveTab('room')}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all cursor-pointer"
                  >
                    Manage Shared Queue & Reactions
                  </button>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-all cursor-pointer"
                  >
                    Browse Music Catalog
                  </button>
                </div>
              </div>

              {/* Right: Connect Platforms Banner */}
              <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Connected Services
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Spotify & Apple Music Gateway
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Aura Beats unifies metadata, audio playback, and official music videos from both platforms into a frictionless synchronized listening room.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-300 font-medium">Spotify & Apple Linked</span>
                  </div>
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/15 transition-all cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <CatalogBrowser />
        )}

        {activeTab === 'room' && (
          <CollaborativeRoom />
        )}

      </main>

      {/* Persistent Bottom Frosted Glass Player Bar */}
      <PlayerBar onToggleQueueDrawer={() => setActiveTab('room')} />

      {/* Spotify & Apple Music Connection Modal */}
      <ConnectPlatformsModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      {/* Android Install & APK Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Gemini AI Music Assistant Floating Drawer */}
      <AIAssistantDrawer />

    </div>
  );
}

export default function App() {
  return (
    <AudioPlayerProvider>
      <MainAppContent />
    </AudioPlayerProvider>
  );
}
