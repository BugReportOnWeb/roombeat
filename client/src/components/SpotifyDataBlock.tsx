import { useContext, useEffect, useState } from "react";
import { SpotifyData } from "../types/spotify";
import { RoomContext } from "../context/RoomContext";
import { RoomContextType } from "../types/room";
import { socket } from "../socket/socket";

type SpotifyDataBlockProp = {
    spotify?: SpotifyData
}

const SpotifyDataBlock = ({ spotify }: SpotifyDataBlockProp) => {
    const { room } = useContext(RoomContext) as RoomContextType;
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/spotify/data')
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error);
                }

                const updatedRoom = {
                    ...room!,
                    spotify: data
                }

                setError('');
                socket.emit('update-spotify-room', updatedRoom);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                    setError(error.message);
                }
            }
        }

        if (!spotify) fetchData();
    }, [])

    console.log(spotify);

    return (
        <>
            {error && !spotify && (
                <h1 className='text-red-500 font-sm'>{error}</h1>
            )}
            {!error && spotify && (
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-bold'>User stuff</h1>
                        <h1>{spotify.user.display_name}</h1>
                        <h2>{spotify.user.email}</h2>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-bold'>Playback stuff</h1>
                        <img
                            src={spotify.playback.images[1].url}
                            width={spotify.playback.images[1].width}
                            height={spotify.playback.images[1].height}
                        />
                        <h1>{spotify.playback.name}</h1>
                        <h1>{spotify.playback.is_playing}</h1>
                        <h1>{spotify.playback.device_name}</h1>
                    </div>
                </div>
            )}
        </>
    )
}

export default SpotifyDataBlock;
