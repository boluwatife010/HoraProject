import { Document, Types } from "mongoose";
export interface Notification extends Document{
    _id: Types.ObjectId
    userId: string;
    message: string;
    isRead: boolean;
    status: string;
}