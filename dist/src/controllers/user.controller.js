"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpHandler = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.changePasswordHandler = exports.calculateProgressHandler = exports.deleteAUserHandler = exports.getAllUsersHandler = exports.getAUserHandler = exports.updateUserHandler = exports.userLoginHandler = exports.verifyEmailOtpHandler = exports.userRegistrationHandler = void 0;
const userservice_1 = require("../services/userservice");
const userRegistrationHandler = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({ message: 'Please fill in the required fields.' });
        }
        const register = await (0, userservice_1.registerUser)({ email, password });
        if (!register) {
            return res.status(400).send({ message: 'Cross-check your details please.' });
        }
        return res.status(200).send({ message: 'User successfully created.', register });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.userRegistrationHandler = userRegistrationHandler;
const verifyEmailOtpHandler = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).send({ message: 'Please provide the email and otp.' });
        }
        const verify = await (0, userservice_1.verifyEmailOtp)(email, otp);
        if (!verify) {
            return res.status(400).send({ message: 'Could not verify otp :(' });
        }
        return res.status(200).send({ message: 'Successfully verified email! :)' });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.verifyEmailOtpHandler = verifyEmailOtpHandler;
const userLoginHandler = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({ message: 'Please fill in the required fields.' });
        }
        const login = await (0, userservice_1.loginUser)({ email, password });
        if (!login) {
            return res.status(400).send({ message: 'Could not find user with this details' });
        }
        return res.status(200).send({ message: 'User successfully logged in', login });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.userLoginHandler = userLoginHandler;
const updateUserHandler = async (req, res) => {
    const { email, password } = req.body;
    const { id } = req.params;
    try {
        if (!email || !password) {
            return res.status(400).send({ message: 'Please update one of the required fields.' });
        }
        ;
        const update = await (0, userservice_1.updateUser)({ email, password }, id);
        if (!update) {
            return res.status(400).send({ message: 'Could not update user.' });
        }
        return res.status(200).send({ message: 'User successsfully updated', update });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.updateUserHandler = updateUserHandler;
const getAUserHandler = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send({ message: 'Please provide a valid id.' });
        }
        const get = await (0, userservice_1.getUser)(id);
        if (!get) {
            return res.status(400).send({ message: 'Could not get user by id.' });
        }
        return res.status(200).send({ message: 'Successfully got a user', get });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getAUserHandler = getAUserHandler;
const getAllUsersHandler = async (req, res) => {
    try {
        const allUsers = await (0, userservice_1.getAllUsers)();
        if (!allUsers) {
            return res.status(400).send({ message: 'Could not get all users.' });
        }
        return res.status(200).send({ message: 'Successfully got all users', allUsers });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getAllUsersHandler = getAllUsersHandler;
const deleteAUserHandler = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send({ message: 'Please provide a valid id.' });
        }
        const deleting = await (0, userservice_1.deleteUser)(id);
        if (!deleting) {
            return res.status(400).send({ message: 'Could not delete user by id.' });
        }
        return res.status(200).send({ message: 'Successfully deleted user.' });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.deleteAUserHandler = deleteAUserHandler;
const calculateProgressHandler = async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).send({ message: 'Please provide the following details,' });
        }
        const progress = await (0, userservice_1.calculateProgress)(userId);
        if (!progress) {
            return res.status(400).send({ message: 'Could not calculate user progress' });
        }
        return res.status(200).send({ message: 'Successfully calculated user progress', progress });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.calculateProgressHandler = calculateProgressHandler;
const changePasswordHandler = async (req, res) => {
    const { id } = req.params;
    const { newPassword, oldPassword } = req.body;
    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).send({ message: 'Please provide the required fields' });
        }
        const changingPassword = await (0, userservice_1.changePassword)(id, { newPassword, oldPassword });
        if (!changingPassword) {
            return res.status(400).send({ message: 'Could not change the password' });
        }
        return res.status(200).send({ message: 'Successfully changed password.' });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.changePasswordHandler = changePasswordHandler;
const forgotPasswordHandler = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).send({ message: 'Please provide a valid email address' });
        }
        const forgetRoute = await (0, userservice_1.forgotPassword)(email);
        if (!forgetRoute) {
            return res.status(400).send({ message: 'could not create otp' });
        }
        return res.status(200).send({ message: 'Successfully sent otp check your email.' });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.forgotPasswordHandler = forgotPasswordHandler;
const resetPasswordHandler = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).send({ mesage: 'Provide the following details' });
        }
        const resetRoute = await (0, userservice_1.resetPassword)(email, newPassword, otp);
        if (!resetRoute) {
            return res.status(400).send({ message: 'Could not reset password.' });
        }
        return res.status(200).send({ message: 'Password successfully reset.' });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.resetPasswordHandler = resetPasswordHandler;
const verifyOtpHandler = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).send({ message: 'Please provide both email and OTP.' });
        }
        const isOtpValid = await (0, userservice_1.verifyOTP)(email, otp); // Assuming verifyOtp returns a boolean
        if (!isOtpValid) {
            return res.status(400).send({ message: 'Invalid OTP or OTP expired.' });
        }
        return res.status(200).send({ message: 'OTP verified successfully. You can now reset your password.' });
    }
    catch (err) {
        console.error('Error verifying OTP:', err);
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.verifyOtpHandler = verifyOtpHandler;
