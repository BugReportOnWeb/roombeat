import { Dispatch, SetStateAction } from "react";

type UsernameContextType = {
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
}

export type { UsernameContextType };
