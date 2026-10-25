export type MediaMode = 'audio' | 'video';

export type PlatformSource = 'spotify' | 'apple' | 'aura';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number; // seconds
  audioUrl: string;
  videoUrl?: string; // YouTube embed ID or video MP4
  platform: PlatformSource;
  platformUrl?: string;
  genre: string;
  bpm?: number;
  lyrics?: LyricLine[];
  accentColor?: string; // hex or rgb
  upvotes?: number;
}

export interface RoomParticipant {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isHost: boolean;
  joinedAt: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  timestamp: number;
}

export interface ReactionEvent {
  id: string;
  userId: string;
  userName: string;
  emoji: string;
  timestamp: number;
}

export interface RoomState {
  id: string;
  name: string;
  hostId: string;
  currentTrack: Track | null;
  isPlaying: boolean;
  playbackPosition: number;
  lastUpdated: number;
  playbackMode: MediaMode;
  queue: Track[];
  participants: RoomParticipant[];
  chat: ChatMessage[];
}

export type VisualizerMode = 'bars' | 'circle' | 'wave';

export type EqualizerPreset = 'flat' | 'bass' | 'electronic' | 'vocal' | 'acoustic' | 'treble';
