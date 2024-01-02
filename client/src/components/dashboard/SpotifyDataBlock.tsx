import { millisToMinutesAndSeconds } from "../../lib/util";
import { SpotifyData } from "../../types/spotify";

type SpotifyDataBlockProps = {
    spotifyData?: SpotifyData;
}

const SpotifyDataBlock = ({ spotifyData }: SpotifyDataBlockProps) => {
    return (
        <div className='flex h-fit w-fit gap-5'>
            <img
                src={spotifyData?.playback.images[1].url}
                className='rounded-lg w-[350px] h-[350px]'
            />
            <div className='font-sm'>
                <div className='flex flex-col gap-0.5'>
                    <h1 className='font-bold text-2xl mb-2'>Song Details</h1>
                    <h1>
                        <span className='font-semibold'>Name:</span>{' '}
                        {spotifyData?.playback.name}
                    </h1>
                    <h1>
                        <span className='font-semibold'>
                            {(spotifyData?.playback.artists.length ?? 0) > 1
                                ? 'Artists:'
                                : 'Artist:'
                            }
                        </span>{' '}
                        {spotifyData?.playback.artists.join(', ')}
                    </h1>
                    <h1>
                        <span className='font-semibold'>Duration:</span>{' '}
                        {millisToMinutesAndSeconds(spotifyData?.playback.duration ?? 0)}
                    </h1>
                    <h1>
                        <span className='font-semibold'>Popularity:</span>{' '}
                        {spotifyData?.playback.popularity}/100
                    </h1>
                </div>

                <div className='border border-[#27272A] my-5'></div>

                <div className='flex flex-col gap-0.5'>
                    <h1 className='font-bold text-2xl mb-2'>Spotify Details</h1>
                    <h1>
                        <span className='font-semibold'>Username:</span>{' '}
                        {spotifyData?.user.display_name}
                    </h1>
                    <h1>
                        <span className='font-semibold'>Email:</span>{' '}
                        {spotifyData?.user.email}
                    </h1>
                    <h1>
                        <span className='font-semibold'>Playing on:</span>{' '}
                        {spotifyData?.playback.device_name}
                    </h1>

                </div>
            </div>
        </div>
    )
}

export default SpotifyDataBlock;
