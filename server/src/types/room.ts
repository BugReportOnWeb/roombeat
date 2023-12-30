type Room = {
    id: string;
    owner: string;
    members: string[];
}

type TokenDetails = {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export { Room, TokenDetails };
