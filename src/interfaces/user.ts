import mongoose, { Document, ObjectId } from 'mongoose';

export interface Iuser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    points: number;
    token?: string;
    email: string;
    password: string;
    streakCount: number;
    lastLoginDate: Date;
    maxStreak: number;
    dailyCompletedTasks:number;
    googleId?: string;
    onetime: string | null;
    otpExpires: Date | null;
    isVerified: boolean;
    profilepicture?: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

export interface User {
    _id: ObjectId;
    email?: string,
    id: string,
    name?:string
}
export interface registerRequestBody {
    email: string,
    password: string,
    username: string
}
export interface loginRequestBody {
    email: string,
    password: string;
}
export interface updateUserRequestBody {
    email: string,
    password: string;
    username: string
}
export interface changePasswordRequestBody {
    oldPassword: string,
    newPassword: string,
}