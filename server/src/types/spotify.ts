type SpotifyUser = {
    display_name: string,
    email: string
}

type SpotifyPlaybackImage = {
    url: string;
    height: number;
    width: number;
}

type SpotifyPlayback = {
    device_name: string;
    is_playing: boolean;
    name: string;
    images: SpotifyPlaybackImage[];
}

type SpotifyData = {
    user: SpotifyUser;
    playback: SpotifyPlayback;
}

export type {
    SpotifyData,
    SpotifyUser,
    SpotifyPlayback
}
