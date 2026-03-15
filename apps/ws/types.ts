export type Song = {
    id: string
    title: string
    youtubeId: string
    addedBy: string
    voters: Set<string>
    votes:number
    addedAt: number
}

export type Room = {
    id: string
    hostId: string
    users: Set<string>
    queue: Song[]
    currentSong?: Song
}