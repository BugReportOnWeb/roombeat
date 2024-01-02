import { socket } from "../../socket/socket";
import { Room } from "../../types/room";

type PlaybackControlsProps = {
    room: Room;
    leaveRoom: () => void;
}

const PlaybackControls = ({ room, leaveRoom }: PlaybackControlsProps) => {
    const spotifyData = room.spotify;

    const skipToPrevious = () => {
        socket.emit('skip-previous-spotify-room', room.id);
    }

    const skipToNext = () => {
        socket.emit('skip-next-spotify-room', room.id);
    }

    const playPause = () => {
        socket.emit('play-pause-spotify-room', room.id, spotifyData?.playback.is_playing);
    }

    return (
        <div className='text-center'>
            <h1 className='font-bold text-3xl mb-5'>Playback Controls</h1>
            <div className='flex flex-col gap-3'>
                <div className='flex gap-2'>
                    <div onClick={skipToPrevious} className='inline-flex justify-center items-center border border-[#27272a] text-sm px-3.5 py-2.5 w-full h-fit rounded-lg cursor-pointer transition-colors ease-in-out hover:bg-[#27272a]'>Prev</div>
                    <div onClick={skipToNext} className='inline-flex justify-center items-center border border-[#27272a] text-sm px-3.5 py-2.5 w-full h-fit rounded-lg cursor-pointer transition-colors ease-in-out hover:bg-[#27272a]'>Next</div>
                </div>
                <div onClick={playPause} className='inline-flex justify-center items-center border border-[#27272a] text-sm px-3.5 py-2.5 w-full h-fit rounded-lg cursor-pointer transition-colors ease-in-out hover:bg-[#27272a]'>
                    {spotifyData?.playback.is_playing ? 'Pause' : 'Play'}
                </div>
                <div onClick={leaveRoom} className='inline-flex justify-center items-center bg-[#7F1D1D] text-sm px-3.5 py-2.5 w-full h-fit rounded-lg cursor-pointer transition-colors hover:bg-[#7F1D1D]/80'>
                    Leave Room
                </div>
            </div>
        </div>
    )
}

export default PlaybackControls;
