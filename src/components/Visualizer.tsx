import React, { useRef, useEffect, useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { VisualizerMode } from '../types';
import { Disc3, Sparkles, BarChart2, CircleDot, Activity, Heart, Share2, Plus } from 'lucide-react';

export const Visualizer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    position,
    visualizerData,
    addToQueue
  } = useAudioPlayer();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visMode, setVisMode] = useState<VisualizerMode>('bars');
  const [isLiked, setIsLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Find active lyric line
  const activeLyricIndex = currentTrack.lyrics?.findIndex((line, i, arr) => {
    const nextLine = arr[i + 1];
    if (!nextLine) return position >= line.time;
    return position >= line.time && position < nextLine.time;
  }) ?? -1;

  // Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const data = visualizerData || new Uint8Array(64);
      const accent = currentTrack.accentColor || '#06b6d4';

      if (visMode === 'bars') {
        const barCount = 48;
        const totalBarWidth = width / barCount;
        const barWidth = Math.max(3, totalBarWidth - 4);

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor((i / barCount) * data.length);
          const val = data[dataIndex] || 0;
          const barHeight = Math.max(4, (val / 255) * (height * 0.75));

          const x = i * totalBarWidth + (totalBarWidth - barWidth) / 2;
          const y = height - barHeight;

          // Gradient for neon glow
          const gradient = ctx.createLinearGradient(0, height, 0, y);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
          gradient.addColorStop(0.5, accent);
          gradient.addColorStop(1, '#ffffff');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          // Peak cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, Math.max(0, y - 3), barWidth, 2);
        }
      } else if (visMode === 'circle') {
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.22;
        const barCount = 64;

        ctx.save();
        ctx.translate(centerX, centerY);

        for (let i = 0; i < barCount; i++) {
          const angle = (i / barCount) * Math.PI * 2;
          const dataIndex = Math.floor((i / barCount) * data.length);
          const val = data[dataIndex] || 0;
          const barLength = Math.max(4, (val / 255) * 60);

          const x1 = Math.cos(angle) * baseRadius;
          const y1 = Math.sin(angle) * baseRadius;
          const x2 = Math.cos(angle) * (baseRadius + barLength);
          const y2 = Math.sin(angle) * (baseRadius + barLength);

          ctx.strokeStyle = accent;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 12;
          ctx.shadowColor = accent;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius - 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      } else if (visMode === 'wave') {
        // Multi-layered oscilloscope wave
        const sliceWidth = width / data.length;

        for (let layer = 0; layer < 2; layer++) {
          ctx.beginPath();
          ctx.lineWidth = layer === 0 ? 3 : 1.5;
          ctx.strokeStyle = layer === 0 ? accent : '#a855f7';
          ctx.shadowBlur = layer === 0 ? 15 : 8;
          ctx.shadowColor = accent;

          let x = 0;
          for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128.0;
            const y = (v * height) / 2.5 + (height * 0.3) + (layer * 12);

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [visMode, visualizerData, currentTrack]);

  return (
    <div className="relative w-full rounded-3xl glass-card-spotlight border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Dynamic Ambient Background Blur */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25 transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.accentColor || '#06b6d4' }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.platform === 'apple' ? '#fb7185' : '#a855f7' }}
      />

      {/* Header controls & visualizer selector */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
            High Fidelity Pure Audio Stage
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Live Spectrum Analyzer
          </h2>
        </div>

        {/* Visualizer Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
          <button
            onClick={() => setVisMode('bars')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              visMode === 'bars'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Bars</span>
          </button>
          <button
            onClick={() => setVisMode('circle')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              visMode === 'circle'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Radial</span>
          </button>
          <button
            onClick={() => setVisMode('wave')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              visMode === 'wave'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Wave</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Rotating Vinyl Album Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          <div className="relative group cursor-pointer mb-6">
            {/* Spinning Vinyl Record behind cover */}
            <div
              className={`absolute top-0 right-0 w-56 h-56 md:w-64 md:h-64 rounded-full bg-slate-950 border-4 border-slate-900 shadow-2xl transition-transform duration-700 ease-out flex items-center justify-center ${
                isPlaying ? 'translate-x-14 md:translate-x-20 rotate-[360deg]' : 'translate-x-4 rotate-0'
              }`}
              style={{
                transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                animation: isPlaying ? 'spin 12s linear infinite' : 'none'
              }}
            >
              {/* Vinyl grooves */}
              <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border border-white/5 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-cyan-950/40">
                    <Disc3 className="w-8 h-8 text-cyan-400 opacity-80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Front Album Sleeve Card */}
            <div className="relative z-10 w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Platform badge overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  currentTrack.platform === 'spotify'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : currentTrack.platform === 'apple'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {currentTrack.platform === 'spotify' ? 'Spotify' : currentTrack.platform === 'apple' ? 'Apple Music' : 'Aura Master'}
                </span>
              </div>
            </div>
          </div>

          {/* Title and Unboxed Metadata */}
          <div className="max-w-xs">
            <h3 className="text-xl font-bold text-white tracking-tight truncate">
              {currentTrack.title}
            </h3>
            <p className="text-sm text-slate-300 font-medium truncate mt-0.5">
              {currentTrack.artist}
            </p>
            
            {/* Unboxed metadata with typographic separators */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
              <span>{currentTrack.album}</span>
              <span aria-hidden="true">·</span>
              <span>{currentTrack.genre}</span>
              {currentTrack.bpm && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{currentTrack.bpm} BPM</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Track Action Row */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                showToast(isLiked ? 'Removed from favorites' : 'Saved to favorites');
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10'
              }`}
              title="Favorite track"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
            </button>
            <button
              onClick={() => {
                addToQueue(currentTrack);
                showToast('Added copy to lounge queue');
              }}
              className="p-2.5 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Add to shared queue"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Lounge share link copied to clipboard!');
              }}
              className="p-2.5 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Share track"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Dynamic Canvas Visualizer & Synced Lyrics */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Audio Canvas Container */}
          <div className="relative w-full h-56 md:h-64 rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center p-4">
            <canvas
              ref={canvasRef}
              width={640}
              height={260}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Synchronized Lyrics Container */}
          <div className="glass-panel-subtle rounded-2xl p-4 md:p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Live Synchronized Lyrics
              </span>
              <span className="text-[11px] font-mono text-cyan-400/80">
                {currentTrack.lyrics?.length ? 'Synced with Lounge' : 'Instrumental'}
              </span>
            </div>

            <div className="h-28 overflow-y-auto space-y-2 pr-2 scroll-smooth">
              {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                currentTrack.lyrics.map((line, idx) => {
                  const isActive = idx === activeLyricIndex;
                  return (
                    <p
                      key={idx}
                      className={`text-sm md:text-base font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-cyan-300 font-bold scale-[1.01] translate-x-1'
                          : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {line.text}
                    </p>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-500 italic">
                  Instrumental track playing. Enjoy the frequency flow.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-6 z-50 px-4 py-2 rounded-xl bg-cyan-950/90 text-cyan-200 border border-cyan-500/40 text-xs font-medium shadow-2xl backdrop-blur-xl animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
