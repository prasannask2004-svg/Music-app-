export type MediaMode = 'audio' | 'video';

export type PlatformSource = 'spotify' | 'apple' | 'gaana' | 'ytmusic' | 'aura';

export type MusicLanguage =
  | 'tamil'
  | 'hindi'
  | 'telugu'
  | 'malayalam'
  | 'punjabi'
  | 'english'
  | 'spanish'
  | 'korean'
  | 'multilingual';

export interface LyricLine {
  time: number; // in seconds
  text: string;
  textTamil?: string; // Tamil script (தமிழ்)
  nativeScript?: string; // Hindi/Telugu/Malayalam/Punjabi native text
  transliteration?: string; // Transliteration
  meaning?: string; // English translation/meaning
}

export interface Track {
  id: string;
  title: string;
  tamilTitle?: string;
  nativeTitle?: string;
  artist: string;
  tamilArtist?: string;
  nativeArtist?: string;
  album: string;
  tamilAlbum?: string;
  releaseYear?: number;
  coverUrl: string;
  duration: number; // seconds
  audioUrl: string;
  videoUrl?: string; // YouTube embed ID or video MP4
  platform: PlatformSource;
  platformUrl?: string;
  genre: string;
  language?: MusicLanguage;
  bpm?: number;
  lyrics?: LyricLine[];
  accentColor?: string; // hex or rgb
  upvotes?: number;
}

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tamilContent?: string;
  suggestedTrackId?: string;
  timestamp: number;
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
