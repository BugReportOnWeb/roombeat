import { SpotifyData, SpotifyPlayback, SpotifyUser } from "../types/spotify";

const getSpotifyUserData = async (token: string) => {
    try {
        const res = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error);
        }

        const userDetails: SpotifyUser = {
            display_name: data.display_name,
            email: data.email
        };

        return userDetails;
    } catch (error) {
        throw error;
    }
}

const getSpotifyPlaybackData = async (token: string) => {
    try {
        const res = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error);
        }

        const playbackDetails: SpotifyPlayback = {
            device_name: data.device.name,
            is_playing: data.is_playing,
            name: data.item.name,
            images: data.item.album.images
        }

        return playbackDetails;
    } catch (error) {
        throw error;
    }
}

// TODO: Combine these two (prev/next) into one if possible
const skipToPreivous = async (token: string) => {
    try {
        await fetch('https://api.spotify.com/v1/me/player/previous', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const spotify: SpotifyData = {
            user: await getSpotifyUserData(token),
            playback: await getSpotifyPlaybackData(token)
        }

        return spotify
    } catch (error) {
        throw error;
    }
}

const skipToNext = async (token: string) => {
    try {
        await fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const spotify: SpotifyData = {
            user: await getSpotifyUserData(token),
            playback: await getSpotifyPlaybackData(token)
        }

        return spotify
    } catch (error) {
        throw error;
    }
}

const playPause = async (token: string, isPlaying: boolean) => {
    try {
        await fetch(`https://api.spotify.com/v1/me/player/${isPlaying ? 'pause' : 'play'}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const spotify: SpotifyData = {
            user: await getSpotifyUserData(token),
            playback: await getSpotifyPlaybackData(token)
        }

        return spotify
    } catch (error) {
        throw error;
    }
}

export {
    getSpotifyUserData,
    getSpotifyPlaybackData,
    skipToPreivous,
    skipToNext,
    playPause
};
