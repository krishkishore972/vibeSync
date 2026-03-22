import { RoomContext } from "@/components/context/RoomContext";
import { useContext } from "react";

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) throw new Error("must be used inside RoomProvider");
  return context;
}
