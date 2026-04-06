import WebSocket from "ws";

export type Song = {
  id: string;
  title: string;
  url: string;
  youtubeId: string;
  addedBy: string;
  votes: number;
  addedAt: number;
  userVote?: "up" | "down" | null;
};

export type Room = {
  hostId: string;
  users: string[];
};

export type User = {
  userId: string;
  userName: string;
  ws?: WebSocket[];
};

export type ClientMessage =
  | { type: "join-room"; roomId: string; hostId: string }
  | {
      type: "add-song";
      roomId: string;
      song: Omit<Song, "votes" | "userVote" | "addedAt"> & { addedAt: number };
    }
  | {
      type: "vote-song";
      roomId: string;
      songId: string;
      direction: "up" | "down";
    }
  | { type: "play-next"; roomId: string }
  | { type: "leave-room"; roomId: string };

export type ServerMessage =
  | { type: "connected"; userId: string }
  | {
      type: "room-joined";
      queue: Song[];
      currentSong: Song | null;
      listeners: { userId: string; userName: string }[];
      hostId: string;
    }
  | { type: "queue-updated"; queue: Song[] }
  | { type: "song-changed"; currentSong: Song | null; queue: Song[] }
  | { type: "user-joined"; userId: string; username: string }
  | { type: "user-left"; userId: string }
  | { type: "voted-song"; queue: Song[] }
  | { type: "error"; message: string };
