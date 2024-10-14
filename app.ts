import express from 'express';
import passport from './src/auth/passport';
import session from 'express-session';
import { Server as SocketIOServer , Socket} from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import userRouter from './src/routers/userroute' 
import taskRouter from './src/routers/taskroute';
import authRouter from './src/routers/authroute';
import groupRouter from './src/routers/grouproute'
import connectDb from './db';
import notificationRouter from './src/routers/notificationrouter'
dotenv.config()

const app = express();
const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});
app.set('io', io)
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || ' ',
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));
  // added cors for frontend connection
  app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }));
app.use(passport.initialize());
app.use(passport.session());
connectDb()
const PORT = process.env.PORT || 5173
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/group', groupRouter)
app.use ('/api', notificationRouter)
app.use ('/api/auth', authRouter)

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);
  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
export {io}
server.listen(PORT, async () => {
    console.log('Server is running at port 5173.')
   
})
