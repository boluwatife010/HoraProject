import { Document } from "mongoose";
export interface Notification extends Document{
    userId: string;
    message: string;
    type: string;
    status: string;
    createdAt?: Date;
    updatedAt: Date;
}