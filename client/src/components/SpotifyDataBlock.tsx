import { SpotifyData } from "../types/spotify";

type SpotifyDataBlockProp = {
    data: SpotifyData;
}

const SpotifyDataBlock = ({ data }: SpotifyDataBlockProp) => {
    return (
        <>
            <h1>{data.display_name}</h1>
            <h2>{data.email}</h2>
        </>
    )
}

export default SpotifyDataBlock;
