import mongoose from 'mongoose';
import {Group} from '../interfaces/accountability'
const Schema = mongoose.Schema;
const groupSchema =  new Schema ({
    name: {
        type: String, 
        required: true
    },
    members: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    tasks: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    inviteLink: {
        typw: String,
        required: true
    },
    isFull: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expiresAt: {
        type: Date,
        required: true
    }
})

export const groupModel = mongoose.model<Group>('Group',groupSchema )