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
        io.to(room.id).emit('join-room', room);

        // DEGUGGING/LOGGING
        console.log(room.owner, socket.id, 'created and joined room', room.id);
        console.log(rooms);
    })

    socket.on('join-room', (roomId: string, username: string) => {
        currentUser = username;

        // Add currentUser to specified room members list 
        // TODO: Have some kind of util for these types of array operations
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

