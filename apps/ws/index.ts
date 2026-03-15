import { WebSocketServer } from "ws";
import { RoomManager } from "./Managers/RoomManager";
import { UserManager } from "./Managers/UserManager";
const wss = new WebSocketServer({ port: 8000 });

const userManager = new UserManager();
const roomManager = new RoomManager();
wss.on("connection", (ws) => {

    userManager.addUser("abc",ws);
    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        if (message.type === "join_room") {
            roomManager.joinRoom("1","abc")
        }
    })

    ws.on("close", () => {
        userManager.removeUser("abc")
    })
})