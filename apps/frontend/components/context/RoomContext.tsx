import { createContext } from "react";
export type Song = {
  id: string;
  title: string;
  url: string;
  youtubeId: string;
  addedBy: string;
  addedAt: number;
  votes: number;
  userVote: "up" | "down" | null;
};

export type Listner = {
  userName: string;
  userId: string;
};

export type RoomContextType = {
  queue: Song[];
  currentSong: Song | null;
  listners: Listner[];
  addSong: (song: Song) => void;
  voteSong: (songId: string, direction: "up" | "down") => void;
  playNext: () => void;
};

export const RoomContext = createContext<RoomContextType | null>(null);
