import express from 'express';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import log from './middleware/log';
import { userRoutes } from './routes/user';
import { Room } from './types/room';
// import { createRoom, leaveRoom } from './socket/events';

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
app.use(express.json());
app.use(log);

let rooms: Room[] = [];

io.on('connection', socket => {
    let currentUser = ''
    console.log(socket.id, 'connected');

    socket.on('create-room', (room: Room) => {
        rooms.push(room);
        currentUser = room.owner;
        socket.join(room.id);

        // DEGUGGING/LOGGING
        console.log(room.owner, socket.id, 'created and joined room', room.id);
    })

    socket.on('join-room', (roomId: string, username: string) => {
        currentUser = username;

        // Add currentUser to specified room members list 
        // TODO: Have some kind of util for these types of array operations
        rooms = rooms.map(room => {
            return room.id === roomId
                ? {...room, members: [...room.members, currentUser]}
                : room
        })

        socket.join(roomId);
        console.log(currentUser, socket.id, 'joined room', roomId);

        const room = rooms.find(room => room.id === roomId);
        socket.emit('join-room', room);
    })

    socket.on('leave-room', (room: Room) => {
        const isOwner = room.owner === currentUser;

        if (isOwner) {
            // Removing the complete room from rooms list
            rooms = rooms.filter(prevRoom => prevRoom.owner !== room.owner);
        } else {
            // Removing just the member from the room members list
            rooms = rooms.map(room => {
                return room.members.find(member => member === socket.id)
                    ? { ...room, members: room.members.filter(member => member !== socket.id) }
                    : room
            })
        }

        socket.leave(room.id)

        // DEGUGGING
        console.log(currentUser, socket.id, 'left room', room.id);
    })

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    })

    socket.on('testing-send-message', (message: string, room: Room) => {
        io.to(room.id).emit('testing-send-message', message);
    })

    // TODO: Try something like this in future
    // socket.on('create-room', (room: Room) => createRoom(socket, rooms, currentUser, room));
    // socket.on('leave-room', (room: Room) => leaveRoom(socket, rooms, currentUser, room));
})

// Routes
app.use('/api/users', userRoutes);

server.listen(+SERVER_PORT, HOST, () => {
    console.log(`Server listening on port ${HOST}:${SERVER_PORT}`);
})

