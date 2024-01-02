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
        <div className='min-h-screen max-w-[68rem] mx-auto flex justify-center'>
            <div className='w-full mx-5 mt-10 lg:mt-40'>
                {/* TODO: Center but self-start relative to SpotifyDataBlodck on < lg screen */}
                <h1 className='text-5xl mb-12 font-extrabold'>
                    {room.owner}'s Music Room{' '}
                    <span className='text-sm font-normal'>({room.id})</span>
                </h1>
                <div className='flex flex-col items-center gap-14 lg:gap-12 lg:flex-row lg:items-start lg:justify-between'>
                    <SpotifyDataBlock spotifyData={room.spotify} />
                    <div className='w-fit flex gap-16 lg:min-w-fit lg:flex-col lg:gap-10'>
                        <PlaybackControls room={room} leaveRoom={leaveRoom} />
                        <Members members={room.members} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
