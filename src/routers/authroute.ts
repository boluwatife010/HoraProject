import express from 'express';
import passport from 'passport'
const router = express.Router();
import { logout, handleGoogleCallback, isAuthenticated } from '../auth/auth';
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google', {session:false}), handleGoogleCallback)
router.get('/logout', logout)
router.get('/dashboard', isAuthenticated, (req:express.Request, res:express.Response) => {
    res.send('Welcome to your dashboard!')
})
export default router