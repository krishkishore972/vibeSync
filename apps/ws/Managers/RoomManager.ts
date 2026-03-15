import type { Room } from "../types";
import type { Song } from "../types";

export class RoomManager {

    private rooms = new Map<string, Room>();

    createRoom(roomId: string, hostId: string) {
        this.rooms.set(roomId, {
            id: roomId,
            hostId,
            users: new Set([hostId]),
            queue: []
        })
    }

    deleteRoom(roomId: string) {
        this.rooms.delete(roomId);
    }

    joinRoom(roomId: string, userId: string) {
        let room = this.rooms.get(roomId);
        if (!room) {
            this.createRoom(roomId, userId);
            room = this.rooms.get(roomId);
        }
        room?.users.add(userId);
    }

    leaveRoom(roomId: string, userId: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return
        }
        room.users.delete(userId);
        if (room.users.size === 0) {
            this.deleteRoom(roomId);
        }
    }

    addSong(roomId: string, song: Song) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return
        }
        song.voters = new Set();
        song.votes = 0;
        room.queue.push(song)
    }

    voteSong(roomId: string, songId: string, userId: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return
        }
        const song = room.queue.find(el => el.id === songId);
        if (!song) {
            return
        }
        if (song.voters.has(userId)) {
            return
        }
        song.voters.add(userId);
        song.votes += 1;
        this.sortQueue(room);
    }

    private sortQueue(room: Room) {
        room.queue.sort((a, b) => {
            if (b.votes !== a.votes) {
                return b.votes - a.votes;
            }
            return a.addedAt - b.addedAt;
        });
    }

    getQueue(roomId: string) {
        const room = this.rooms.get(roomId)
        if (!room) {
            return []
        }
        return room.queue
    }

    playNext(roomId: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return
        }
        const nextSong = room.queue.shift();
        if (nextSong) {
            room.currentSong = nextSong
        }
        return nextSong
    }
}