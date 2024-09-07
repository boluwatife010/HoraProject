"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const notificationSchema = new Schema({
    userId: {
        required: true,
        type: String
    },
    message: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: String,
        default: 'pending'
    },
    type: {
        required: true,
        type: String
    }
}, { timestamps: true });
const notificationModel = mongoose_1.default.model('Notification', notificationSchema);
exports.default = notificationModel;
