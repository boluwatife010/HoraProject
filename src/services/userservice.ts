import { userModel } from "../models/usermodel";
import { registerRequestBody, loginRequestBody, updateUserRequestBody, changePasswordRequestBody, Iuser} from "../interfaces/user";
import { generateAuthToken, verifyAuthToken} from "../auth/auth";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { generateOtp} from "../utils/generateOtp";
import {sendEmail} from '../utils/sendmail'
import { taskModel } from "../models/taskmodel";
import { OAuth2Client } from 'google-auth-library';
// const oauth2Client = new OAuth2Client(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN,
// });
export const registerUser = async (body: registerRequestBody):Promise <any> => {
    const {email, password, username} = body;
    const existingUser = await userModel.findOne({email});
    if (existingUser) {
        throw new Error ('This email is already in use!')
    }
    // const hashPassord = await bcrypt.hash(password, 10);
    const onetime = generateOtp();
    if (!onetime) {
        throw new Error('Could not generate otp')
    }
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const createUser = new userModel({ email, password, onetime, otpExpires, username});
    const token = generateAuthToken(createUser._id.toString());
    createUser.token = token;
    if (!createUser) {
        throw new Error ('Please validate your details above')
    }
    await createUser.save();
    await sendEmail(email, 'Verify Your Email', `Your OTP is ${onetime}`);
    return {createUser, token}
}
export const verifyEmailOtp = async (email: string, onetime: string) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('Could not find user with the provided email.');
  }
  if (user.isVerified) {
    throw new Error('User is already verified.');
  }
  const currentDate = new Date();
  if (!user.onetime || user.onetime !== onetime) {
    throw new Error('Invalid OTP.');
  }
  if (!user.otpExpires || user.otpExpires < currentDate) {
    throw new Error('OTP has expired.');
  }
  user.isVerified = true;
  user.onetime = null; 
  user.otpExpires = null; 
  await user.save();
  return user;
};
export const loginUser = async (body: loginRequestBody): Promise<any> => {
    const {email, password} = body;
    const login = await userModel.findOne({email})
    if (!login) {
        throw new Error ('Could not log the user in')
    }
    const comparing = await bcrypt.compare(password, login.password);
    if (!comparing) {
        throw new Error ('Invalid password used.')
    }
    let token = login.token
    try {
      if (token ) {
        verifyAuthToken(token)
      }
      else {
        // No token exists, generate a new token
        token = generateAuthToken(login._id.toString());
        login.token = token;
        await login.save();
      }
      await updateStreak(login._id.toString());
  } catch (err) {
        token = generateAuthToken(login._id.toString());
        login.token = token;
        await login.save();
      console.error('Error updating streak:', err);
  }
    return {login};
}
export const updateUser = async (body: updateUserRequestBody, id: string): Promise<any> => {
    const {email, password, username} =  body;
    const update = await userModel.findById(id);
    if (!update) {
        throw new Error ('Please provide a valid id');
    }
    if (email) {
        update.email = email
    }
    if (username) {
      update.username = username
    }
    if (password) {
        update.password = password;
        
    }
   await update.save();
   return update

}
export const getUser = async (id: string): Promise<any> => {
    const user = await userModel.findById(id);
    if (!user) {
        throw new Error ('User not found.')
    }
    return {user};
}
export const getAllUsers = async (): Promise<any> => {
    const all = await userModel.find();
    if (!all) {
        throw new Error ('Could not get all users.')
    }
    return {all};
}
export const deleteUser = async (id: string): Promise<any> => {
    const deleting = await userModel.findByIdAndDelete(id);
    if (!deleting) {
        throw new Error ('The id provided above is not valid.')
    }
    return deleting;
}
export const changePassword = async (id: string, body: changePasswordRequestBody,) => {
    const {oldPassword, newPassword} = body
    const user = await userModel.findById(id);
    if (!user) {
        throw new Error ('User not found');
    }
    const matching = await bcrypt.compare(oldPassword, user.password)
    if (!matching) {
        throw new Error ('The old password is not correct')
    }
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save();
    return {message: 'Password changed successfully.'}
}
export const forgotPassword = async (email: string): Promise<any> => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('User with this email is not found');
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordToken = otp;
  user.resetPasswordExpires = new Date(Date.now() + 3600000);
  await user.save();
  console.log(`Generated OTP for ${email}: ${otp}`);
  try {
    // const accessTokenObj = await oauth2Client.getAccessToken();
    // if (accessTokenObj instanceof Error) {
    //   console.error('Access token error:', accessTokenObj.message);
    //   throw new Error('Failed to generate access token. Please check credentials.');
    // }
    
    // const accessToken = accessTokenObj?.token;
    // if (!accessToken) {
    //   throw new Error('Failed to generate access token.');
    // }
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      },
  });
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    return { message: 'OTP sent to email :)' };
  } catch (err) {
    console.error('Error sending OTP email:', err);
    throw new Error('Failed to send OTP email. Please try again later.');
  }
};
export const calculateProgress = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('User not found');
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const totalTasks = await taskModel.countDocuments({
      createdBy: userId,
      dueDate: { $gte: today },
  });

  if (totalTasks === 0) {
      return {
          progress: `0%`,
          completedTasks: 0,
          totalTasks: 0,
          points: 0,
      };
  }
  const progress = (user.dailyCompletedTasks / totalTasks) * 100;
  const pointsPerTask = 100 / totalTasks;
  const accumulatedPoints = Math.min(user.dailyCompletedTasks * pointsPerTask, 100);
  user.points = accumulatedPoints;
  await user.save();
  
  return {
      progress: `${progress.toFixed(2)}%`,
      completedTasks: user.dailyCompletedTasks,
      totalTasks,
      points: accumulatedPoints,
  };
};

export const resetPassword = async (email: string, newPassword:string, otp:string): Promise<any> => {
    console.log("Resetting password for email:", email);
    console.log("Provided OTP:", otp); 
    console.log("Provided new password:", newPassword);
    const user = await userModel.findOne({
      email: email.trim(),
      resetPasswordToken: otp.trim(), 
      resetPasswordExpires: { $gt: new Date() }, 
    });
    if (!user) {
      console.error("User not found or OTP is invalid/expired.");
      throw new Error('OTP is invalid or has expired.');
    }
    console.log("User found. Proceeding with password reset.");
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpires = undefined;
    await user.save();
    return { message: 'Password reset successfully' };
};
export const verifyOTP = async (email: string, otp: string): Promise<any> => {
    try {const user = await userModel.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: new Date() },
    });
  
    if (!user) {
      throw new Error('OTP is invalid or has expired.');
    }
  
    return { message: 'OTP is valid' };} 
    catch (error) {
        console.error('Error verifying OTP:', error);
                throw error;
      }
  };
  export const updateStreak = async (userId: string): Promise<void> => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const today = new Date();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    if (lastLogin) {
      const differenceInTime = today.getTime() - lastLogin.getTime();
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
      if (differenceInDays === 1) {
        user.streakCount += 1;
      } else if (differenceInDays > 1) {
        user.streakCount = 0;
      }
    } else {
      user.streakCount = 1;
    }
    user.lastLoginDate = today;
  
    if (user.streakCount > user.maxStreak) {
      user.maxStreak = user.streakCount;
    }
  
    await user.save();
  };
 // Resend OTP
 export const resendOTP = async (email: string) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('User not found.');
  }
  if (user.isVerified) {
    throw new Error('User is already verified.');
  }
  const otp = generateOtp(); 
  user.onetime = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
  await user.save();
  await sendEmail(email, 'Your new OTP', `Your OTP is ${otp}`);
  return { message: 'A new OTP has been sent to your email.' };
};

export const searchUserByUsername = async (username: string): Promise<any> => {
  if (!username) {
    throw new Error('Please provide a username in the query parameters.');
  }
  const names = await userModel.find({
    username: { $regex: username, $options: 'i' } 
  });
  if (names.length === 0) {
    throw new Error('No users found with the provided username.');
  }
  return names;
};


// import multer, {StorageEngine} from 'multer';
// import express from 'express';
// import path from 'path';

// const storage: StorageEngine = multer.diskStorage({
//   destination: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//     cb(null, 'src/uploads/');
//   },
//   filename: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// export const upload = multer({ storage });
// export const userProfilePicture = (file: Express.Multer.File | undefined, id: string) => {
//   if (!file) {
//     throw new Error('File upload failed');
//   }
//   return {
//     message: 'File uploaded successfully',
//     filePath: `/uploads/${file.filename}`,
//   };
//};
// const Attachment = createModel({
//   modelName: 'Attachment',
//   connection: mongoose.connection,
// });
 
// export const saveProfilePicture = async (file: Express.Multer.File) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject(new Error('No file provided'));
//     }

//     const { originalname, buffer, mimetype } = file;

    // Create a write stream to GridFS
//     const writeStream = Attachment.write({
//       filename: originalname,
//       contentType: mimetype,
//     });

//     writeStream.end(buffer);

//     writeStream.on('finish', () => {
//       resolve({
//         message: 'File uploaded successfully',
//         fileId: writeStream.id,
//       });
//     });

//     writeStream.on('error', () => {
//       reject(new Error('File upload failed'));
//     });
//   });
// };