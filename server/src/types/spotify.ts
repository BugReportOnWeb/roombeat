type SpotifyUser = {
    display_name: string,
    email: string
}

type SpotifyRawPlaybackImage = {
    url: string;
    height: number;
    width: number;
}

type SpotifyRawPlaybackArtist = {
    external_urls: {
        spotify: string
    },
    href: string,
    id: string,
    name: string,
    type: string,
    uri: string
}

type SpotifyPlayback = {
    device_name: string;
    is_playing: boolean;
    name: string;
    images: SpotifyRawPlaybackImage[];
    artists: string[];
    popularity: number;
    duration: number;
}

type SpotifyData = {
    user: SpotifyUser;
    playback: SpotifyPlayback;
}

export type {
    SpotifyData,
    SpotifyUser,
    SpotifyPlayback,
    SpotifyRawPlaybackArtist
}
