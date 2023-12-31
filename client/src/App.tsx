// Core
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Components
import RoomDash from "./components/RoomDash";
import ErrorBlock from "./components/ErrorBlock";

// Extras
import { Room } from "./types/room";
import { socket } from "./socket/socket";
import { validateRoomId, validateUsername } from "./lib/validation";
import { getAuthURL } from "./lib/spotify";

const App = () => {
    const [room, setRoom] = useState<Room | null>(null);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const roomIdRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const resetStates = () => {
        setRoom(null);
        setUsername('');
        setError('');
    }

    const validateUser = async () => {
        const usernameError = validateUsername(username);
        if (usernameError) {
            setError(usernameError);
            return;
        }

        try {
            const authURL = await getAuthURL(username);
            console.log(authURL);
            document.location = authURL;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    // Socket room related functions
    const createRoom = async (username: string) => {
        socket.connect()
        socket.emit('create-room', username);
    }

    const joinRoom = async () => {
        const usernameError = validateUsername(username);
        if (usernameError) {
            setError(usernameError);
            return;
        }

        const roomId = roomIdRef.current?.value.trim();

        const roomIdError = await validateRoomId(username, roomId);
        if (roomIdError) {
            setError(roomIdError);
            return;
        }

        socket.connect()
        socket.emit('join-room', roomId, username);
    }

    const leaveRoom = () => {
        resetStates();
        socket.emit('leave-room', room?.id)
        socket.disconnect();
    }

    useEffect(() => {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const authUsername = params.get('username');
        const authError = params.get('error');

        if (authError) {
            console.error(authError);
            setError('Spotify auth failed');
            navigate('/');
        }

        if (authUsername) {
            setUsername(authUsername);
            createRoom(authUsername);
            navigate('/');
        }

        const onJoinRoom = (updatedRoom: Room) => {
            setRoom(updatedRoom);
        }

        const onLeaveRoom = (updatedRoom: Room) => {
            // Used only when room gets deleted when owner leaves
            // If that functionality is changed, remove this
            if (!updatedRoom) {
                socket.disconnect();
                resetStates();
                return;
            }

            setRoom(updatedRoom);
        }

        socket.on('join-room', onJoinRoom);
        socket.on('leave-room', onLeaveRoom);

        return () => {
            socket.off('join-room', onJoinRoom);
            socket.off('leave-room', onLeaveRoom);
        }
    }, [navigate])

    return (
        <>
            {!room && (
                <div className='flex flex-col gap-2 w-fit'>
                    <h1>Welcome to Roombeat</h1>
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='bg-transparent border border-gray-500 px-3 py-2 text-sm rounded-lg'
                    />
                    <input
                        type='text'
                        placeholder='Room ID'
                        ref={roomIdRef}
                        className='bg-transparent border border-gray-500 px-3 py-2 text-sm rounded-lg'
                    />
                    <button onClick={validateUser} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Create Room</button>
                    <button onClick={joinRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Join Room</button>
                    {error && <ErrorBlock error={error} />}
                </div>
            )}

            {room && <RoomDash
                username={username}
                room={room}
                leaveRoom={leaveRoom}
            />}
        </>
    )
}

export default App;
