// Core
import express from 'express';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

dotenv.config();

// Extras
import log from './middleware/log';
import { Room } from './types/room';
import { roomIdGenerator } from './lib/util';

// Spotify
import { SpotifyData } from './types/spotify';
import {
    getSpotifyPlaybackData,
    getSpotifyUserData,
    playPause, skipToNext,
    skipToPreivous
} from './lib/spotify';

// TODO: Use theses vars wherever neccerary (controllers/lib)
const SERVER_PORT = process.env.SERVER_PORT as string;
const CLIENT_PORT = process.env.CLIENT_PORT as string;
const HOST = process.env.HOST as string;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: `http://${HOST}:${CLIENT_PORT}`
    }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(log);

// TODO: Create DB dir for all these DB stuff
// Helps in using them throughtout the server
let rooms: Room[] = [];

// ------------------
// SOCKET STUFF HERE
// ------------------

io.on('connection', socket => {
    let currentUser = ''
    console.log(socket.id, 'connected');

    socket.on('create-room', async (owner: string) => {
        if (!owner || owner.length < 2) {
            socket.disconnect();
            return;
        };

        const newRoom: Room = {
            id: roomIdGenerator(),
            owner: owner.trim(),
            members: [owner.trim()],
        }

        currentUser = newRoom.owner;
        rooms.push(newRoom);

        socket.join(newRoom.id);
        io.to(newRoom.id).emit('join-room', newRoom);

        // DEGUGGING/LOGGING
        console.log(newRoom.owner, socket.id, 'created and joined room', newRoom.id);
        console.log(rooms);
    })

    socket.on('join-room', (roomId: string, username: string) => {
        const room = rooms.find(room => room.id === roomId);
        const user = rooms.find(room => (
            room.members.find(member => member === username)
        ));

        if (
            !username || username.length < 2 ||
            !roomId || roomId.length < 5 ||
            !room || user
        ) {
            socket.disconnect();
            return;
        }

        // TODO?: Have some kind of util for these types of array operations
        currentUser = username;
        rooms = rooms.map(room => {
            return room.id === roomId
                ? { ...room, members: [...room.members, currentUser] }
                : room
        })

        const updatedRoom = rooms.find(room => room.id === roomId);
        socket.join(roomId);
        io.to(roomId).emit('join-room', updatedRoom);

        // DEGUGGING/LOGGING
        console.log(currentUser, socket.id, 'joined room', roomId);
        console.log(rooms);
    })

    socket.on('leave-room', (roomId: string) => {
        // TODO: Add a condition:
        // If the user is the last in the room to leave, the room gets removed/deleted

        // Removing the complete room from rooms list if it's the owner
        // Might remove later, not much sure about this approach
        const roomOwner = rooms.find(room => room.id === roomId)?.owner;
        if (currentUser === roomOwner) {
            rooms = rooms.filter(prevRoom => prevRoom.id !== roomId);
        } else {
            // Removing just the member from the room members list
            rooms = rooms.map(prevRoom => {
                if (prevRoom.id === roomId) {
                    const updatedMembers = prevRoom.members.filter(member => {
                        return member !== currentUser
                    })

                    const updatedRoom: Room = { ...prevRoom, members: updatedMembers };
                    return updatedRoom;
                } else {
                    return prevRoom;
                }
            })
        }

        const updatedRoom = rooms.find(prevRoom => prevRoom.id === roomId);
        socket.leave(roomId)
        io.to(roomId).emit('leave-room', updatedRoom);

        // DEGUGGING/LOGGING
        console.log(currentUser, socket.id, 'left room', roomId);
        console.log(rooms);
    })

    socket.on('populate-spotify-room', async (roomId: string) => {
        const user = await getSpotifyUserData(authToken);
        const playback = await getSpotifyPlaybackData(authToken);
        const spotify: SpotifyData = { user, playback }

        const room = rooms.find(room => room.id === roomId)!;
        const updatedRoom: Room = { ...room, spotify }

        rooms = rooms.map(room => {
            return room.id === roomId
                ? updatedRoom
                : room
        })

        io.to(roomId).emit('populate-spotify-room', updatedRoom);

        // DEGUGGING/LOGGING
        console.log(currentUser, socket.id, 'populated spotify data in room', roomId);
        // console.log(rooms);
    })

    socket.on('skip-previous-spotify-room', async (roomId: string) => {
        const spotify = await skipToPreivous(authToken);

        const room = rooms.find(room => room.id === roomId)!;
        const updatedRoom: Room = { ...room, spotify }

        rooms = rooms.map(room => {
            return room.id === roomId
                ? updatedRoom
                : room
        })

        io.to(roomId).emit('skip-previous-spotify-room', updatedRoom);

        // DEGUGGING/LOGGING
        console.log(currentUser, socket.id, 'skipped to previous in room', roomId);
        // console.log(rooms);
    })

    socket.on('skip-next-spotify-room', async (roomId: string) => {
        const spotify = await skipToNext(authToken);

        const room = rooms.find(room => room.id === roomId)!;
        const updatedRoom: Room = { ...room, spotify }

        rooms = rooms.map(room => {
            return room.id === roomId
                ? updatedRoom
                : room
        })

        io.to(roomId).emit('skip-next-spotify-room', updatedRoom);

        // DEGUGGING/LOGGING
        console.log(currentUser, socket.id, 'skipped to next in room', roomId);
        // console.log(rooms);
    })

    socket.on('play-pause-spotify-room', async (roomId: string, isPlaying: boolean) => {
        const spotify = await playPause(authToken, isPlaying);

        const room = rooms.find(room => room.id === roomId)!;
        const updatedRoom: Room = { ...room, spotify }

        rooms = rooms.map(room => {
            return room.id === roomId
                ? updatedRoom
                : room
        })

        io.to(roomId).emit('play-pause-spotify-room', updatedRoom);

        // DEGUGGING/LOGGING
        console.log(currentUser, socket.id, `${isPlaying ? 'paused' : 'played'} in room`, roomId);
        // console.log(rooms);
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    })

    // TODO: Gotta move every event into a different file
    // Try something like this in future
    // socket.on('create-room', (room: Room) => createRoom(room));
    // socket.on('leave-room', (room: Room) => leaveRoom(room));
})


// ------------------
// ROUTING STUFF HERE
// ------------------


let authUsername = '';
// TODO: Store authTokem in a key-value form
// REAL BIG BUG HERE BECAUSE OF THIS!!!!
// roomID - token
let authToken = '';


// TODO: Move all the calls the their respective routes and controllers
app.get('/api/spotify/data', async (_req, res) => {
    try {
        const user = await getSpotifyUserData(authToken);
        const playback = await getSpotifyPlaybackData(authToken);
        const spotifyData: SpotifyData = { user, playback }

        res.send(spotifyData);
    } catch (error) {
        throw error;
    }
});

app.get('/api/spotify/auth', async (req, res) => {
    const { username } = req.query;

    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';

    const params = new URLSearchParams();
    params.append('client_id', SPOTIFY_CLIENT_ID);
    params.append('response_type', 'code');
    params.append('scope', scope);
    params.append('redirect_uri', REDIRECT_URI);

    try {
        const spotifyRes = await fetch(`https://accounts.spotify.com/authorize?${params.toString()}`);
        const authURL = spotifyRes.url;

        if (!spotifyRes.ok) {
            throw new Error(`${spotifyRes.status} Some error occured`);
        }

        authUsername = username ? username.toString() : ''
        res.send({ authURL });
    } catch (error) {
        throw error;
    }
})

app.get('/api/spotify/', async (req, res) => {
    const { code } = req.query;

    const requestParams = new URLSearchParams();
    requestParams.append('client_id', SPOTIFY_CLIENT_ID);
    requestParams.append('client_secret', SPOTIFY_CLIENT_SECRET);
    requestParams.append('grant_type', 'authorization_code');
    requestParams.append('code', code ? code.toString() : '');
    requestParams.append('redirect_uri', REDIRECT_URI);

    try {
        const spotifyRes = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestParams.toString()
        })

        const data = await spotifyRes.json();

        if (!spotifyRes.ok) {
            throw new Error(data.error);
        }

        authToken = data.access_token;
        res.redirect(`http://localhost:5173?username=${authUsername}`);
    } catch (error) {
        res.redirect(`http://localhost:5173?error=${error}`);
    }
})

// Validation Routes
app.get('/api/rooms/:roomId', (req, res) => {
    const { roomId } = req.params;

    const room = rooms.find(room => room.id === roomId);

    if (!room) {
        res.status(404).send({ error: 'Room doesn\'t exist' })
        return;
    }

    res.send(room);
})

app.get('/api/users/:username', (req, res) => {
    const { username } = req.params;

    const user = rooms.find(room => {
        return room.members.find(member => member === username);
    })

    if (!user) {
        res.status(404).send({ error: 'User doesn\'t exist' })
        return;
    }

    res.send(user)
})

server.listen(+SERVER_PORT, HOST, () => {
    console.log(`Server listening on port ${HOST}:${SERVER_PORT}`);
})

