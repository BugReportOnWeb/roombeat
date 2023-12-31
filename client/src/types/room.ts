import { Dispatch, SetStateAction } from "react";
import { SpotifyData } from "./spotify";

type Room = {
    id: string;
    owner: string;
    members: string[];
    spotify?: SpotifyData;
}

type RoomContextType = {
    room: Room | null;
    setRoom: Dispatch<SetStateAction<Room | null>>;
}

export type { Room, RoomContextType };
