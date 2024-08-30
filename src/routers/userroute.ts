import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../auth/auth';
import { userRegistrationHandler,
     userLoginHandler, updateUserHandler,
     getAUserHandler,deleteAUserHandler, getAllUsersHandler, forgotPasswordHandler,
      resetPasswordHandler, changePasswordHandler, 
      verifyOtpHandler } from '../controllers/user.controller';
const router = express.Router()
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