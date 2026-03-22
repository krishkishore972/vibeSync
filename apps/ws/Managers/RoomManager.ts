import { WebSocket } from "ws";

type Song = {
  id: string;
  title: string;
  url: string;
  youtubeId: string;
  addedBy: string;
  upvoters: Set<string>;
  downvoters: Set<string>;
  votes: number;
  addedAt: number;
};

type User = {
  userId: string;
  userName: string;
  ws: WebSocket[];
};

type Room = {
  hostId: string;
  users: Set<string>;
  queue: Song[];
  currentSong?: Song;
};

export class RoomManager {
  private static instance: RoomManager;
  public rooms = new Map<string, Room>();
  public users = new Map<string, User>();
  public wsToRoom = new Map<WebSocket, string>(); //ws->roomId

  private constructor() {
    this.rooms = new Map();
    this.users = new Map();
    this.wsToRoom = new Map();
  }

  static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  // user Management
  addUser(userId: string, userName: string, ws: WebSocket) {
    const existing = this.users.get(userId);
    if (!existing) {
      this.users.set(userId, { userId, ws: [ws], userName });
    } else {
      if (!existing.ws.some((existingWs) => existingWs === ws)) {
        existing.ws.push(ws);
      }
    }
  }

  getUser(userId: string) {
    return this.users.get(userId);
  }

  removeUser(userId: string, ws: WebSocket) {
    const user = this.users.get(userId);
    if (user) {
      user.ws = user.ws.filter((existingWs) => existingWs !== ws);
    }
    if (user?.ws.length === 0) {
      this.users.delete(userId);
    }
  }

  // room Management
  createRoom(roomId: string, hostId: string) {
    if (!this.rooms.get(roomId)) {
      this.rooms.set(roomId, {
        users: new Set(),
        queue: [],
        hostId,
      });
    }
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  joinRoom(
    roomId: string,
    hostId: string,
    userId: string,
    userName: string,
    ws: WebSocket,
  ) {
    let room = this.rooms.get(roomId);
    let user = this.users.get(userId);
    if (!room) {
      this.createRoom(roomId, hostId);
      room = this.rooms.get(roomId);
    }
    if (!user) {
      this.addUser(userId, userName, ws);
      user = this.getUser(userId);
    } else {
      if (!user.ws.some((existingws) => existingws === ws)) {
        user.ws.push(ws);
      }
    }
    this.wsToRoom.set(ws, roomId);
    if (user && room) {
      room.users.add(userId);
    }
  }

  leaveRoom(userId: string, ws: WebSocket) {
    const roomId = this.wsToRoom.get(ws);
    if (!roomId) {
      return;
    }
    this.wsToRoom.delete(ws);
    this.removeUser(userId, ws);

    const room = this.getRoom(roomId);
    if (!room) return;
    const isUserStillConnected = this.users.get(userId);
    if (!isUserStillConnected) {
      room.users.delete(userId);
      if (room.users.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  // song Management

  addSong(roomId: string, song: Song) {
    const room = this.getRoom(roomId);
    if (!room) return;
    const isDuplicate =
      room.currentSong?.youtubeId === song.youtubeId ||
      room.queue.some((s) => s.youtubeId === song.youtubeId);
    if (isDuplicate) return;
    room.queue.push(song);
    this.sortQueue(room);
  }

  voteSong(
    userId: string,
    songId: string,
    roomId: string,
    direction: "up" | "down",
  ) {
    const room = this.getRoom(roomId);
    if (!room) return false;

    const song = room.queue.find((s) => s.id === songId);
    if (!song) return false;

    if (direction == "up") {
      if (song.upvoters.has(userId)) {
        return false;
      }
      song.downvoters.delete(userId);
      song.upvoters.add(userId);
    } else if (direction == "down") {
      if (song.downvoters.has(userId)) {
        return false;
      }
      song.upvoters.delete(userId);
      song.downvoters.add(userId);
    }
    song.votes = song.upvoters.size - song.downvoters.size;
    this.sortQueue(room);
    return true;
  }

  playNext(roomId: string) {
    const room = this.getRoom(roomId);
    if (!room) return null;
    const nextSong = room.queue.shift();
    if (nextSong) {
      room.currentSong = {
        ...nextSong,
        upvoters: new Set(),
        downvoters: new Set(),
        votes: nextSong.votes,
      };
    }
    return room.currentSong ?? null;
  }

  getQueue(roomId: string) {
    const queue = this.rooms.get(roomId)?.queue ?? [];
    return queue.map(({ upvoters, downvoters, ...song }) => song);
  }

  getCurrentSong(roomId: string) {
    const song = this.rooms.get(roomId)?.currentSong ?? null;
    if (!song) return null;
    const { upvoters, downvoters, ...rest } = song;
    return rest;
  }

  private sortQueue(room: Room) {
    room.queue.sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return a.addedAt - b.addedAt;
    });
  }

  // broadcasting
  broadcast(roomId: string, payload: object, excludeWs?: WebSocket) {
    const room = this.getRoom(roomId);
    if (!room) return;
    const message = JSON.stringify(payload);
    room.users.forEach((userId) => {
      const user = this.getUser(userId);
      user?.ws.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    });
  }

  onDisconnect(userId: string, ws: WebSocket) {
    const roomId = this.wsToRoom.get(ws);
    if (roomId) {
      this.leaveRoom(userId, ws);
    } else {
      this.removeUser(userId, ws);
    }
  }
}
