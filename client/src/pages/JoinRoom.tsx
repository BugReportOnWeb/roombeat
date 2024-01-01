// Core
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Context
import { UsernameContext } from "../context/UsernameContext";
import { UsernameContextType } from "../types/context";

// Extras
import { validateRoomId, validateUsername } from "../lib/validation";
import { socket } from "../socket/socket";
import ErrorBlock from "../components/ErrorBlock";

const JoinRoom = () => {
    const { username, setUsername } = useContext(UsernameContext) as UsernameContextType;
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const joinRoom = async () => {
        const usernameError = validateUsername(username);
        if (usernameError) {
            setError(usernameError);
            return;
        }

        const roomIdError = await validateRoomId(username, roomId);
        if (roomIdError) {
            setError(roomIdError);
            return;
        }

        socket.connect()
        socket.emit('join-room', roomId, username);
        navigate('/');
    }

    return (
        <div className='flex flex-col items-center mt-24 gap-20'>
            <div className='flex flex-col gap-2 text-center'>
                <h1 className='font-extrabold text-3xl uppercase'>Join a Room</h1>
                <p className='font-extralight text-sm'>Join a music room to collaborate, sync and enjoy the moment together</p>
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
                <label htmlFor="room-id">Room ID</label>
                <input
                    id="room-id"
                    type='text'
                    placeholder='XYZAB'
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className='bg-transparent border border-[#272731] px-3.5 py-2.5 text-sm rounded-lg placeholder-[#A1A1AA] outline-none'
                />
                <p className='text-[#A1A1AA] text-xs'>Enter the ID of the room to join</p>
                <div className='flex gap-3 mt-3'>
                    <div onClick={joinRoom} className='inline-flex justify-center items-center bg-[#FAFAFA] text-[#18181B] px-3.5 py-2 w-20 h-fit text-sm rounded-lg cursor-pointer hover:bg-[#FAFAFA]/80'>Join</div>
                    <Link to='/' className='inline-flex justify-center items-center border border-[#27272a] px-3.5 py-2 w-20 h-fit text-sm rounded-lg cursor-pointer hover:bg-[#27272a]'>Back</Link>
                </div>
                {error && <ErrorBlock error={error} />}
            </div>
        </div>
    )
}

export default JoinRoom;
