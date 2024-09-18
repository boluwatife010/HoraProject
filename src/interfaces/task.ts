import mongoose from "mongoose";

export interface Task {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    completedBy: mongoose.Types.ObjectId[];
    createdBy: string;
    completedAt: Date;
    repeatTask: 'daily' | 'weekly' | 'monthly' | 'none';
    createdAt: Date;
    updatedAt: Date
}
export interface createTaskRequestBody {
    title: string;
    description: string;
    dueDate?: Date;
    createdBy: mongoose.Schema.Types.ObjectId;
    repeatTask?:  'daily' | 'weekly' | 'monthly' | 'none'

}
export interface updateTaskRequestBody {
    title: string;
    description: string;
}
export interface searchTaskRequestBody {
    keyword: string;
    dueDate: Date | undefined
}