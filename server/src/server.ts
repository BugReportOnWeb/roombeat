import express from 'express';

import * as dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import log from './middleware/log';
import { Room } from './types/room';
import { roomIdGenerator } from './lib/util';
import { getSpotifyAcessToken, getSpotifyProfileData } from './lib/spotify';

const SERVER_PORT = process.env.SERVER_PORT ?? 4000;
const CLIENT_PORT = process.env.CLIENT_PORT ?? 5173;
const HOST = process.env.HOST ?? 'localhost';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
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

let rooms: Room[] = [];


// ------------------
// SOCKET STUFF HERE
// ------------------


io.on('connection', socket => {
    let currentUser = ''
    console.log(socket.id, 'connected');

    socket.on('create-room', async (owner: string) => {
        // Username validation 
        if (!owner || owner.length < 2) {
            socket.disconnect();
            return;
        };

        const tokenDetails = await getSpotifyAcessToken();
        const profileData = await getSpotifyProfileData(tokenDetails);
        console.log(profileData);

        const newRoom: Room = {
            id: roomIdGenerator(),
            owner: owner.trim(),
            members: [owner.trim()]
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

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    })

    // TODO: Try something like this in future
    // socket.on('create-room', (room: Room) => createRoom(socket, rooms, currentUser, room));
    // socket.on('leave-room', (room: Room) => leaveRoom(socket, rooms, currentUser, room));
})


// ------------------
// ROUTING STUFF HERE
// ------------------

let username = '';

app.get('/api/spotify/auth', async (_req, res) => {
    username = 'Dev';
    const params = new URLSearchParams();
    params.append('client_id', SPOTIFY_CLIENT_ID);
    params.append('response_type', 'code');
    params.append('scope', 'user-read-private user-read-email');
    params.append('redirect_uri', REDIRECT_URI);

    const URL = `https://accounts.spotify.com/authorize?${params.toString()}`;

    try {
        const result = await fetch(URL);
        const authURL = result.url;

        if (!result.ok) {
            throw new Error('Some error occured');
        }

        console.log(authURL);
        res.send({ authURL });
    } catch (error) {
        if (error instanceof Error) {
            res.status(409).send(error.message);
        }
    }
})


app.get('/api/spotify/', (req, res) => {
    console.log('code', req.query);

    const params = new URLSearchParams();
    params.append('testing', 'working');
    params.append('username', username);

    res.redirect(`http://localhost:5173?${params.toString()}`);
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

