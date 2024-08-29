import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../auth/auth';
import { userRegistrationHandler, userLoginHandler, updateUserHandler,getAUserHandler,deleteAUserHandler, getAllUsersHandler, forgotPasswordHandler, resetPasswordHandler, changePasswordHandler, verifyOtpHandler } from '../controllers/user.controller';
import { isAuthenticated, handleGoogleCallback, logout } from 'src/auth/auth';
const router = express.Router()
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google', {session:false}), handleGoogleCallback)
router.get('/logout', logout)
router.get('/dashboard', isAuthenticated, (req:express.Request, res:express.Response) => {
    res.send('Welcome to your dashboard!')
})
router.post('/register', userRegistrationHandler );
router.post('/login', authenticateToken, userLoginHandler);
router.put('/update/:id', authenticateToken, updateUserHandler );
router.post('/reset-password', resetPasswordHandler);
router.post('/change-password', changePasswordHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/verify-password', verifyOtpHandler)
router.get('/:id',authenticateToken,  getAUserHandler );
router.get('/', getAllUsersHandler);
router.delete('/delete/:id', authenticateToken,  deleteAUserHandler);
export default router;