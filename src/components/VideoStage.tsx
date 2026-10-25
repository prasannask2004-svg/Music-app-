import React, { useRef, useEffect, useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Music2, Sparkles } from 'lucide-react';

export const VideoStage: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    togglePlay,
    seek,
    volume,
    isMuted,
    toggleMute,
    setPlaybackMode
  } = useAudioPlayer();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);

  // Sync video time with global player position
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const delta = Math.abs(video.currentTime - position);
    if (delta > 0.8) {
      video.currentTime = position;
    }

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [position, isPlaying]);

  // Sync volume with player state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle autohide controls in fullscreen
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full rounded-3xl overflow-hidden glass-card-spotlight border border-white/10 shadow-2xl bg-black group transition-all"
    >
      {/* Ambient Cinema Lighting Backlight */}
      <div
        className="absolute -inset-4 opacity-40 blur-3xl pointer-events-none transition-colors duration-1000 -z-10"
        style={{ backgroundColor: currentTrack.accentColor || '#06b6d4' }}
      />

      {/* Video Element */}
      <div className="relative aspect-video w-full flex items-center justify-center bg-black/90">
        {currentTrack.videoUrl ? (
          <video
            ref={videoRef}
            src={currentTrack.videoUrl}
            playsInline
            loop
            muted={isMuted}
            className="w-full h-full object-cover"
            onClick={togglePlay}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Music2 className="w-12 h-12 text-cyan-400 mb-3 animate-pulse" />
            <p className="text-base font-medium text-slate-200">
              Music video stream not available for this track
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Switching back to high-res audio spectrum visualizer
            </p>
            <button
              onClick={() => setPlaybackMode('audio')}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all cursor-pointer"
            >
              Back to Audio Mode
            </button>
          </div>
        )}

        {/* Ambient Top Bar Over Video */}
        <div
          className={`absolute top-0 inset-x-0 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                Synchronized Cinema Video
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5 truncate max-w-md">
              {currentTrack.title}
            </h2>
            <p className="text-xs text-slate-300">
              {currentTrack.artist} · {currentTrack.album}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaybackMode('audio')}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Music2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audio Spectrum</span>
            </button>
          </div>
        </div>

        {/* Floating Center Play Button When Paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-500/80 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl transition-all scale-100 hover:scale-110 cursor-pointer backdrop-blur-sm"
          >
            <Play className="w-7 h-7 ml-1 fill-current" />
          </button>
        )}

        {/* Video Scrubber & Bottom Controls HUD */}
        <div
          className={`absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 flex flex-col gap-2 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Timeline slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tabular-nums text-slate-300">
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
            <span className="text-xs font-mono tabular-nums text-slate-400">
              {formatTime(duration)}
            </span>
          </div>

          {/* Bottom actions row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-2 text-white hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
                HD 1080p · Spatial Audio
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
