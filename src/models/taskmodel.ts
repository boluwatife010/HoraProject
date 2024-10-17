import mongoose from 'mongoose';
import { Task } from '../interfaces/task';
const Schema = mongoose.Schema
const taskSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date,
        required: false
    },
    time : {type: String},
    completedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    repeatTask: {
        type: String,
        enum: ['daily', 'weekly', 'none'],
        default: 'none'
    },
    completed: {
        type: Boolean,
        default: false
    },
    type: ['Personal', 'Group'],
    groupId: { type: Schema.Types.ObjectId, 
        ref: 'Group' },
    createdBy: { type: Schema.Types.ObjectId, 
        ref: 'User', required: true},
    completedAt: {
        type: Date
    },
    
    // userId: {
    //     type: Schema.Types.ObjectId, 
    //     ref: 'User',
    //     required: true
    // }
},
{timestamps: true})
 export const taskModel = mongoose.model<Task>('Task', taskSchema)