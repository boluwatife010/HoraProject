import mongoose, { Document } from "mongoose";
export interface Group extends Document {
    name: string;
    members: mongoose.Types.ObjectId[]; 
    tasks: mongoose.Types.ObjectId[];
    inviteLink: string;
    isFull: boolean;
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
export interface createGroupTaskBody {
    groupId: string;
    title: string;
    description: string;
    dueDate: Date;
}