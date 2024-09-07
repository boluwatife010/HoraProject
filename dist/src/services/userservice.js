"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.resetPassword = exports.calculateProgress = exports.forgotPassword = exports.changePassword = exports.deleteUser = exports.getAllUsers = exports.getUser = exports.updateUser = exports.loginUser = exports.verifyEmailOtp = exports.registerUser = void 0;
const usermodel_1 = require("../models/usermodel");
const auth_1 = require("../auth/auth");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateOtp_1 = require("../utils/generateOtp");
const sendmail_1 = require("../utils/sendmail");
const taskmodel_1 = require("../models/taskmodel");
const registerUser = async (body) => {
    const { email, password } = body;
    const existingUser = await usermodel_1.userModel.findOne({ email });
    if (existingUser) {
        throw new Error('This email is already in use!');
    }
    // const hashPassord = await bcrypt.hash(password, 10);
    const onetime = (0, generateOtp_1.generateOtp)();
    if (!onetime) {
        throw new Error('Could not generate otp');
    }
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const createUser = new usermodel_1.userModel({ email, password, onetime, otpExpires });
    const token = (0, auth_1.generateAuthToken)(createUser._id.toString());
    if (!createUser) {
        throw new Error('Please validate your details above');
    }
    await createUser.save();
    await (0, sendmail_1.sendEmail)(email, 'Verify Your Email', `Your OTP is ${onetime}`);
    return { createUser, token };
};
exports.registerUser = registerUser;
const verifyEmailOtp = async (email, onetime) => {
    const user = await usermodel_1.userModel.findOne({ email });
    if (!user) {
        throw new Error('Could not find user email');
    }
    if (user.isVerified) {
        throw new Error('User is already verified');
    }
    if (user.onetime !== onetime || user.otpExpires < new Date()) {
        throw new Error('Invalid or otp has expired');
    }
    user.isVerified = true;
    user.onetime = null;
    user.otpExpires = null;
    await user.save();
    return user;
};
exports.verifyEmailOtp = verifyEmailOtp;
const loginUser = async (body) => {
    const { email, password } = body;
    const login = await usermodel_1.userModel.findOne({ email });
    if (!login) {
        throw new Error('Could not log the user in');
    }
    const comparing = await bcryptjs_1.default.compare(password, login.password);
    if (!comparing) {
        throw new Error('Invalid password used.');
    }
    //const token = generateAuthToken((login._id as Iuser).toString());
    return { login };
};
exports.loginUser = loginUser;
const updateUser = async (body, id) => {
    const { email, password } = body;
    const update = await usermodel_1.userModel.findById(id);
    if (!update) {
        throw new Error('Please provide a valid id');
    }
    if (email) {
        update.email = email;
    }
    if (password) {
        update.password = password;
    }
    await update.save();
    return update;
};
exports.updateUser = updateUser;
const getUser = async (id) => {
    const user = await usermodel_1.userModel.findById(id);
    if (!user) {
        throw new Error('User not found.');
    }
    return user;
};
exports.getUser = getUser;
const getAllUsers = async () => {
    const all = await usermodel_1.userModel.find();
    if (!all) {
        throw new Error('Could not get all users.');
    }
    return all;
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (id) => {
    const deleting = await usermodel_1.userModel.findByIdAndDelete(id);
    if (!deleting) {
        throw new Error('The id provided above is not valid.');
    }
    return deleting;
};
exports.deleteUser = deleteUser;
const changePassword = async (id, body) => {
    const { oldPassword, newPassword } = body;
    const user = await usermodel_1.userModel.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    const matching = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!matching) {
        throw new Error('The old password is not correct');
    }
    user.password = await bcryptjs_1.default.hash(newPassword, 10);
    await user.save();
    return { message: 'Password changed successfully.' };
};
exports.changePassword = changePassword;
const forgotPassword = async (email) => {
    const user = await usermodel_1.userModel.findOne({ email });
    if (!user) {
        throw new Error('User with this email is not found');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    console.log(`Generated OTP for ${email}: ${otp}`);
    await user.save();
    const transporter = nodemailer_1.default.createTransport({
        service: 'Gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            //accessToken: oauth2Client.getAccessToken(),
        }
    });
    const mailOptions = {
        to: user.email,
        from: 'yourapp@example.com',
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    return { message: 'OTP sent to email' };
};
exports.forgotPassword = forgotPassword;
const calculateProgress = async (userId) => {
    const user = await usermodel_1.userModel.findById(userId);
    if (!user)
        throw new Error('User not found');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalTasks = await taskmodel_1.taskModel.countDocuments({
        createdBy: userId,
        dueDate: { $gte: today },
    });
    if (totalTasks === 0) {
        return {
            progress: `0%`,
            completedTasks: 0,
            totalTasks: 0,
        };
    }
    const pointsPerTask = 100 / totalTasks;
    const progress = (user.dailyCompletedTasks / totalTasks) * 100;
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
exports.calculateProgress = calculateProgress;
const resetPassword = async (email, newPassword, otp) => {
    console.log("Resetting password for email:", email);
    console.log("Provided OTP:", otp);
    console.log("Provided new password:", newPassword);
    const user = await usermodel_1.userModel.findOne({
        email: email.trim(),
        resetPasswordToken: otp.trim(),
        resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
        console.error("User not found or OTP is invalid/expired.");
        throw new Error('OTP is invalid or has expired.');
    }
    console.log("User found. Proceeding with password reset.");
    user.password = await bcryptjs_1.default.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return { message: 'Password reset successfully' };
};
exports.resetPassword = resetPassword;
const verifyOTP = async (email, otp) => {
    try {
        const user = await usermodel_1.userModel.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            throw new Error('OTP is invalid or has expired.');
        }
        return { message: 'OTP is valid' };
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};
exports.verifyOTP = verifyOTP;
