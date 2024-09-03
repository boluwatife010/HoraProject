import mongoose, { Document } from "mongoose";
export interface Group {
    name: string;
    members: mongoose.Schema.Types.ObjectId[];
    tasks:mongoose.Schema.Types.ObjectId[];
    inviteLink: string;
    isFull: string;
    createdAt: Date;
    expiresAt: Date;
}