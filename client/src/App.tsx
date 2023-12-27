import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import { roomIdGenerator } from "./lib/util";

type Room = {
    id: string;
    owner: string;
    members: string[];
}

const App = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [joinedRoom, setJoinedRoom] = useState<Room | null>(null);
    const [username, setUsername] = useState('');

    const createRoom = () => {
        const roomId = roomIdGenerator();

        const room = {
            id: roomId,
            owner: username,
            members: [username]
        }

        setJoinedRoom(room);
        socket.connect().emit('create-room', room);
    }

    const leaveRoom = (room: Room) => {
        setJoinedRoom(null);
        setUsername('');
        socket.emit('leave-room', room).disconnect();
    }

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(true);
        }

        const onDisconnect = () => {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, [])

    return (
        <>
            {!joinedRoom && (
                <div className='flex flex-col gap-2 w-fit'>
                    <h1>Hello World - {String(isConnected)}</h1>
                    <input
                        type='username'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='bg-transparent border border-gray-500 px-3 py-2 text-sm rounded-lg'
                    />
                    <button onClick={createRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Create Room</button>
                </div>
            )}

            {joinedRoom && (
                <>
                    <h1>{username}- {joinedRoom.id} - {String(isConnected)}</h1>
                    <button onClick={() => leaveRoom(joinedRoom)} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Leave Room</button>
                </>
            )}
        </>
    )
}

export default App;
