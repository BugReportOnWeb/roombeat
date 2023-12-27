import express from 'express';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import log from './middleware/log';
import { userRoutes } from './routes/user';

type Room = {
    id: string;
    owner: string;
    members: string[];
}

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
    let currenUser = ''
    console.log(socket.id, 'connected');

    socket.on('create-room', (room: Room) => {
        rooms.push(room);
        currenUser = room.owner;
        socket.join(room.id);

        // DEGUGGING/LOGGING
        console.log(room.owner, socket.id, 'created and joined on room', room.id);
    })

    socket.on('leave-room', (room: Room) => {
        const isOwner = room.owner === currenUser;

        if (isOwner) {
            // Removing the complete room from rooms list
            console.log('here');
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
        console.log(currenUser, socket.id, 'left room', room.id);
    })

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    })
})

// Routes
app.use('/api/users', userRoutes);

server.listen(+SERVER_PORT, HOST, () => {
    console.log(`Server listening on port ${HOST}:${SERVER_PORT}`);
})

