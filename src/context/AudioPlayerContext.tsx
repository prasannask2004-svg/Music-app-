import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Track, RoomState, RoomParticipant, ChatMessage, ReactionEvent, MediaMode, EqualizerPreset } from '../types';
import { INITIAL_TRACKS } from '../data/catalog';

interface AudioPlayerContextType {
  // Current playback state
  currentTrack: Track;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackMode: MediaMode;
  visualizerData: Uint8Array | null;
  equalizerPreset: EqualizerPreset;
  shuffle: boolean;
  repeat: boolean;
  themeStyle: 'aura' | 'spotify' | 'apple' | 'gaana' | 'ytmusic';

  // Room & collaboration state
  roomId: string;
  roomName: string;
  isHost: boolean;
  participants: RoomParticipant[];
  queue: Track[];
  chat: ChatMessage[];
  reactions: ReactionEvent[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected';

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackMode: (mode: MediaMode) => void;
  setTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setEqualizerPreset: (preset: EqualizerPreset) => void;
  setThemeStyle: (style: 'aura' | 'spotify' | 'apple' | 'gaana' | 'ytmusic') => void;

  // Room actions
  joinRoom: (newRoomId: string) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  upvoteQueue: (trackId: string) => void;
  sendReaction: (emoji: string) => void;
  sendChatMessage: (text: string) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

const STORAGE_USER_ID = 'aura_user_id';
const STORAGE_USER_NAME = 'aura_user_name';

function getOrSetUserId(): string {
  let uid = localStorage.getItem(STORAGE_USER_ID);
  if (!uid) {
    uid = `user-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_USER_ID, uid);
  }
  return uid;
}

function getOrSetUserName(): string {
  let uname = localStorage.getItem(STORAGE_USER_NAME);
  if (!uname) {
    const names = ['EchoDancer', 'NeonVoyager', 'AuraSonic', 'CyberVelvet', 'NovaListener', 'PrismWave'];
    uname = `${names[Math.floor(Math.random() * names.length)]}-${Math.floor(100 + Math.random() * 900)}`;
    localStorage.setItem(STORAGE_USER_NAME, uname);
  }
  return uname;
}

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrackState] = useState<Track>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_TRACKS[0].duration);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackMode, setPlaybackModeState] = useState<MediaMode>('audio');
  const [equalizerPreset, setEqualizerPresetState] = useState<EqualizerPreset>('electronic');
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [themeStyle, setThemeStyle] = useState<'aura' | 'spotify' | 'apple' | 'gaana' | 'ytmusic'>('aura');

  // Room state
  const [roomId, setRoomId] = useState<string>('LOUNGE-AURA');
  const [roomName, setRoomName] = useState<string>('Cosmic Chill Lounge');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [queue, setQueue] = useState<Track[]>([INITIAL_TRACKS[1], INITIAL_TRACKS[2], INITIAL_TRACKS[3]]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<ReactionEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Audio & Web Audio API refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [visualizerData, setVisualizerData] = useState<Uint8Array | null>(null);

  // WebSocket ref
  const wsRef = useRef<WebSocket | null>(null);
  const userId = useRef<string>(getOrSetUserId());
  const userName = useRef<string>(getOrSetUserName());

  // Web Audio Context initialization
  const initAudioNodes = useCallback(() => {
    if (!audioRef.current) return;
    if (audioContextRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.85;
      analyserRef.current = analyser;

      // EQ Filters
      const bass = ctx.createBiquadFilter();
      bass.type = 'lowshelf';
      bass.frequency.value = 250;
      bassFilterRef.current = bass;

      const mid = ctx.createBiquadFilter();
      mid.type = 'peaking';
      mid.frequency.value = 1000;
      mid.Q.value = 1;
      midFilterRef.current = mid;

      const treble = ctx.createBiquadFilter();
      treble.type = 'highshelf';
      treble.frequency.value = 4000;
      trebleFilterRef.current = treble;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      // Connect: source -> bass -> mid -> treble -> analyser -> destination
      source.connect(bass);
      bass.connect(mid);
      mid.connect(treble);
      treble.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio API initialized in fallback mode', e);
    }
  }, []);

  // Update EQ based on preset
  useEffect(() => {
    if (!bassFilterRef.current || !midFilterRef.current || !trebleFilterRef.current) return;
    switch (equalizerPreset) {
      case 'bass':
        bassFilterRef.current.gain.value = 8;
        midFilterRef.current.gain.value = 0;
        trebleFilterRef.current.gain.value = -2;
        break;
      case 'electronic':
        bassFilterRef.current.gain.value = 6;
        midFilterRef.current.gain.value = -1;
        trebleFilterRef.current.gain.value = 5;
        break;
      case 'vocal':
        bassFilterRef.current.gain.value = -2;
        midFilterRef.current.gain.value = 6;
        trebleFilterRef.current.gain.value = 2;
        break;
      case 'acoustic':
        bassFilterRef.current.gain.value = 2;
        midFilterRef.current.gain.value = 3;
        trebleFilterRef.current.gain.value = 4;
        break;
      case 'treble':
        bassFilterRef.current.gain.value = -4;
        midFilterRef.current.gain.value = 1;
        trebleFilterRef.current.gain.value = 7;
        break;
      case 'flat':
      default:
        bassFilterRef.current.gain.value = 0;
        midFilterRef.current.gain.value = 0;
        trebleFilterRef.current.gain.value = 0;
        break;
    }
  }, [equalizerPreset]);

  // Audio instance & position ticker
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audio.src = currentTrack.audioUrl;
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentTrack.duration);
    };

    const handleTimeUpdate = () => {
      setPosition(audio.currentTime);
    };

    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        // Skip to next track from queue or catalog
        nextTrack();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Visualizer loop
  useEffect(() => {
    let animId: number;
    const updateSpectrum = () => {
      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        setVisualizerData(dataArray);
      } else if (!isPlaying) {
        // Idle spectrum wave
        const idleArray = new Uint8Array(64);
        for (let i = 0; i < 64; i++) {
          idleArray[i] = Math.floor(Math.sin((Date.now() / 300) + (i / 4)) * 12 + 18);
        }
        setVisualizerData(idleArray);
      }
      animId = requestAnimationFrame(updateSpectrum);
    };

    animId = requestAnimationFrame(updateSpectrum);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // WebSocket Connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    let socket: WebSocket;
    let heartbeatInterval: any;

    const connect = () => {
      setConnectionStatus('connecting');
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setConnectionStatus('connected');
        // Join active room
        socket.send(JSON.stringify({
          type: 'join_room',
          payload: {
            roomId,
            userId: userId.current,
            userName: userName.current,
            avatar: '🎧'
          }
        }));

        // Heartbeat for clock sync
        heartbeatInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'ping',
              payload: { clientTimestamp: Date.now() }
            }));
          }
        }, 15000);
      };

      socket.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);

          switch (type) {
            case 'room_state': {
              const room: RoomState = payload;
              setRoomName(room.name || `Lounge ${room.id}`);
              setParticipants(room.participants || []);
              setQueue(room.queue || []);
              setChat(room.chat || []);
              if (room.playbackMode) setPlaybackModeState(room.playbackMode);

              const userIsHost = room.hostId === userId.current;
              setIsHost(userIsHost);

              if (room.currentTrack) {
                setCurrentTrackState(room.currentTrack);
                setDuration(room.currentTrack.duration);

                if (audioRef.current && audioRef.current.src !== room.currentTrack.audioUrl) {
                  audioRef.current.src = room.currentTrack.audioUrl;
                }

                // Synchronize playback position with clock drift calculation
                const elapsedSinceUpdate = (Date.now() - room.lastUpdated) / 1000;
                const calculatedPos = room.isPlaying
                  ? Math.min(room.playbackPosition + elapsedSinceUpdate, room.currentTrack.duration)
                  : room.playbackPosition;

                setPosition(calculatedPos);
                if (audioRef.current) {
                  audioRef.current.currentTime = calculatedPos;
                  if (room.isPlaying) {
                    audioRef.current.play().catch(() => {});
                    setIsPlaying(true);
                  } else {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  }
                }
              }
              break;
            }

            case 'sync_playback': {
              const { isPlaying: remotePlaying, playbackPosition, lastUpdated } = payload;
              const elapsed = (Date.now() - lastUpdated) / 1000;
              const targetPos = remotePlaying ? playbackPosition + elapsed : playbackPosition;

              if (audioRef.current) {
                const delta = Math.abs(audioRef.current.currentTime - targetPos);
                if (delta > 1.2) {
                  audioRef.current.currentTime = targetPos;
                  setPosition(targetPos);
                }

                if (remotePlaying) {
                  audioRef.current.play().catch(() => {});
                  setIsPlaying(true);
                } else {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }
              break;
            }

            case 'sync_track': {
              const { currentTrack: newTrack, playbackPosition, isPlaying: remotePlaying } = payload;
              setCurrentTrackState(newTrack);
              setDuration(newTrack.duration);
              setPosition(playbackPosition || 0);

              if (audioRef.current) {
                audioRef.current.src = newTrack.audioUrl;
                audioRef.current.currentTime = playbackPosition || 0;
                if (remotePlaying) {
                  audioRef.current.play().catch(() => {});
                  setIsPlaying(true);
                } else {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }
              break;
            }

            case 'sync_mode': {
              setPlaybackModeState(payload.mode);
              break;
            }

            case 'queue_updated': {
              setQueue(payload.queue);
              break;
            }

            case 'participants_updated': {
              setParticipants(payload.participants);
              const amHost = payload.participants.some((p: RoomParticipant) => p.id === userId.current && p.isHost);
              setIsHost(amHost);
              break;
            }

            case 'reaction_received': {
              const reaction: ReactionEvent = payload;
              setReactions(prev => [reaction, ...prev.slice(0, 15)]);
              break;
            }

            case 'chat_received': {
              const chatMsg: ChatMessage = payload;
              setChat(prev => [...prev, chatMsg]);
              break;
            }
          }
        } catch (err) {
          console.error('Error handling WebSocket message', err);
        }
      };

      socket.onclose = () => {
        setConnectionStatus('disconnected');
        clearInterval(heartbeatInterval);
        // Attempt reconnect after 3 seconds
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      clearInterval(heartbeatInterval);
      if (wsRef.current) wsRef.current.close();
    };
  }, [roomId]);

  // Player controls
  const play = useCallback(() => {
    initAudioNodes();
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'play',
        payload: { position: audioRef.current?.currentTime || position }
      }));
    }
  }, [position, initAudioNodes]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'pause',
        payload: { position: audioRef.current?.currentTime || position }
      }));
    }
  }, [position]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((seconds: number) => {
    setPosition(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'seek',
        payload: { position: seconds }
      }));
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  const setPlaybackMode = useCallback((mode: MediaMode) => {
    setPlaybackModeState(mode);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'switch_mode',
        payload: { mode }
      }));
    }
  }, []);

  const setTrack = useCallback((track: Track) => {
    initAudioNodes();
    setCurrentTrackState(track);
    setDuration(track.duration);
    setPosition(0);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'set_track',
        payload: { track }
      }));
    }
  }, [initAudioNodes]);

  const nextTrack = useCallback(() => {
    if (queue.length > 0) {
      const next = queue[0];
      setTrack(next);
      removeFromQueue(next.id);
    } else {
      const currentIndex = INITIAL_TRACKS.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % INITIAL_TRACKS.length;
      setTrack(INITIAL_TRACKS[nextIndex]);
    }
  }, [queue, currentTrack, setTrack]);

  const prevTrack = useCallback(() => {
    if (position > 3) {
      seek(0);
    } else {
      const currentIndex = INITIAL_TRACKS.findIndex(t => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + INITIAL_TRACKS.length) % INITIAL_TRACKS.length;
      setTrack(INITIAL_TRACKS[prevIndex]);
    }
  }, [position, currentTrack, seek, setTrack]);

  const toggleShuffle = () => setShuffle(prev => !prev);
  const toggleRepeat = () => setRepeat(prev => !prev);
  const setEqualizerPreset = (preset: EqualizerPreset) => setEqualizerPresetState(preset);

  // Room collaboration actions
  const joinRoom = useCallback((newRoomId: string) => {
    const formatted = newRoomId.trim().toUpperCase();
    if (!formatted) return;
    setRoomId(formatted);
  }, []);

  const addToQueue = useCallback((track: Track) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'add_queue',
        payload: { track }
      }));
    } else {
      setQueue(prev => [...prev, track]);
    }
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'remove_queue',
        payload: { trackId }
      }));
    } else {
      setQueue(prev => prev.filter(t => t.id !== trackId));
    }
  }, []);

  const upvoteQueue = useCallback((trackId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'upvote_queue',
        payload: { trackId }
      }));
    }
  }, []);

  const sendReaction = useCallback((emoji: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'send_reaction',
        payload: { emoji }
      }));
    }
  }, []);

  const sendChatMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'send_chat',
        payload: { text: text.trim() }
      }));
    }
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        position,
        duration,
        volume,
        isMuted,
        playbackMode,
        visualizerData,
        equalizerPreset,
        shuffle,
        repeat,
        themeStyle,

        roomId,
        roomName,
        isHost,
        participants,
        queue,
        chat,
        reactions,
        connectionStatus,

        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        setPlaybackMode,
        setTrack,
        nextTrack,
        prevTrack,
        toggleShuffle,
        toggleRepeat,
        setEqualizerPreset,
        setThemeStyle,

        joinRoom,
        addToQueue,
        removeFromQueue,
        upvoteQueue,
        sendReaction,
        sendChatMessage
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
