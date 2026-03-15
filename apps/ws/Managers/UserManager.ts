import { WebSocket } from "ws"

type User = {
    id:string,
    ws:WebSocket,
    roomId?:string
}

export class UserManager {
    private users = new Map<string,User>()
    addUser(id:string,ws:WebSocket){
        this.users.set(id,{id,ws})
    }

    getUser(id:string){
       return this.users.get(id);
    }

    removeUser(userId:string){
        const user = this.users.get(userId);
        this.users.delete(userId);
        user?.ws.close();
    }
}