

export default function Queue({roomId}:{roomId:string}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Queue</h2>
            <p>Room ID: {roomId}</p>
        </div>
    );
}