import express from 'express';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import log from './middleware/log';
import { Room } from './types/room';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ?? 4000;
const CLIENT_PORT = process.env.CLIENT_PORT ?? 5173;
const HOST = process.env.HOST ?? 'localhost';

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

io.on('connection', socket => {
    let currentUser = ''
    console.log(socket.id, 'connected');

    socket.on('create-room', (room: Room) => {
        // Username validation 
        if (!room.owner || room.owner.length < 2) {
            socket.disconnect();
            return;
        };

        currentUser = room.owner;
        rooms.push(room);

        socket.join(room.id);
        io.to(room.id).emit('join-room', room);

        // DEGUGGING/LOGGING
        console.log(room.owner, socket.id, 'created and joined room', room.id);
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

    socket.on('leave-room', (room: Room) => {
        // TODO: Add a condition:
        // If the user is the last in the room to leave, the room gets removed/deleted

        if (currentUser === room.owner) {
            // Removing the complete room from rooms list if it's the owner
            // Might remove later, not much sure about this approach
            rooms = rooms.filter(prevRoom => prevRoom.id !== room.id);
        } else {
            // Removing just the member from the room members list
            rooms = rooms.map(prevRoom => {
                if (prevRoom.id === room.id) {
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

        const updatedRoom = rooms.find(prevRoom => prevRoom.id === room.id);
        socket.leave(room.id)
        io.to(room.id).emit('leave-room', updatedRoom);

        // DEGUGGING/LOGGING
        console.log(currentUser, socket.id, 'left room', room.id);
        console.log(rooms);
    })

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    })

    // TODO: Try something like this in future
    // socket.on('create-room', (room: Room) => createRoom(socket, rooms, currentUser, room));
    // socket.on('leave-room', (room: Room) => leaveRoom(socket, rooms, currentUser, room));
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

