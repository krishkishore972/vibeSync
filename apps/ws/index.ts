import { WebSocketServer } from "ws";
import { RoomManager } from "./Managers/RoomManager";
import { verifyToken } from "./lib/verifyToken";
import { parse } from "url";
import type { IncomingMessage } from "http";


const wss = new WebSocketServer({ port: 8000 });

const roomManager = RoomManager.getInstance();


wss.on("connection", (ws, req: IncomingMessage) => {

    const { query } = parse(req.url ?? "", true);
    const token = query.token as string;
    if (!token) {
        ws.send(JSON.stringify({ type: "error", message: "No token provided" }));
        ws.close();
        return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
        ws.close();
        return
    }

    const userId = decoded.id
    roomManager.addUser(userId, ws);
    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString());
            switch (message.type) {

                case "join-room":
                    roomManager.joinRoom(message.roomId, userId, userId, ws);
                    break;

                case "add-song":
                    roomManager.addSong(message.roomId, message.song);
                    roomManager.broadcast(message.roomId, {
                        type: "queue-updated",
                        queue: roomManager.getQueue(message.roomId)
                    })
                    break

                case "vote-song":
                    const success = roomManager.voteSong(userId, message.songId, message.roomId, message.direction);
                    if (success) {
                        roomManager.broadcast(message.roomId, {
                            type: "voted-song",
                            queue: roomManager.getQueue(message.roomId)
                        })
                    } else {
                        ws.send(JSON.stringify({ type: "error", message: "Vote failed" }));
                    }
                    break


                case "play-next":
                    const room = roomManager.getRoom(message.roomId);
                    if (!room) {
                        ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
                        break;
                    }
                    if (room.hostId !== userId) {
                        ws.send(JSON.stringify({ type: "error", message: "Only host can skip songs" }));
                        break;
                    }
                    const nextSong = roomManager.playNext(message.roomId)
                    roomManager.broadcast(message.roomId, {
                        type: "song-changed",
                        currentSong:nextSong,
                        queue: roomManager.getQueue(message.roomId)
                    })
                    break
                case "leave-room":
                    roomManager.leaveRoom(userId, ws);
                    const roomId = roomManager.wsToRoom.get(ws);
                    roomManager.broadcast(message.roomId, {
                        type: "left-room",
                        room:roomManager.getRoom(roomId||"")
                    })
                    break
            }
        } catch (error) {
            ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
        }
    })

    ws.on("close", () => {
        roomManager.onDisconnect(userId, ws);
    })
})