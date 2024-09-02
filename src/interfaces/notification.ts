import { Document, Types } from "mongoose";
export interface Notification extends Document{
    _id: Types.ObjectId
    userId: string;
    message: string;
    type: string;
    status: string;
    createdAt?: Date;
    updatedAt: Date;
}