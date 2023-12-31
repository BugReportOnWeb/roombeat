import { useEffect, useState } from "react";
import { SpotifyData } from "../types/spotify";
// import { SpotifyUser, SpotifyPlayback } from "../types/spotify";

// type SpotifyDataBlockProp = {
//     spotify: {
//         user: SpotifyUser;
//         playback: SpotifyPlayback;
//     }
// }

const SpotifyDataBlock = () => {
    const [spotifyData, setSpotifyData] = useState<SpotifyData>();
    const [error, setError] = useState('');

    console.log(spotifyData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/spotify/data')
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error);
                }

                setSpotifyData(data);
                setError('');
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                    setError(error.message);
                }
            }
        }

        fetchData();
    }, [])

    return (
        <>
            {error && !spotifyData && (
                <h1 className='text-red-500 font-sm'>{error}</h1>
            )}
            {!error && spotifyData && (
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-bold'>User stuff</h1>
                        <h1>{spotifyData.user.display_name}</h1>
                        <h2>{spotifyData.user.email}</h2>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-bold'>Playback stuff</h1>
                        <img
                            src={spotifyData.playback.images[1].url}
                            width={spotifyData.playback.images[1].width}
                            height={spotifyData.playback.images[1].height}
                        />
                        <h1>{spotifyData.playback.name}</h1>
                        <h1>{spotifyData.playback.is_playing}</h1>
                        <h1>{spotifyData.playback.device_name}</h1>
                    </div>
                </div>
            )}
        </>
    )
}

export default SpotifyDataBlock;
