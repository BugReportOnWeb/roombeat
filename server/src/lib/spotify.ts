import { TokenDetails } from "../types/room";
import { SpotifyData } from "../types/spotify";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
// const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;

const getSpotifyUserDetails = async (token: string) => {
    try {
        const res = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
            throw new Error(data.error);
        }

        const userDetails: SpotifyData = { 
            display_name: data.display_name,
            email: data.email
        };

        return userDetails;
    } catch (error) {
        throw error;
    }
}

const getSpotifyAcessToken = async (): Promise<TokenDetails> => {
    try {
        const params = new URLSearchParams();
        params.append("client_id", SPOTIFY_CLIENT_ID);
        params.append("response_type", "code");
        params.append("redirect_uri", "http://localhost:3000/callback");
        params.append("scope", "user-read-private user-read-email");

        const res = await fetch('https://accounts.spotify.com/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

const getSpotifyProfileData = async (tokenDetails: TokenDetails) => {
    const { access_token, token_type } = tokenDetails;

    try {
        const res = await fetch('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {
            method: 'GET',
            headers: {
                "Authorization": `${token_type} ${access_token}`
            }
        })

        console.log('here after try');

        const data = await res.json();

        console.log(data);

        if (!res.ok) {
            console.log('here inside !res.ok');
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export { getSpotifyAcessToken, getSpotifyProfileData, getSpotifyUserDetails };
