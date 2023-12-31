import { SpotifyData } from "./spotify";

type Room = {
    id: string;
    owner: string;
    members: string[];
    spotify?: SpotifyData;
}

export type { Room };
