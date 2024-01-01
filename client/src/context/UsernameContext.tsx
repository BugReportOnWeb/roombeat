import { ReactNode, createContext, useState } from "react";
import { UsernameContextType } from "../types/context";

type UsernameContextProp = {
    children: ReactNode;
}

const UsernameContext = createContext<UsernameContextType | null>(null);

const UsernameContextProvider = ({ children }: UsernameContextProp) => {
    const [username, setUsername] = useState<string>('');

    return (
        <UsernameContext.Provider value={{ username, setUsername }}>
        { children }
        </UsernameContext.Provider>
    )
}

export { UsernameContextProvider, UsernameContext };
