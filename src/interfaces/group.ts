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
export interface Invitation extends Document{
    email: string;
    groupId: mongoose.Schema.Types.ObjectId[];
    invitedBy: mongoose.Schema.Types.ObjectId[];
    status: 'pending'| 'accepted' | 'expired';
}
export interface invitationRequestBody {
    groupId: string;
    email: string;
    inviterId: string
}