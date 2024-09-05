import express from 'express';
import passport from './src/auth/passport';
import session from 'express-session';
import dotenv from 'dotenv'
import userRouter from './src/routers/userroute' 
import taskRouter from './src/routers/taskroute';
import authRouter from './src/routers/authroute';
import groupRouter from './src/routers/notificationrouter'
import connectDb from './db';
import notificationRouter from './src/routers/notificationrouter'
dotenv.config()
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || ' ',
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));
app.use(passport.initialize());
app.use(passport.session());
connectDb()
const PORT = process.env.PORT || 8090
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/group', groupRouter)
app.use ('/api', notificationRouter)
app.use ('/api/auth', authRouter)
app.listen(PORT, async () => {
    console.log('Server is running at port 8090.')
   
})
