"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.logout = exports.handleGoogleCallback = exports.authenticateToken = exports.verifyAuthToken = exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const generateAuthToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token;
};
exports.generateAuthToken = generateAuthToken;
const verifyAuthToken = (token) => {
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decode;
    }
    catch (err) {
        throw new Error('Invalid token inputed');
    }
};
exports.verifyAuthToken = verifyAuthToken;
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(400).send({ message: 'Authentication is required.' });
    }
    ;
    try {
        const tokenString = Array.isArray(token) ? token[0] : token;
        const decoded = (0, exports.verifyAuthToken)(tokenString.replace('Bearer', '').trim());
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
const handleGoogleCallback = (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).send({ message: 'User not authenticated' });
    }
    const token = (0, exports.generateAuthToken)(user._id.toString());
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
        res.redirect(`${frontendUrl}/success?token=${token}`);
    }
    else {
        res.send({
            message: 'Successfully logged in with Google!',
            user,
            token,
        });
    }
};
exports.handleGoogleCallback = handleGoogleCallback;
const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};
exports.logout = logout;
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
exports.isAuthenticated = isAuthenticated;
