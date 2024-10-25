import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../auth/auth';
import { userRegistrationHandler, 
     userLoginHandler, updateUserHandler, resendUserOtpHandle,
     getAUserHandler,deleteAUserHandler, getAllUsersHandler, forgotPasswordHandler,
      resetPasswordHandler, changePasswordHandler, calculateProgressHandler,
      verifyOtpHandler, verifyEmailOtpHandler,updateStreakHandler,
      searchUserByUsernameHandler} from '../controllers/user.controller';
const router = express.Router()
router.post('/register', userRegistrationHandler );
router.post('/verify-email/:id',verifyEmailOtpHandler)
router.post('/login', userLoginHandler);
router.put('/update/:id', authenticateToken, updateUserHandler );
router.post('/reset-password/:id', resetPasswordHandler);
router.post('/change-password/:id', changePasswordHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/verify-password/:id', verifyOtpHandler)
router.get('/:id',authenticateToken,  getAUserHandler );
router.get('/', getAllUsersHandler);
router.get('/progress/:userId', calculateProgressHandler)
router.delete('/delete/:id', authenticateToken,  deleteAUserHandler);
router.put('/update-streak/:userid',authenticateToken, updateStreakHandler)
router.get('/username', searchUserByUsernameHandler)
//router.post('/upload-picture/:userId',uploadProfilePictureHandler)
router.post('/resend-otp/:id', resendUserOtpHandle)
export default router;