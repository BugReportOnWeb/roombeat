import { useEffect, useRef, useState } from "react";
import { socket } from "./socket/socket";
import { Room } from "./types/room";
import RoomDash from "./components/RoomDash";
import Error from "./components/Error";
import { validateRoomId, validateUsername } from "./lib/validation";

const App = () => {
    const [room, setRoom] = useState<Room | null>(null);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const roomIdRef = useRef<HTMLInputElement | null>(null);

    const resetStates = () => {
        setRoom(null);
        setUsername('');
        setError('');
    }

    const createRoom = async () => {
        // This gets the spotify auth page URL
        // TODO: shift to 'validateUser'
        try {
            const res = await fetch('http://localhost:3000/api/spotify/auth');
            const data = await res.json();
            console.log(data);
            document.location = data.authURL;
        } catch (error) {
            console.error(error);
        }

        // Original content of createing room
        // Called from useEffect when checked for queryString values
          
        // const usernameError = validateUsername(username);
        // if (usernameError) {
        //     setError(usernameError);
        //     return;
        // }

        // socket.connect()
        // socket.emit('create-room', username);
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
        // TODO: Use this with a checker
        // Redirect to original router (router-dom) if queryString
        // Change state values with username, room and fetched data
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);

        const testing = params.get('testing');
        const username =  params.get('username');
        console.log({ testing, username });

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
    }, [])

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
                    <button onClick={createRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Create Room</button>
                    <button onClick={joinRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Join Room</button>
                    {error && <Error error={error} />}
                </div>
            )}

            {room && <RoomDash username={username} room={room} leaveRoom={leaveRoom} />}
        </>
    )
}

export default App;
