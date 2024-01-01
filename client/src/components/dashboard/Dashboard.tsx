import { useEffect } from "react";
import { socket } from "../../socket/socket";
import { Room } from "../../types/room";
import Members from "./Members";
import PlaybackControls from "./PlaybackControls";
import SpotifyDataBlock from "./SpotifyDataBlock";

type RoomProps = {
    room: Room;
    leaveRoom: () => void;
}

const Dashboard = ({ room, leaveRoom }: RoomProps) => {
    useEffect(() => {
        if (!room.spotify) {
            socket.emit('populate-spotify-room', room.id)
        }
    }, [room])

    return (
        <div className='min-h-screen max-w-5xl mx-auto flex justify-center mt-40'>
            <div className='w-full mx-5'>
                <h1 className='text-5xl mb-10 font-extrabold'>
                    {room.owner}'s Music Room{' '}
                    <span className='text-sm font-normal'>({room.id})</span>
                </h1>

                <div className='flex justify-between'>
                    <SpotifyDataBlock spotifyData={room.spotify} />
                    <div className='flex flex-col items-center gap-10'>
                        <PlaybackControls room={room} leaveRoom={leaveRoom} />
                        <Members members={room.members} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard;
