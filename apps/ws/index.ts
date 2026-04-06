import { WebSocketServer } from "ws";
import { RoomManager } from "./Managers/RoomManager";
import { verifyToken } from "./lib/verifyToken";
import { parse } from "url";
import type { IncomingMessage } from "http";

const wss = new WebSocketServer({ port: 8000 });

const roomManager = RoomManager.getInstance();

wss.on("connection", async (ws, req: IncomingMessage) => {
  const { query } = parse(req.url ?? "", true);
  const token = query.token as string;
  if (!token) {
    ws.send(JSON.stringify({ type: "error", message: "No token provided" }));
    ws.close();
    return;
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
    ws.close();
    return;
  }

  const userId = decoded.id as string;
  const userName = decoded.name as string;
  roomManager.addUser(userId, userName, ws);
  ws.on("message", (data) => {
    try {
      const dataStr = Buffer.isBuffer(data) ? data.toString() : String(data);
      if (!dataStr || !dataStr.trim()) {
        return;
      }
      const message = JSON.parse(dataStr);
      console.log("Received:", message.type, message);

      switch (message.type) {
        case "join-room":
          if (!message.roomId) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid join-room message",
              }),
            );
            break;
          }
          console.log("room joined");
          roomManager.joinRoom(message.roomId, userId, userId, userName, ws);
          const room = roomManager.getRoom(message.roomId);
          ws.send(
            JSON.stringify({
              type: "room-joined",
              queue: roomManager.getQueue(message.roomId, userId),
              currentSong: roomManager.getCurrentSong(message.roomId, userId),
              listeners: roomManager.getRoomUsers(message.roomId),
              hostId: room?.hostId,
            }),
          );
          roomManager.broadcast(
            message.roomId,
            {
              type: "user-joined",
              userId,
              username: userName,
            },
            ws,
          );
          break;

        case "add-song": {
          if (!message.roomId || !message.song) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid add-song message",
              }),
            );
            break;
          }
          console.log("add-song received:", {
            roomId: message.roomId,
            song: message.song,
          });
          roomManager.addSong(message.roomId, message.song);
          const currentSong = roomManager.getCurrentSong(
            message.roomId,
            userId,
          );
          console.log("After addSong, currentSong:", currentSong);
          const queue = roomManager.getQueue(message.roomId, userId);
          console.log("Queue after addSong:", queue);
          if (!currentSong) {
            const nextSong = roomManager.playNext(message.roomId);
            console.log("No currentSong, played next:", nextSong);
            roomManager.broadcast(message.roomId, {
              type: "song-changed",
              currentSong: nextSong ? { ...nextSong, userVote: null } : null,
              queue: roomManager.getQueue(message.roomId, userId),
            });
          } else {
            console.log("Has currentSong, broadcasting queue-updated");
            roomManager.broadcast(message.roomId, {
              type: "queue-updated",
              queue: queue,
            });
          }
          break;
        }

        case "vote-song": {
          if (!message.songId || !message.roomId || !message.direction) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid vote-song message",
              }),
            );
            break;
          }
          const success = roomManager.voteSong(
            userId,
            message.songId,
            message.roomId,
            message.direction,
          );
          if (success) {
            roomManager.broadcast(message.roomId, {
              type: "voted-song",
              queue: roomManager.getQueue(message.roomId, userId),
            });
          } else {
            ws.send(JSON.stringify({ type: "error", message: "Vote failed" }));
          }
          break;
        }

        case "play-next": {
          const room = roomManager.getRoom(message.roomId);
          if (!room) {
            ws.send(
              JSON.stringify({ type: "error", message: "Room not found" }),
            );
            break;
          }
          if (room.hostId !== userId) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Only host can skip songs",
              }),
            );
            break;
          }
          const nextSong = roomManager.playNext(message.roomId);
          roomManager.broadcast(message.roomId, {
            type: "song-changed",
            currentSong: nextSong ? { ...nextSong, userVote: null } : null,
            queue: roomManager.getQueue(message.roomId, userId),
          });
          break;
        }

        case "leave-room": {
          roomManager.leaveRoom(userId, ws);
          roomManager.broadcast(message.roomId, { type: "user-left", userId });
          break;
        }
      }
    } catch (error) {
      console.error("Message handling error:", {
        dataType: typeof data,
        dataPreview: Buffer.isBuffer(data)
          ? data.toString().substring(0, 100)
          : String(data).substring(0, 100),
        error: String(error),
      });
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    }
  });

  ws.on("close", () => {
    roomManager.onDisconnect(userId, ws);
  });
});
