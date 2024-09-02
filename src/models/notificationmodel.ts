import { Notification } from "../interfaces/notification";
import mongoose from "mongoose";
const Schema = mongoose.Schema
const notificationSchema = new Schema ({
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
},
{timestamps: true})
const notificationModel = mongoose.model<Notification>('Notification', notificationSchema)
export default notificationModel;