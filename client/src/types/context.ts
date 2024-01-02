import { Dispatch, SetStateAction } from "react";
import { Room } from "./room";

type UsernameContextType = {
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
}

type RoomContextType = {
    room: Room | null;
    setRoom: Dispatch<SetStateAction<Room | null>>;
}

export type { UsernameContextType, RoomContextType };
