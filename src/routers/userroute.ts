import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../auth/auth';
import { userRegistrationHandler,
     userLoginHandler, updateUserHandler,
     getAUserHandler,deleteAUserHandler, getAllUsersHandler, forgotPasswordHandler,
      resetPasswordHandler, changePasswordHandler, calculateProgressHandler,
      verifyOtpHandler, verifyEmailOtpHandler} from '../controllers/user.controller';
const router = express.Router()
router.post('/register', userRegistrationHandler );
router.post('/verify-email', authenticateToken, verifyEmailOtpHandler)
router.post('/login', authenticateToken, userLoginHandler);
router.put('/update/:id', authenticateToken, updateUserHandler );
router.post('/reset-password/:id', resetPasswordHandler);
router.post('/change-password/:id', changePasswordHandler);
router.post('/forgot-password/:id', forgotPasswordHandler);
router.post('/verify-password/:id', verifyOtpHandler)
router.get('/:id',authenticateToken,  getAUserHandler );
router.get('/', getAllUsersHandler);
router.get('/progress/:userId', calculateProgressHandler)
router.delete('/delete/:id', authenticateToken,  deleteAUserHandler);
export default router;