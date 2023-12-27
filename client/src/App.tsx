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
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

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

    const joinRoom = () => {
        socket.connect().emit('join-room', roomId, username);
    }

    const leaveRoom = (room: Room) => {
        setJoinedRoom(null);
        setUsername('');
        setRoomId('');

        socket.emit('leave-room', room).disconnect();
    }

    // FOR TESTING PURPOSE
    const sendMessage = () => {
        socket.emit('testing-send-message', message, joinedRoom);
    }

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(true);
        }

        const onDisconnect = () => {
            setIsConnected(false);
        }

        const onJoinRoom = (room: Room) => {
            setJoinedRoom(room);
        }

        const onSendMessage = (message: string) => {
            setMessage('');
            setMessages(prevMessage => {
                return prevMessage
                    ? [...prevMessage, message]
                    : [message]
            })
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('join-room', onJoinRoom);
        socket.on('testing-send-message', onSendMessage);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('join-room', onJoinRoom);
            socket.off('testing-send-message', onSendMessage);
        }
    }, [])

    return (
        <>
            {!joinedRoom && (
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
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className='bg-transparent border border-gray-500 px-3 py-2 text-sm rounded-lg'
                    />
                    <button onClick={createRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Create Room</button>
                    <button onClick={joinRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Join Room</button>
                </div>
            )}

            {joinedRoom && (
                <div className='flex flex-col gap-3 w-fit'>
                    <h1>{username}- {joinedRoom.id} - {String(isConnected)}</h1>
                    <button onClick={() => leaveRoom(joinedRoom)} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Leave Room</button>
                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        className='bg-transparent border border-gray-500 px-3 py-2 text-sm rounded-lg'
                    />
                    <button onClick={sendMessage} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Send Message</button>
                    {messages.map(message => (
                        <h1>{message}</h1>
                    ))}
                </div>
            )}
        </>
    )
}

export default App;
