"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationModel = exports.groupModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    tasks: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.groupModel = mongoose_1.default.model('Group', groupSchema);
const invationSchema = new Schema({
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
        enum: ['pending', 'expired', 'accepted'],
        default: 'pending'
    }
});
exports.invitationModel = mongoose_1.default.model('Invitation', invationSchema);
