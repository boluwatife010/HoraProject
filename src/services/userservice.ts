import { userModel } from "../models/usermodel";
import { registerRequestBody, loginRequestBody, updateUserRequestBody, changePasswordRequestBody, Iuser} from "src/interfaces/user";
import { generateAuthToken } from "../auth/auth";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';


export const registerUser = async (body: registerRequestBody):Promise <any> => {
    const {email, password} = body;
    const existingUser = await userModel.findOne({email});
    if (existingUser) {
        throw new Error ('This email is already in use!')
    }
    // const hashPassord = await bcrypt.hash(password, 10);
    const createUser = new userModel({ email, password});
    const token = generateAuthToken((createUser._id as Iuser).toString());
    if (!createUser) {
        throw new Error ('Please validate your details above')
    }
    await createUser.save();
    return {createUser, token}
}
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
    //const token = generateAuthToken((login._id as Iuser).toString());
    return {login};
}
export const updateUser = async (body: updateUserRequestBody, id: string): Promise<any> => {
    const {email, password} =  body;
    const update = await userModel.findById(id);
    if (!update) {
        throw new Error ('Please provide a valid id');
    }
    if (email) {
        update.email = email
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
    return user;
}
export const getAllUsers = async (): Promise<any> => {
    const all = await userModel.find();
    if (!all) {
        throw new Error ('Could not get all users.')
    }
    return all;
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
    const user = await userModel.findOne({email});
    if (!user) {
        throw new Error ('User with this email is not found')
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();
    console.log(`Generated OTP for ${email}: ${otp}`);
    await user.save();
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth : {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            //accessToken: oauth2Client.getAccessToken(),

        }
    })
    const mailOptions = {
        to: user.email,
        from: 'yourapp@example.com',
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    }
    await transporter.sendMail(mailOptions);

    return { message: 'OTP sent to email' };
}
export const getLeaderboard = async (groupId: string) => {
    const users = await userModel.find({ groupId }).sort({ points: -1 });
    return users.map(user => ({
        name: user.name,
        points: user.points,
        dailyCompletedTasks: user.dailyCompletedTasks,
    }));
};
// export const calculateProgress = async (userId: string) => {
//     const user = await userModel.findById(userId);
//     if (!user) throw new Error('User not found');

//     const totalTasks = 5; 
//     const progress = (user.dailyCompletedTasks / totalTasks) * 100;

//     return {
//         progress: `${progress}%`,
//         completedTasks: user.dailyCompletedTasks,
//         totalTasks,
//     };
// };

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
    const user = await userModel.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date() },
    });
  
    if (!user) {
      throw new Error('OTP is invalid or has expired.');
    }
  
    return { message: 'OTP is valid' };
  };
  