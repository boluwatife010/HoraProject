import e from "express";
import { loginUser, registerUser, getAllUsers, 
    getUser, deleteUser, updateUser, forgotPassword, resetPassword, changePassword, 
    verifyOTP, verifyEmailOtp, updateStreak, searchUserByUsername, 
    calculateProgress, resendOTP} from "../services/userservice";
import express from 'express';

// export const uploadProfilePictureHandler = async (req: express.Request, res: express.Response) => {
//     try {
//       if (!req.file) {
//         return res.status(400).send({ message: 'No file uploaded' });
//       }
//       const result = await saveProfilePicture(req.file);
//       return res.status(200).send(result);
//     } catch (error) {
//       console.error('Error:', error);
//       return res.status(500).send({ message: 'Internal server error'});
//     }
//   };


export const userRegistrationHandler = async (req:express.Request, res: express.Response) => {
    const {email, password, username} = req.body;
    try {
    if (!email || !password ) {
        return res.status(400).send({message: 'Please fill in the required fields.'});
    }
    const register = await registerUser({email, password, username});
    if (!register) {
        return res.status(400).send({message: 'Cross-check your details please.'});
    }
    return res.status(200).send({message: 'User successfully created.', register});
   }    catch (err) {
    console.log(err, 'Invalid err');
    return res.status(500).send({message: 'Internal server error.'});
   }
}
export const verifyEmailOtpHandler = async (req: express.Request, res: express.Response) => {
    const {email, otp} = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).send({message: 'Please provide the email and otp.'})
        }
        const verify = await verifyEmailOtp(email, otp)
        if(!verify) {
            return res.status(400).send({message: 'Could not verify otp :('})
        }
        return res.status(200).send({message: 'Successfully verified email! :)'})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'});
       }
}
export const userLoginHandler = async (req: express.Request, res: express.Response) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({message: 'Please fill in the required fields.'});
        }
        const login = await loginUser({email, password});
        if (!login) {
            return res.status(400).send({message: 'Could not find user with this details'});
        }
        return res.status(200).send({message: 'User successfully logged in', login});
    }   catch (err) {
        console.log(err, 'Invalid err')
        return res.status(500).send({message: 'Internal server error.'})
    }
}
export const updateUserHandler = async (req: express.Request, res: express.Response) => {
    const {email, password, username} = req.body;
    const {id} = req.params;
    try {
        if (!email || !password && !username) {
            return res.status(400).send({message: 'Please update one of the required fields.'});
        };
        const update = await updateUser({email, password, username}, id);
        if (!update) {
            return res.status(400).send({message: 'Could not update user.'});
        }
        return res.status(200).send({message: 'User successsfully updated', update});
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getAUserHandler = async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id.'});
        }
        const get = await getUser(id);
        if (!get) {
            return res.status(400).send({message: 'Could not get user by id.'})
        }
        return res.status(200).send({message: 'Successfully got a user', get});
    }    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getAllUsersHandler = async (req: express.Request, res: express.Response) => {
    try {
        const allUsers = await getAllUsers();
        if (!allUsers) {
            return res.status(400).send({message: 'Could not get all users.'})
        }
        return res.status(200).send({message: 'Successfully got all users', allUsers});
    }    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const deleteAUserHandler = async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id.'});
        }
        const deleting = await deleteUser(id);
        if (!deleting) {
            return res.status(400).send({message: 'Could not delete user by id.'})
        }
        return res.status(200).send({message: 'Successfully deleted user.'});
    }    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const calculateProgressHandler = async (req: express.Request, res: express.Response) => {
    const {userId} = req.params;
    try {
       if (!userId) {
        return res.status(400).send({message: 'Please provide the following details,'})
       } 
       const progress = await calculateProgress(userId);
       if (!progress) {
        return res.status(400).send({message: 'Could not calculate user progress'})
       }
       return res.status(200).send({message: 'Successfully calculated user progress', progress})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const changePasswordHandler = async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const {newPassword, oldPassword} = req.body;
    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).send({message: 'Please provide the required fields'})
        }
        const changingPassword = await changePassword(id, {newPassword, oldPassword})
        if(!changingPassword) {
            return res.status(400).send({message: 'Could not change the password'});
        }
        return res.status(200).send({message: 'Successfully changed password.'})
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const forgotPasswordHandler = async (req: express.Request, res: express.Response) => {
    const {email} = req.body;
    try {
        if(!email) {
            return res.status(400).send({message: 'Please provide a valid email address'})
        }
        const forgetRoute =await forgotPassword(email);
        if (!forgetRoute) {
            return res.status(400).send({message: 'could not create otp'})
        }
        return res.status(200).send({message: 'Successfully sent otp check your email.', forgetRoute})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const resetPasswordHandler = async (req: express.Request, res: express.Response) => {
    const {email, otp, newPassword} = req.body
    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).send({mesage: 'Provide the following details'})
        }
        const resetRoute = await resetPassword(email, newPassword, otp)
        if (!resetRoute) {
            return res.status(400).send({message: 'Could not reset password.'});
        }
        return res.status(200).send({message: 'Password successfully reset.'})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const verifyOtpHandler = async (req: express.Request, res: express.Response) => {
    const { email, otp } = req.body;
  
    try {
      if (!email || !otp) {
        return res.status(400).send({ message: 'Please provide both email and OTP.' });
      }
  
      const isOtpValid = await verifyOTP(email, otp); // Assuming verifyOtp returns a boolean
  
      if (!isOtpValid) {
        return res.status(400).send({ message: 'Invalid OTP or OTP expired.' });
      }
      return res.status(200).send({ message: 'OTP verified successfully. You can now reset your password.' });
    } catch (err) {
      console.error('Error verifying OTP:', err);
      return res.status(500).send({ message: 'Internal server error.' });
    }
  };
  export const updateStreakHandler = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'Please provide a valid userId.' });
    }
    try {
      await updateStreak(userId);
      res.status(200).json({ message: 'Daily streak updated successfully.' });
    } catch (err) {
      console.error('Error updating streak:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
  // Resend user otp handle
  export const resendUserOtpHandle = async(req: express.Request, res: express.Response) => {
    const {id} = req.params
    const {email} = req.body
    if (!id && !email) {
        res.status(400).send({message: 'Please provide either your id or your email.'})
    }
    try {
        const resending = await resendOTP(email)
        if(!resending) {
            res.status(400).send({message: 'Could not resend email'})
        }
        res.status(200).send({message: 'Successfully sent the otp, check your email! :)'})
    }   catch (err) {
        console.error('Error updating streak:', err);
        return res.status(500).json({ message: 'Internal server error.' });
      }
  }
  export const searchUserByUsernameHandler = async (req: express.Request, res: express.Response) => {
    const { username } = req.query;
    if (!username || typeof username !== 'string') {
        return res.status(400).send({ message: 'Please provide a valid username.' });
    }
    try {
        const usernames = await searchUserByUsername(username);
        if (usernames.length === 0) {
            return res.status(404).send({ message: 'No users found with the provided username.' });
        }
        return res.status(200).send({
            message: 'Successfully retrieved users with the provided username.',
            data: usernames
        });
    } catch (err) {
        console.error('Error searching for usernames:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};