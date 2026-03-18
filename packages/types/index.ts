export type Song = {
  id: string
  title: string
  url: string
  youtubeId: string
  smallImg: string
  bigImg: string
  addedBy: string
  voters: Set<string>
  votes: number
  addedAt: number
}

export type Room = {
  hostId: string
  users:Map<string,User>
}

export type User = {
    userId:string,
    ws:WebSocket[],
    token:string
}

export type ClientMessage =
  | { type: "join_room"; roomId: string; userId: string }
  | { type: "add_song"; roomId: string; song: Omit<Song, "votes" | "voters" | "addedAt"> }
  | { type: "vote_song"; roomId: string; songId: string }
  | { type: "play_next"; roomId: string }

export type ServerMessage =
  | { type: "connected"; userId: string }
  | { type: "room_joined"; roomId: string; queue: Song[] }
  | { type: "queue_updated"; queue: Song[] }
  | { type: "now_playing"; song: Song | null; queue: Song[] }
  | { type: "user_joined"; userId: string }
  | { type: "user_left"; userId: string }
  | { type: "error"; message: string }