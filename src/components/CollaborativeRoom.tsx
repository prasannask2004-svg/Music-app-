import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Users2, Crown, Send, ThumbsUp, Trash2, Copy, Check, Plus, Radio, MessageSquare, Flame } from 'lucide-react';

export const CollaborativeRoom: React.FC = () => {
  const {
    roomId,
    roomName,
    isHost,
    participants,
    queue,
    chat,
    reactions,
    joinRoom,
    removeFromQueue,
    upvoteQueue,
    sendReaction,
    sendChatMessage,
    currentTrack,
    setTrack
  } = useAudioPlayer();

  const [inputRoomId, setInputRoomId] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const reactionEmojis = ['🔥', '💖', '⚡', '🎵', '🚀', '🎧', '🧊', '✨'];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoomId.trim()) {
      joinRoom(inputRoomId.trim());
      setInputRoomId('');
      setShowJoinModal(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  return (
    <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Floating Reactions Overlay (drift upwards across screen) */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {reactions.slice(0, 10).map((rx) => (
          <div
            key={rx.id}
            className="absolute bottom-28 animate-float-fade text-3xl select-none"
            style={{
              left: `${20 + (parseInt(rx.id.slice(-2), 16) % 65)}%`,
              animationDuration: '2.8s',
              animationTimingFunction: 'ease-out'
            }}
          >
            <div className="flex flex-col items-center">
              <span>{rx.emoji}</span>
              <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm -mt-1">
                {rx.userName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Left Column: Room Overview, Active Listeners & Shared Queue */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Room Header Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Live Synced Lounge
                </span>
                {isHost && (
                  <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    Host DJ
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                {roomName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Room Code: <span className="font-mono text-cyan-300 font-semibold">{roomId}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Link Copied' : 'Invite Link'}</span>
              </button>

              <button
                onClick={() => setShowJoinModal(true)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer whitespace-nowrap"
              >
                Switch Room
              </button>
            </div>
          </div>

          {/* Active Listeners Strip */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-cyan-400" />
                Active Listeners ({participants.length})
              </span>
              <span className="text-xs text-slate-500">
                Synchronized playback active
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {participants.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 shadow-sm"
                    style={{ backgroundColor: user.color || '#06b6d4' }}
                  >
                    {user.avatar || '🎧'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  {user.isHost && (
                    <span title="Room Host">
                      <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Reaction Sparks Bar */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Send reaction spark:
            </span>
            <div className="flex items-center gap-1.5">
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 hover:scale-110 active:scale-95 border border-white/10 transition-all text-base flex items-center justify-center cursor-pointer"
                  title={`Send ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shared Collaborative Queue */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Shared Lounge Queue
              </h3>
              <p className="text-xs text-slate-400">
                Upvote your favorite tracks to push them to the top
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {queue.length} upcoming
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {queue.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 text-slate-400">
                <Radio className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium">The shared queue is empty</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse the catalog to add tracks to this collaborative session
                </p>
              </div>
            ) : (
              queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center text-xs font-mono text-slate-500 shrink-0">
                      #{idx + 1}
                    </span>
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {track.artist} · <span className="font-mono">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Upvote button */}
                    <button
                      onClick={() => upvoteQueue(track.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold cursor-pointer transition-all active:scale-95"
                      title="Upvote track"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-mono">{track.upvotes || 0}</span>
                    </button>

                    {/* Host Play Now action */}
                    {isHost && (
                      <button
                        onClick={() => {
                          setTrack(track);
                          removeFromQueue(track.id);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-slate-200 cursor-pointer transition-all hidden sm:inline-block"
                      >
                        Play Next
                      </button>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromQueue(track.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove track"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Right Column: Live Lounge Chat */}
      <div className="lg:col-span-5 flex flex-col h-full min-h-[500px]">
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Lounge Discussion
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Live Feed
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {chat.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6">
                <p className="text-sm">No messages yet.</p>
                <p className="text-xs mt-1">Say hello to other listeners in the room!</p>
              </div>
            ) : (
              chat.map((msg) => (
                <div key={msg.id} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold truncate max-w-[140px]"
                      style={{ color: msg.userColor || '#38bdf8' }}
                    >
                      {msg.userName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-sm text-slate-200 break-words leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleChatSubmit} className="pt-3 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Chat with listeners..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Switch Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/15 shadow-2xl animate-scale-up">
            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              Join or Create a Lounge
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Enter any room ID to connect with your friends in real-time. If the room doesn't exist, it will be created for you as host.
            </p>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Lounge Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. LOUNGE-AURA or PARTY-2026"
                  value={inputRoomId}
                  onChange={(e) => setInputRoomId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 uppercase"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inputRoomId.trim()}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 transition-all cursor-pointer font-medium"
                >
                  Enter Lounge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
