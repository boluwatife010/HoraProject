import mongoose from "mongoose";

export interface Task {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    completedBy: mongoose.Types.ObjectId[]
    completedAt: Date;
    repeatTask: 'daily' | 'weekly' | 'monthly' | 'none';
    createdAt: Date;
    updatedAt: Date
}
export interface createTaskRequestBody {
    title: string;
    description: string;
    dueDate?: Date;
    repeatTask?:  'daily' | 'weekly' | 'monthly' | 'none'

}
export interface updateTaskRequestBody {
    title: string;
    description: string;
}
export interface searchTaskRequestBody {
    keyword: string;
    dueDate: Date
}