import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_TRACKS } from './src/data/catalog.ts';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory Room State Store
interface ClientInfo {
  socket: WebSocket;
  userId: string;
  userName: string;
  avatar: string;
  color: string;
  roomId: string;
}

const clients = new Map<WebSocket, ClientInfo>();

const avatarColors = [
  '#06b6d4', '#a855f7', '#fb7185', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'
];

interface ServerRoom {
  id: string;
  name: string;
  hostId: string;
  currentTrack: any;
  isPlaying: boolean;
  playbackPosition: number;
  lastUpdated: number;
  playbackMode: 'audio' | 'video';
  queue: any[];
  chat: any[];
}

const rooms = new Map<string, ServerRoom>();

// Seed default lounge room
rooms.set('LOUNGE-AURA', {
  id: 'LOUNGE-AURA',
  name: 'Cosmic Chill Lounge',
  hostId: 'system',
  currentTrack: INITIAL_TRACKS[0],
  isPlaying: true,
  playbackPosition: 0,
  lastUpdated: Date.now(),
  playbackMode: 'audio',
  queue: [INITIAL_TRACKS[1], INITIAL_TRACKS[2], INITIAL_TRACKS[3]],
  chat: [
    {
      id: 'welcome-1',
      userId: 'system',
      userName: 'Aura Sync Bot',
      userColor: '#06b6d4',
      text: 'Welcome to the Cosmic Chill Lounge! Synchronized audio & video listening is live.',
      timestamp: Date.now() - 60000
    }
  ]
});

// Helper to broadcast to a room
function broadcastToRoom(roomId: string, message: object, excludeSocket?: WebSocket) {
  const payload = JSON.stringify(message);
  for (const [ws, info] of clients.entries()) {
    if (info.roomId === roomId && ws !== excludeSocket && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

function getRoomParticipants(roomId: string) {
  const participants = [];
  const room = rooms.get(roomId);
  for (const [_, info] of clients.entries()) {
    if (info.roomId === roomId) {
      participants.push({
        id: info.userId,
        name: info.userName,
        avatar: info.avatar,
        color: info.color,
        isHost: room ? room.hostId === info.userId : false,
        joinedAt: Date.now()
      });
    }
  }
  return participants;
}

function getRoomSnapshot(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return null;
  return {
    ...room,
    participants: getRoomParticipants(roomId)
  };
}

// WebSocket Connection Handler
wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      const { type, payload } = data;

      switch (type) {
        case 'ping': {
          ws.send(JSON.stringify({
            type: 'pong',
            payload: { clientTimestamp: payload?.clientTimestamp, serverTimestamp: Date.now() }
          }));
          break;
        }

        case 'join_room': {
          const { roomId, userId, userName, avatar, color } = payload;
          const targetRoomId = (roomId || 'LOUNGE-AURA').toUpperCase();

          if (!rooms.has(targetRoomId)) {
            // Create new room on the fly
            rooms.set(targetRoomId, {
              id: targetRoomId,
              name: `Lounge ${targetRoomId}`,
              hostId: userId,
              currentTrack: INITIAL_TRACKS[0],
              isPlaying: false,
              playbackPosition: 0,
              lastUpdated: Date.now(),
              playbackMode: 'audio',
              queue: [INITIAL_TRACKS[1], INITIAL_TRACKS[2]],
              chat: []
            });
          }

          const room = rooms.get(targetRoomId)!;
          // If room has no active host or host is system, assign this user as host
          if (room.hostId === 'system' || getRoomParticipants(targetRoomId).length === 0) {
            room.hostId = userId;
          }

          clients.set(ws, {
            socket: ws,
            userId,
            userName: userName || `Listener-${Math.floor(1000 + Math.random() * 9000)}`,
            avatar: avatar || '🎧',
            color: color || avatarColors[Math.floor(Math.random() * avatarColors.length)],
            roomId: targetRoomId
          });

          // Send full room snapshot to the joining user
          const snapshot = getRoomSnapshot(targetRoomId);
          ws.send(JSON.stringify({
            type: 'room_state',
            payload: snapshot
          }));

          // Notify everyone in the room that participant joined
          broadcastToRoom(targetRoomId, {
            type: 'participants_updated',
            payload: { participants: getRoomParticipants(targetRoomId) }
          }, ws);
          break;
        }

        case 'play': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          room.isPlaying = true;
          room.playbackPosition = payload.position ?? room.playbackPosition;
          room.lastUpdated = Date.now();

          broadcastToRoom(client.roomId, {
            type: 'sync_playback',
            payload: {
              isPlaying: true,
              playbackPosition: room.playbackPosition,
              lastUpdated: room.lastUpdated,
              triggeredBy: client.userName
            }
          });
          break;
        }

        case 'pause': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          room.isPlaying = false;
          room.playbackPosition = payload.position ?? room.playbackPosition;
          room.lastUpdated = Date.now();

          broadcastToRoom(client.roomId, {
            type: 'sync_playback',
            payload: {
              isPlaying: false,
              playbackPosition: room.playbackPosition,
              lastUpdated: room.lastUpdated,
              triggeredBy: client.userName
            }
          });
          break;
        }

        case 'seek': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          room.playbackPosition = payload.position;
          room.lastUpdated = Date.now();

          broadcastToRoom(client.roomId, {
            type: 'sync_playback',
            payload: {
              isPlaying: room.isPlaying,
              playbackPosition: room.playbackPosition,
              lastUpdated: room.lastUpdated,
              triggeredBy: client.userName
            }
          });
          break;
        }

        case 'set_track': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          room.currentTrack = payload.track;
          room.playbackPosition = 0;
          room.isPlaying = true;
          room.lastUpdated = Date.now();

          broadcastToRoom(client.roomId, {
            type: 'sync_track',
            payload: {
              currentTrack: room.currentTrack,
              playbackPosition: 0,
              isPlaying: true,
              lastUpdated: room.lastUpdated,
              triggeredBy: client.userName
            }
          });
          break;
        }

        case 'switch_mode': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          room.playbackMode = payload.mode;
          broadcastToRoom(client.roomId, {
            type: 'sync_mode',
            payload: { mode: room.playbackMode }
          });
          break;
        }

        case 'add_queue': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          const newTrack = { ...payload.track, upvotes: 0 };
          room.queue.push(newTrack);

          broadcastToRoom(client.roomId, {
            type: 'queue_updated',
            payload: { queue: room.queue, addedBy: client.userName }
          });
          break;
        }

        case 'remove_queue': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          room.queue = room.queue.filter(t => t.id !== payload.trackId);
          broadcastToRoom(client.roomId, {
            type: 'queue_updated',
            payload: { queue: room.queue }
          });
          break;
        }

        case 'upvote_queue': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          const track = room.queue.find(t => t.id === payload.trackId);
          if (track) {
            track.upvotes = (track.upvotes || 0) + 1;
            // Re-sort queue by upvotes descending
            room.queue.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
            broadcastToRoom(client.roomId, {
              type: 'queue_updated',
              payload: { queue: room.queue }
            });
          }
          break;
        }

        case 'send_reaction': {
          const client = clients.get(ws);
          if (!client) return;

          const reaction = {
            id: `rx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            userId: client.userId,
            userName: client.userName,
            emoji: payload.emoji || '🔥',
            timestamp: Date.now()
          };

          broadcastToRoom(client.roomId, {
            type: 'reaction_received',
            payload: reaction
          });
          break;
        }

        case 'send_chat': {
          const client = clients.get(ws);
          if (!client) return;
          const room = rooms.get(client.roomId);
          if (!room) return;

          const chatMsg = {
            id: `msg-${Date.now()}`,
            userId: client.userId,
            userName: client.userName,
            userColor: client.color,
            text: payload.text,
            timestamp: Date.now()
          };

          room.chat.push(chatMsg);
          if (room.chat.length > 60) room.chat.shift();

          broadcastToRoom(client.roomId, {
            type: 'chat_received',
            payload: chatMsg
          });
          break;
        }
      }
    } catch (err) {
      console.error('WebSocket message parsing error:', err);
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client) {
      const { roomId, userId } = client;
      clients.delete(ws);

      const room = rooms.get(roomId);
      if (room) {
        // If host disconnected, assign new host if any participant remains
        const remaining = getRoomParticipants(roomId);
        if (room.hostId === userId && remaining.length > 0) {
          room.hostId = remaining[0].id;
        }
        broadcastToRoom(roomId, {
          type: 'participants_updated',
          payload: { participants: remaining }
        });
      }
    }
  });
});

// REST Endpoints
app.get('/api/catalog', (_req, res) => {
  res.json({ tracks: INITIAL_TRACKS });
});

app.get('/api/rooms', (_req, res) => {
  const activeRooms = Array.from(rooms.values()).map(r => ({
    id: r.id,
    name: r.name,
    currentTrackTitle: r.currentTrack?.title || 'None',
    currentTrackArtist: r.currentTrack?.artist || 'Unknown',
    participantCount: getRoomParticipants(r.id).length,
    isPlaying: r.isPlaying,
    mode: r.playbackMode
  }));
  res.json({ rooms: activeRooms });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const snapshot = getRoomSnapshot(req.params.roomId.toUpperCase());
  if (!snapshot) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({ room: snapshot });
});

// Gemini AI Music Assistant Endpoint
app.post('/api/assistant/chat', async (req, res) => {
  const { prompt, currentTrack } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // If Gemini API client is initialized
  if (aiClient) {
    try {
      const systemInstruction = `You are 'Aura AI' (இசை உதவியாளர்), the elite AI music assistant and Tamil lyricist/musicologist for AuraGlass Sync v2.1.
You have deep knowledge of:
1. Tamil Cinema Music & Poetry (கவிதை வரிகள்): Kannadasan, Vairamuthu, Vaali, Na. Muthukumar, Thamarai, Vignesh Shivan.
2. Legendary composers: A.R. Rahman, Ilaiyaraaja, Anirudh Ravichander, Yuvan Shankar Raja, Harris Jayaraj, Sid Sriram, and global artists.
3. Ragas, emotions (பாவம், உணர்ச்சி), lyrical interpretations, and poetic breakdowns in both pure Tamil (தமிழ்) and English (Tanglish).
Current playing track context:
- Title: ${currentTrack?.title || 'Unknown'} (${currentTrack?.tamilTitle || ''})
- Artist: ${currentTrack?.artist || 'Unknown'} (${currentTrack?.tamilArtist || ''})
- Genre: ${currentTrack?.genre || 'Unknown'}

Your instructions:
- Provide rich, thoughtful, beautifully formatted responses with markdown.
- When explaining Tamil lyrics, always provide the Tamil line (தமிழ்), English transliteration, and the poetic emotional meaning.
- When asked to recommend or queue tracks, prioritize catalog items:
  - "Marakkuma Nenjam (Acoustic Reverie)" [id: tamil-track-1] (Soulful Tamil Melody)
  - "Chennai Neon Rain (சென்னையின் மழை இரவு)" [id: tamil-track-2] (Cyber Electro Tamil)
  - "Azhage En Azhage (அழகே என் அழகே)" [id: tamil-track-3] (Tamil Lo-Fi Instrumental)
- Be polite, poetic, and musically inspiring.`;

      const geminiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      const replyText = geminiResponse.text || "Here is your music guidance.";
      
      let suggestedTrackId: string | undefined = undefined;
      const lower = replyText.toLowerCase();
      if (lower.includes('marakkuma') || replyText.includes('மறக்குமா')) suggestedTrackId = 'tamil-track-1';
      else if (lower.includes('chennai') || replyText.includes('சென்னை')) suggestedTrackId = 'tamil-track-2';
      else if (lower.includes('azhage') || replyText.includes('அழகே')) suggestedTrackId = 'tamil-track-3';

      return res.json({ reply: replyText, suggestedTrackId });
    } catch (err: any) {
      console.error('Gemini assistant error, using fallback:', err);
    }
  }

  // Graceful domain-rich musicological fallback
  const lowerPrompt = prompt.toLowerCase();
  let reply = '';
  let suggestedTrackId: string | undefined = undefined;

  if (lowerPrompt.includes('tamil') || lowerPrompt.includes('தமிழ்') || lowerPrompt.includes('marakkuma') || lowerPrompt.includes('மறக்குமா')) {
    reply = `🎶 **மறக்குமா நெஞ்சம் — பாடல் வரிகள் விளக்கம் (Tamil Lyric Breakdown):**\n\n- **தமிழ்:** *"மறக்குமா நெஞ்சம்... காலங்கள் கடந்தாலும் உன் நினைவை?"*\n- **Transliteration:** *Marakkumaa nenjam... kaalangal kadandhaalum un ninaivai?*\n- **Meaning:** "Will this heart ever let go of your cherished memories, no matter how distant time moves forward?"\n\n✨ **இசை உணர்வு (Musical Emotion):**\nThis song embodies classical *Karunai* (compassion) and deep nostalgic love, composed with warm acoustic guitar harmonics and soulful violin passages reminiscent of A.R. Rahman's melodies.`;
    suggestedTrackId = 'tamil-track-1';
  } else if (lowerPrompt.includes('recommend') || lowerPrompt.includes('பரிந்துரை') || lowerPrompt.includes('song') || lowerPrompt.includes('vibe')) {
    reply = `🎧 **இனிய தமிழ் பாடல்கள் பரிந்துரை (Recommended Tamil Vibes):**\n\n1. **Marakkuma Nenjam (மறக்குமா நெஞ்சம்)** — Soulful Acoustic Melody for peaceful study or evening reflection.\n2. **Chennai Neon Rain (சென்னையின் மழை இரவு)** — Energetic electro synth beat inspired by Anirudh's vibrant night drive vibes.\n3. **Azhage En Azhage (அழகே என் அழகே)** — Calm meditative bamboo flute instrumental.\n\nWould you like to play or queue one in your synchronized lounge?`;
    suggestedTrackId = 'tamil-track-1';
  } else if (lowerPrompt.includes('meaning') || lowerPrompt.includes('explain') || lowerPrompt.includes('lyrics') || lowerPrompt.includes('வரிகள்')) {
    reply = `📖 **Current Song Lyrics Analysis / வரிகள் பகுப்பாய்வு:**\n\nCurrently listening to **${currentTrack?.title || 'this track'}** (${currentTrack?.tamilTitle || ''}).\n\nThe lyrics explore the interplay between modern soundscapes and deep human emotion — how music synchronizes hearts across distant digital spaces (*"இரு உயிர்கள் இணையும் சங்கமம்... என்றும் அழியாத கவிதை"*).`;
  } else {
    reply = `வணக்கம்! I am your **Aura AI Music Assistant (இசை உதவியாளர்)**.\n\nI can help you with:\n- 📜 **Tamil Lyrics Analysis & Meanings** (பாடல் வரிகள் விளக்கம் & கவிதை நயம்)\n- 🎵 **Tamil & Global Song Recommendations** (மெலடி & சின்த் பரிந்துரைகள்)\n- 🌐 **Language Translations** (தமிழ் & English lyric breakdowns)\n- 🎧 **Lounge DJ Suggestions** for your collaborative room.\n\nHow can I enhance your listening experience today?`;
  }

  return res.json({ reply, suggestedTrackId });
});

// Gaana Music Server Endpoint
app.get('/api/gaana/trending', (_req, res) => {
  const gaanaTracks = INITIAL_TRACKS.filter(t => t.platform === 'gaana' || ['tamil', 'hindi', 'telugu', 'malayalam'].includes(t.language || ''));
  res.json({
    platform: 'gaana',
    title: 'Gaana Top Multilingual Charts 2026',
    tracks: gaanaTracks
  });
});

// YouTube Music Server Endpoint
app.get('/api/ytmusic/trending', (_req, res) => {
  const ytTracks = INITIAL_TRACKS.filter(t => t.platform === 'ytmusic' || t.videoUrl);
  res.json({
    platform: 'ytmusic',
    title: 'YouTube Music Trending Global & Regional',
    tracks: ytTracks
  });
});

// Vite Middleware integration for dev / static build for production
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const indexHtmlPath = path.resolve(distPath, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(indexHtmlPath);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
        return next();
      }
      res.sendFile(indexHtmlPath);
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraGlass Sync Server listening on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
