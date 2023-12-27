import express from 'express';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import log from './middleware/log';
import { userRoutes } from './routes/user';

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

io.on('connection', socket => {
    console.log('User Joined');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

// Routes
app.use('/api/users', userRoutes);

server.listen(+SERVER_PORT, HOST, () => {
    console.log(`Server listening on port ${HOST}:${SERVER_PORT}`);
})

