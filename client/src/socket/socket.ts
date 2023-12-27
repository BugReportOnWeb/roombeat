import { io } from "socket.io-client";

// TODO: Get values from .env file
const SERVER_URL = import.meta.env.PROD
    ? 'https://prod-server-domain.com'
    : 'http://localhost:3000'

const socket = io(SERVER_URL, {
    autoConnect: false
});

export { socket };
