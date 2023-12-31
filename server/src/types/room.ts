import { SpotifyData } from "./spotify";

type Room = {
    id: string;
    owner: string;
    members: string[];
    spotifyData: SpotifyData;
}

type TokenDetails = {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export { Room, TokenDetails };
