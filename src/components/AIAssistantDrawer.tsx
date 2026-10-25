import React, { useState, useRef, useEffect } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { INITIAL_TRACKS } from '../data/catalog';
import { Sparkles, Send, Bot, Play, Music, MessageSquare, ChevronRight, X, Languages } from 'lucide-react';

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedTrackId?: string;
  timestamp: number;
}

export const AIAssistantDrawer: React.FC = () => {
  const { currentTrack, setTrack } = useAudioPlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `வணக்கம்! I am **Aura AI (இசை உதவியாளர்)**, your music companion and Tamil lyricist.\n\nI can explain poetic Tamil lyrics (கவிதை வரிகள்), analyze musical emotions (ராகம் & பாவம்), recommend Tamil melodies, or translate song meanings for you. Ask me anything about the music!`,
      timestamp: Date.now()
    }
  ]);

  const quickPrompts = [
    { label: '📜 Explain Tamil Lyrics', prompt: 'Explain the Tamil lyrics and poetic meaning of the current track.' },
    { label: '🔥 Gaana Trending Hits', prompt: 'Recommend top trending Indian multilingual hits from Gaana in Tamil, Hindi, and Telugu.' },
    { label: '▶️ YouTube Music MVs', prompt: 'What are the top YouTube Music trending songs and music videos across languages?' },
    { label: '✨ தமிழ் வரிகள் விளக்கம்', prompt: 'இப்போது ஒலிக்கும் பாடலின் வரிகளை தமிழில் விளக்கமாக கூறுங்கள்.' },
    { label: '💖 Emotion & Raga Vibe', prompt: 'What is the emotional tone, raga feel, and musical vibe of this song?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isLoading) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          currentTrack
        })
      });

      const data = await response.json();

      const assistantMsg: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is your music guidance.',
        suggestedTrackId: data.suggestedTrackId,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI assistant fetch error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `இசையின் நயத்தை அறிய என்னால் இயன்றவரை உதவுகிறேன். (I am here to help you enjoy Tamil music and explore lyrical depth.)`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 md:right-8 z-40 px-4 py-2.5 rounded-2xl glass-panel-interactive border border-cyan-500/40 shadow-xl shadow-cyan-950/60 flex items-center gap-2.5 cursor-pointer group bg-gradient-to-r from-cyan-950/70 via-slate-900/80 to-purple-950/70 backdrop-blur-2xl"
        title="Open AI Music Assistant"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/30">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>Aura AI Assistant</span>
            <span className="text-[10px] font-normal text-cyan-300">தமிழ்</span>
          </p>
          <p className="text-[10px] text-slate-400">இசை உதவியாளர் · Lyrics & Ragas</p>
        </div>
      </button>

      {/* Slide-out Glass Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="glass-panel w-full max-w-md h-full flex flex-col border-l border-white/15 shadow-2xl relative animate-slide-left">
            
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Aura AI Music Assistant</span>
                    <span className="text-[11px] font-normal text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      தமிழ் v2.1
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    இசை உதவியாளர் · Powered by Gemini
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.prompt)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-200 text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                const suggested = m.suggestedTrackId
                  ? INITIAL_TRACKS.find((t) => t.id === m.suggestedTrackId)
                  : null;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-50 rounded-br-none'
                          : 'glass-panel-subtle border border-white/10 text-slate-200 rounded-bl-none shadow-lg'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">
                        {m.text}
                      </div>

                      {/* Interactive Track Suggestion Card */}
                      {suggested && (
                        <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-cyan-500/30 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={suggested.coverUrl}
                              alt={suggested.title}
                              className="w-9 h-9 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">
                                {suggested.title}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {suggested.tamilTitle || suggested.artist}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setTrack(suggested)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-sm"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 italic p-3 glass-panel-subtle rounded-2xl max-w-[70%]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Aura AI is thinking in Tamil & English...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask about Tamil lyrics, meanings, songs..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 hover:opacity-90 disabled:opacity-40 text-slate-950 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md"
                  title="Send to assistant"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
