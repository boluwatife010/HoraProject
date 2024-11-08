import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { Iuser } from '../interfaces/user';
const userSchema: Schema<Iuser> = new Schema({
    email: {
        type: String,
        required: function() {
            return !this.googleId;
        },
        unique: true,
        validate: [validator.isEmail, 'This is not a valid email.'],
        lowercase: true,
    },
    streakCount: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: null },
    maxStreak: { type: Number, default: 0 },
    password: {
        type: String,
        // required: function() {
        //     return !this.googleId;
        // },
        minlength: [6, 'Your minimum length of character is 6.'],
    },
    username: {
        type: String,
        unique: true,
        minlength: [3, 'Your username should be at least 3 characters long.'],
        maxlength: [20, 'Your username should be less than 20 characters.'],
    },
    googleId: { type: String },
    socketId: { type: String },
    name: { type: String },
    token: { type: String },
    profilepicture: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    points: { type: Number, default: 100 },
    dailyCompletedTasks: { type: Number, default: 0 },
    onetime: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 }
});
userSchema.pre<Iuser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};
userSchema.pre<Iuser>('save', function (next) {
    this.updatedAt = new Date();
    next();
});
export const userModel = mongoose.model<Iuser>('User', userSchema);
