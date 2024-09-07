"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const usermodel_1 = require("../models/usermodel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    callbackURL: 'http://localhost:8090/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    var _a, _b;
    try {
        const existingUser = await usermodel_1.userModel.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = new usermodel_1.userModel({
            googleId: profile.id,
            name: profile.displayName,
            email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
            profilePicture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value
        });
        await newUser.save();
        done(null, newUser);
    }
    catch (error) {
        done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await usermodel_1.userModel.findById(id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
