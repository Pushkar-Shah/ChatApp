import express from 'express';
import dotenv from 'dotenv'
import mongoose from'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authroutes from './routes/AuthRoute.js';
import messagesRoute from './routes/MessagesRoute.js';
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import contactroutes from './routes/ContactRoute.js';
import setupSocket from './socket.js';
import channelRoutes from './routes/ChannelRoute.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
        origin: [process.env.ORIGIN],
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
        credentials: true,// for enabling cookies to work properly
    }));

// app.use("/uploads/profiles",express.static("/uploads/profiles"))
app.use("/uploads/profiles", express.static(join(__dirname, 'uploads', 'profiles')));
app.use("/uploads/files", express.static(join(__dirname, 'uploads', 'files')));
app.use(cookieParser());
const server = app.listen(port, ()=>{
        console.log(`Server is running at http://localhost:${port}`);
});
app.use(express.json());

app.use('/api/auth',authroutes);
app.use('/api/contacts',contactroutes);
app.use('/api/messages',messagesRoute);
app.use('/api/channel',channelRoutes);

setupSocket(server);

mongoose.connect(databaseURL).then(()=>{
        console.log('Database connected successfully');
}).catch((error) => {
        console.log('Error connecting to MongoDB: '+ error.message);
});

