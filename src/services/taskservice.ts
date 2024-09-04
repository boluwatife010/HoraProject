import { taskModel } from "../models/taskmodel";
import cron from 'node-cron'
import { createTaskRequestBody, searchTaskRequestBody, updateTaskRequestBody } from "../interfaces/task";
import { userModel } from "../models/usermodel";
export const createTask = async (body: createTaskRequestBody): Promise<any> => {
    const {title, description, dueDate, repeatTask} = body;
    if (!title && !description && !dueDate && !repeatTask) {
        throw new Error ('Please provide the following details.')
    }
    const newTask = new taskModel({title, description, dueDate, repeatTask})
    if (!newTask) {
        throw new Error('Could not create a new task, please cross-check your details')
    }
    await newTask.save()
    return newTask ;
}
export const getATask = async (id: string): Promise<any> => {
    const task = await taskModel.findById(id);
    if (!task) {
        throw new Error ('Could not find task with this id.')
    }
    return task;
}
export const getAllTasks = async (): Promise<any> => {
    const tasks = await taskModel.find();
    if (!tasks) {
        throw new Error ('Could not get all tasks');
    }
    return tasks;
}
export const updateTask = async (id: string, body: updateTaskRequestBody): Promise<any> => {
    const {title, description} = body;
    if (!title && !description) {
        throw new Error ('Please provide one of the following fields to update')
    }
    const updates = await taskModel.findByIdAndUpdate( id,
        {
            ...(title && { title }),
            ...(description && { description })
        },
        { new: true });
    if (!updates) {
        throw new Error('Could not find task with specific id.')
    }
    return updates;
}
export const searchTask = async (id: string, body: searchTaskRequestBody): Promise<any> => {
    const {keyword, dueDate} = body;
    if (!keyword || !dueDate) {
        throw new Error ('Please provide a valid keyword');
    }
    const search = await taskModel.findOne({
        id,
        title: { $regex: keyword, $options: 'i' },
        dueDate: { $gte: dueDate}
    })
    if (!search) {
        throw new Error ('Could not find the following task')
    }
    return search;
}
export const deleteTask = async (id: string): Promise<any> => {
    const deleted = await taskModel.findByIdAndDelete(id);
    if (!deleted) {
        throw new Error ('Could not delete the task with this id')
    }
    return deleted
}

export const getTasksForDay = async (userId: string, date: Date): Promise<any> => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
    const tasks = await taskModel.find({
      createdBy: userId,
      dueDate: { $gte: startOfDay, $lt: endOfDay }
    });
  
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
    return { tasks, completedTasks, totalTasks: tasks.length, progress };
  };

export const updateTaskStatus = async (taskId: string, completed: boolean): Promise<any> => {
    const task = await taskModel.findById(taskId);
    if (!task) {
        throw new Error('Task not found.');
      }
    
      task.completed = completed;
      if (completed) {
        task.completedAt = new Date();
      // } else {
      //   task.completedAt = null;
      // }
    
      await task.save();
    
      return task;
}
    }

    export const calculateProgress = async (userId: string) => {
        const user = await userModel.findById(userId);
        if (!user) throw new Error('User not found');
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const totalTasks = await taskModel.countDocuments({
            createdBy: userId,
            dueDate: { $gte: today },
        });
        if (totalTasks === 0) {
            return {
                progress: `0%`,
                completedTasks: 0,
                totalTasks: 0,
            };
        }
        const pointsPerTask = 100 / totalTasks;
        const progress = (user.dailyCompletedTasks / totalTasks) * 100
        const accumulatedPoints = Math.min(user.dailyCompletedTasks * pointsPerTask, 100);
        user.points = accumulatedPoints;
        await user.save();
    
        return {
            progress: `${progress.toFixed(2)}%`,
            completedTasks: user.dailyCompletedTasks,
            totalTasks,
            points: accumulatedPoints,
        };
    };
    cron.schedule('0 0 * * *', async () => {
        await userModel.updateMany({}, { $set: { points: 100, dailyCompletedTasks: 0 } });
        await taskModel.deleteMany({ dueDate: { $lt: new Date() } });
    });
    
