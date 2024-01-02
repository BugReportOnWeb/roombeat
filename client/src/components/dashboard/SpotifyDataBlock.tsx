import { SpotifyData } from "../../types/spotify";

type SpotifyDataBlockProps = {
    spotifyData?: SpotifyData;
}

const SpotifyDataBlock = ({ spotifyData }: SpotifyDataBlockProps) => {
    return (
        <div className='flex h-fit gap-5'>
            <img
                src={spotifyData?.playback.images[1].url}
                width={spotifyData?.playback.images[1].width}
                height={spotifyData?.playback.images[1].height}
                className='rounded-lg'
            />
            <div className='font-sm'>
                <h1 className='font-bold text-2xl mb-3'>Song Details</h1>
                <div className='flex flex-col gap-0.5'>
                    <h1>
                        <span className='font-semibold'>Name:</span>{' '}
                        {spotifyData?.playback.name}
                    </h1>
                    <h1>
                        <span className='font-semibold'>Artists:</span>{' '}
                        {spotifyData?.playback.artists.toString()}
                    </h1>
                    <div className='border border-[#27272A] my-2'></div>
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
