import { SpotifyUser, SpotifyPlayback } from "./spotify";

type Room = {
    id: string;
    owner: string;
    members: string[];
    spotify: {
        user: SpotifyUser;
        playback: SpotifyPlayback
    }
}

export type { Room };
