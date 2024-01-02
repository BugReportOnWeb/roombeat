import { ReactNode, createContext, useState } from "react";
import { Room } from "../types/room";
import { RoomContextType } from "../types/context";

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
