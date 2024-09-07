"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const taskSchema = new Schema({
    title: {
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
    completedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    repeatTask: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'none'],
        default: 'none'
    },
    completed: {
        type: Boolean,
        default: false
    },
    groupId: { type: Schema.Types.ObjectId,
        ref: 'Group' },
    createdBy: { type: Schema.Types.ObjectId,
        ref: 'User', required: true },
    completedAt: {
        type: Date
    },
    // userId: {
    //     type: Schema.Types.ObjectId, 
    //     ref: 'User',
    //     required: true
    // }
}, { timestamps: true });
exports.taskModel = mongoose_1.default.model('Task', taskSchema);
