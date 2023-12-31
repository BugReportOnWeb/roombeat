import { ReactNode, createContext, useState } from "react";
import { Room, RoomContextType } from "../types/room";

type RoomContextProp = {
    children: ReactNode;
}

const RoomContext = createContext<RoomContextType | null>(null)

const RoomContextProvider = ({ children }: RoomContextProp) => {
    const [room, setRoom] = useState<Room | null>(null);

    return (
        <RoomContext.Provider value={{ room, setRoom }} >
            {children}
        </RoomContext.Provider>
    )
}

export { RoomContextProvider, RoomContext };
