
import  NowPlaying  from "@/components/NowPlaying";
import  AddSong  from "@/components/AddSong";
import  Queue  from "@/components/Queue";

export default async  function RoomPage({params}:{params:{roomId:string}}) {
    const {roomId} = await params;
    return (
       <div className="grid grid-cols-3 gap-6 p-6">

      {/* Now Playing */}
      <div className="col-span-2">
        <NowPlaying roomId={roomId} />
      </div>

      {/* Add Song */}
      <div>
        <AddSong roomId={roomId} />
      </div>

      {/* Queue */}
      <div className="col-span-3">
        <Queue roomId={roomId} />
      </div>

    </div>
    )
}