import { createContext } from "react";
import type { Song } from "@repo/types";

export type { Song };

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
