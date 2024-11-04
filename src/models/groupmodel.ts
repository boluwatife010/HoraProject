import mongoose, { Schema } from 'mongoose';
import { Group, Invitation } from '../interfaces/group';

const groupSchema = new Schema<Group>({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Personal', 'Group'],
        default: 'Group'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    repeatTask: [{
        type: String,
        enum: ['daily', 'weekly', 'none'],
        default: 'none'
    }],
    dueDate: {
        type: Date
    },
    time: {
        type: String
    },
    inviteLink: {
        type: String,
        required: true
    },
    isFull: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});
export const groupModel = mongoose.model<Group>('Group', groupSchema);


const invitationSchema = new Schema<Invitation>({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'expired', 'accepted'],
        default: 'pending'
    }
});
export const invitationModel = mongoose.model<Invitation>('Invitation', invitationSchema);
