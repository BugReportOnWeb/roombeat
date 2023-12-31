import { useEffect } from "react";
import { Room } from "../types/room";
import { socket } from "../socket/socket";

type SpotifyDataBlockProp = {
    room: Room
}

const SpotifyDataBlock = ({ room }: SpotifyDataBlockProp) => {
    const spotifyData = room.spotify;

    useEffect(() => {
        if (!room.spotify) {
            socket.emit('populate-spotify-room', room.id)
        }
    }, [room])

    return (
        <>
            {spotifyData && (
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-extrabold'>User stuff</h1>
                        <h1>{spotifyData.user.display_name}</h1>
                        <h2>{spotifyData.user.email}</h2>
                    </div>

                    <hr />

                    <div className='flex flex-col gap-1'>
                        <h1 className='font-extrabold'>Playback stuff</h1>
                        <img
                            src={spotifyData.playback.images[1].url}
                            width={spotifyData.playback.images[1].width}
                            height={spotifyData.playback.images[1].height}
                        />
                        <h1>{spotifyData.playback.name}</h1>
                        <h1>{spotifyData.playback.is_playing}</h1>
                        <h1>{spotifyData.playback.device_name}</h1>
                    </div>

                    <hr />
                </div>
            )}
        </>
    )
}

export default SpotifyDataBlock;
