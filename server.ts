import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_TRACKS } from './src/data/catalog.js';

dotenv.config();

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

// Vite Middleware integration for dev / static build for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraGlass Sync Server listening on port ${PORT}`);
  });
}

startServer();
