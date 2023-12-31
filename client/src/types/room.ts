import { SpotifyData } from "./spotify";

type Room = {
    id: string;
    owner: string;
    members: string[];
    spotifyData: SpotifyData;
}

export type { Room };
