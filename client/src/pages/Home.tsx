// Core
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Context
import { UsernameContext } from "../context/UsernameContext";
import { UsernameContextType } from "../types/context";
import { RoomContext } from "../context/RoomContext";

// Extras
import { Room, RoomContextType } from "../types/room";
import { socket } from "../socket/socket";
import Dashboard from "../components/Dashboard";
import { Link } from "react-router-dom";

const Home = () => {
    const { username, setUsername } = useContext(UsernameContext) as UsernameContextType;
    const { room, setRoom } = useContext(RoomContext) as RoomContextType;

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const resetStates = () => {
        setRoom(null);
        setUsername('');
        setError('');
    }

    // TODO: Shift every create thing under CreateRoom
    // Have callback to ::1.5173/create-rom?username='foo'
    // And then redirect to just '/'
    const createRoom = async (username: string) => {
        socket.connect()
        socket.emit('create-room', username);
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

        // TODO: All these 'updatedRoom' on can be into one socket event;
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

        const onPopulateSpotifyRoom = (updatedRoom: Room) => {
            setRoom(updatedRoom);
        }

        const onSkipPreviousSpotifyRoom = (updatedRoom: Room) => {
            setRoom(updatedRoom);
        }

        const onSkipNextSpotifyRoom = (updatedRoom: Room) => {
            setRoom(updatedRoom);
        }

        const onPlayPauseSpotifyRoom = (updatedRoom: Room) => {
            setRoom(updatedRoom);
        }

        // Room Related
        socket.on('join-room', onJoinRoom);
        socket.on('leave-room', onLeaveRoom);

        // Spotify Related
        socket.on('populate-spotify-room', onPopulateSpotifyRoom);
        socket.on('skip-previous-spotify-room', onSkipPreviousSpotifyRoom);
        socket.on('skip-next-spotify-room', onSkipNextSpotifyRoom);
        socket.on('play-pause-spotify-room', onPlayPauseSpotifyRoom);

        return () => {
            socket.off('join-room', onJoinRoom);
            socket.off('leave-room', onLeaveRoom);

            socket.off('populate-spotify-room', onPopulateSpotifyRoom);
            socket.off('skip-previous-spotify-room', onSkipPreviousSpotifyRoom);
            socket.off('skip-next-spotify-room', onSkipNextSpotifyRoom);
            socket.off('play-pause-spotify-room', onPlayPauseSpotifyRoom);
        }
    }, [])

    return (
        <>
            {!room && !error && (
                <div className='min-h-screen flex justify-center items-center -mt-5'>
                    <div className='flex flex-col gap-7 text-center'>
                        <h1 className='text-5xl font-extrabold uppercase tracking-[0.2rem]'>Roombeat</h1>
                        <div className='flex gap-3'>
                            <Link to='/create-room' className='inline-flex justify-center items-center border border-[#27272a] text-sm px-4 py-3 w-full h-fit rounded-lg cursor-pointer hover:bg-[#27272a]'>Create Room</Link>
                            <Link to='/join-room' className='inline-flex justify-center items-center border border-[#27272a] text-sm px-4 py-3 w-full h-fit rounded-lg cursor-pointer hover:bg-[#27272a]'>Join Room</Link>
                        </div>
                    </div> 
                </div>
            )}

            {error && console.log(error)}

            {room && <Dashboard
                username={username}
                room={room}
                leaveRoom={leaveRoom}
            />}
        </>
    )
}

export default Home;
