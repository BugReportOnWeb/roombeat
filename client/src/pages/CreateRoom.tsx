// Core
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

// Context
import { UsernameContext } from "../context/UsernameContext";
import { UsernameContextType } from "../types/context";

// Extras
import { validateUsername } from "../lib/validation";
import { getAuthURL } from "../lib/spotify";
import ErrorBlock from "../components/ErrorBlock";

const CreateRoom = () => {
    const { username, setUsername } = useContext(UsernameContext) as UsernameContextType;
    const [error, setError] = useState('');

    const validateUser = async () => {
        const usernameError = validateUsername(username);
        if (usernameError) {
            setError(usernameError);
            return;
        }

        try {
            const authURL = await getAuthURL(username);
            document.location = authURL;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <div className='flex flex-col items-center mt-24 gap-20'>
            <div className='flex flex-col gap-2 text-center'>
                <h1 className='font-extrabold text-3xl uppercase'>Create a new Room</h1>
                <p className='font-extralight text-sm'>Create a music room to collaborate, sync and enjoy the moment together</p>
            </div>
            <div className='flex flex-col gap-3 w-72'>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type='text'
                    placeholder='Dev'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='bg-transparent border border-[#272731] px-3.5 py-2.5 text-sm rounded-lg placeholder-[#A1A1AA] outline-none'
                />
                <p className='text-[#A1A1AA] text-xs'>This is your public display name</p>
                <div className='flex gap-3 mt-3'>
                    <div onClick={validateUser} className='inline-flex justify-center items-center bg-[#FAFAFA] text-[#18181B] px-3.5 py-2 w-20 h-fit text-sm rounded-lg cursor-pointer hover:bg-[#FAFAFA]/80'>Create</div>
                    <Link to='/' className='inline-flex justify-center items-center border border-[#27272a] px-3.5 py-2 w-20 h-fit text-sm rounded-lg cursor-pointer hover:bg-[#27272a]'>Back</Link>
                </div>
                {error && <ErrorBlock error={error} />}
            </div>
        </div>
    )
}

export default CreateRoom;
