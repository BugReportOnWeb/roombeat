import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import { roomIdGenerator } from "./lib/util";
import { Room } from "./types/room";
import RoomDash from "./components/RoomDash";

const App = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [room, setRoom] = useState<Room | null>(null);

    const [username, setUsername] = useState('');
    const [inputRoomId, setInputRoomId] = useState('');

    const createRoom = () => {
        // TODO: Handle form validation errors
        // - Empty or short username
        const roomId = roomIdGenerator();

        const newRoom = {
            id: roomId,
            owner: username,
            members: [username]
        }

        socket.connect().emit('create-room', newRoom);
    }

    const joinRoom = () => {
        // TODO: Handle form validation errors
        // - Empty or short or already existing (in room) username
        // - Non-existing room ID or empty ID

        setInputRoomId(inputRoomId.trim());
        socket.connect().emit('join-room', inputRoomId.trim(), username);
    }

    const leaveRoom = () => {
        // Removing everything in the state
        setRoom(null);
        setUsername('');
        setInputRoomId('');

        socket.emit('leave-room', room).disconnect();
    }

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(true);
        }

        const onDisconnect = () => {
            setIsConnected(false);
        }

        const onJoinRoom = (updatedRoom: Room) => {
            setRoom(updatedRoom);
        }

        const onLeaveRoom = (updatedRoom: Room) => {
            setRoom(updatedRoom);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('join-room', onJoinRoom);
        socket.on('leave-room', onLeaveRoom);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('join-room', onJoinRoom);
            socket.off('leave-room', onLeaveRoom);
        }
    }, [])

    return (
        <>
            {!room && (
                <div className='flex flex-col gap-2 w-fit'>
                    <h1>Hello World - {String(isConnected)}</h1>
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
                        value={inputRoomId}
                        onChange={(e) => setInputRoomId(e.target.value)}
                        className='bg-transparent border border-gray-500 px-3 py-2 text-sm rounded-lg'
                    />
                    <button onClick={createRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Create Room</button>
                    <button onClick={joinRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Join Room</button>
                </div>
            )}

            {room && <RoomDash username={username} room={room} leaveRoom={leaveRoom} />}
        </>
    )
}

export default App;
