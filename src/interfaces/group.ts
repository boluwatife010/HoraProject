import mongoose, { Document} from 'mongoose';

export interface Group extends Document {
    _id: mongoose.Types.ObjectId;
    groupName: string;
    members: mongoose.Types.ObjectId[];
    tasks: mongoose.Types.ObjectId[];
    inviteLink: string;
    isFull: boolean;
    isVerified: boolean;
    repeatTask: 'daily' | 'weekly' | 'none';
    createdBy: mongoose.Types.ObjectId;
    type: 'Personal' | 'Group';
    createdAt: Date;
    expiresAt: Date;
    dueDate: Date;
    time: string;
}
export interface updateGroupRequest {
    title: string;
    description: string;
    dueDate: Date;
}
export interface Invitation extends Document{
    email: string;
    groupId: mongoose.Types.ObjectId;
    invitedBy: mongoose.Types.ObjectId;
    status: 'pending'| 'accepted' | 'expired';
}
export interface invitationRequestBody {
    groupId: string;
    emails: string[];
    inviterId: string
}
export interface createGroupTaskBody {
    groupId: string;
    title: string;
    description: string;
    dueDate: Date;
    repeatTask?:  'daily' | 'weekly' | 'monthly' | 'none';
    time: string

}