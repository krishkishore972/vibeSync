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

  getRoomUsers(roomId: string): { userId: string; userName: string }[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.users).map((userId) => {
      const user = this.users.get(userId);
      return {
        userId,
        userName: user?.userName ?? "Unknown",
      };
    });
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
    const songWithVotes = {
      ...song,
      upvoters: new Set<string>(),
      downvoters: new Set<string>(),
      votes: 0,
    };
    room.queue.push(songWithVotes);
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

    const upvoters =
      song.upvoters instanceof Set ? song.upvoters : new Set<string>();
    const downvoters =
      song.downvoters instanceof Set ? song.downvoters : new Set<string>();

    if (direction == "up") {
      if (upvoters.has(userId)) {
        return false;
      }
      downvoters.delete(userId);
      upvoters.add(userId);
    } else if (direction == "down") {
      if (downvoters.has(userId)) {
        return false;
      }
      upvoters.delete(userId);
      downvoters.add(userId);
    }

    song.upvoters = upvoters;
    song.downvoters = downvoters;
    song.votes = upvoters.size - downvoters.size;
    this.sortQueue(room);
    return true;
  }

  playNext(roomId: string) {
    const room = this.getRoom(roomId);
    if (!room) return null;
    const nextSong = room.queue.shift();
    if (nextSong) {
      const upvoters =
        nextSong.upvoters instanceof Set
          ? nextSong.upvoters
          : new Set<string>();
      const downvoters =
        nextSong.downvoters instanceof Set
          ? nextSong.downvoters
          : new Set<string>();
      room.currentSong = {
        ...nextSong,
        upvoters: new Set(),
        downvoters: new Set(),
        votes: upvoters.size - downvoters.size,
      };
    }
    return room.currentSong ?? null;
  }

  getQueue(roomId: string, userId?: string) {
    const queue = this.rooms.get(roomId)?.queue ?? [];
    return queue.map((song) => {
      const upvoters =
        song.upvoters instanceof Set ? song.upvoters : new Set<string>();
      const downvoters =
        song.downvoters instanceof Set ? song.downvoters : new Set<string>();
      const { upvoters: _, downvoters: __, ...rest } = song;
      let userVote: "up" | "down" | null = null;
      if (userId) {
        if (upvoters.has(userId)) userVote = "up";
        else if (downvoters.has(userId)) userVote = "down";
      }
      return { ...rest, userVote, votes: upvoters.size - downvoters.size };
    });
  }

  getUserVotes(roomId: string, userId: string): Record<string, "up" | "down"> {
    const queue = this.rooms.get(roomId)?.queue ?? [];
    const votes: Record<string, "up" | "down"> = {};
    queue.forEach((song) => {
      if (song.upvoters.has(userId)) votes[song.id] = "up";
      else if (song.downvoters.has(userId)) votes[song.id] = "down";
    });
    return votes;
  }

  getCurrentSong(roomId: string, userId?: string) {
    const song = this.rooms.get(roomId)?.currentSong ?? null;
    if (!song) return null;
    const upvoters =
      song.upvoters instanceof Set ? song.upvoters : new Set<string>();
    const downvoters =
      song.downvoters instanceof Set ? song.downvoters : new Set<string>();
    const { upvoters: _, downvoters: __, ...rest } = song;
    let userVote: "up" | "down" | null = null;
    if (userId) {
      if (upvoters.has(userId)) userVote = "up";
      else if (downvoters.has(userId)) userVote = "down";
    }
    return { ...rest, userVote, votes: upvoters.size - downvoters.size };
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
