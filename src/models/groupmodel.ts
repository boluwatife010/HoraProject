import mongoose from 'mongoose';
import {Group, Invitation} from '../interfaces/group'
const Schema = mongoose.Schema;
const groupSchema = new Schema<Group>({
    name: {
        type: String, 
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
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
    }
});

export const groupModel = mongoose.model<Group>('Group', groupSchema);

const invationSchema = new Schema ({
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
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'expired','accepted'],
        default: 'pending'
    }
})
export const invitationModel = mongoose.model<Invitation>('Invitation', invationSchema);