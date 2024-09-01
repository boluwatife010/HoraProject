export interface Task {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
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