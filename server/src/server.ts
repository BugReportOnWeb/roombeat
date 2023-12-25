import express from 'express';
import log from './middleware/log';
import { userRoutes } from './routes/user';

const PORT = process.env.PORT ?? 4000;
const HOST = process.env.HOST ?? 'localhost';

const app = express();

// Middleware
app.use(express.json());
app.use(log);

// Routes
app.use('/api/users', userRoutes);

app.listen(+PORT, HOST, () => {
    console.log(`Server listening on port ${HOST}:${PORT}`) ;
})

