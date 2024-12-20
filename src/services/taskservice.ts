import { taskModel } from "../models/taskmodel";
import cron from 'node-cron'
import { createTaskRequestBody, searchTaskRequestBody, updateTaskRequestBody } from "../interfaces/task";
import { userModel } from "../models/usermodel"

export const createTask = async (body: createTaskRequestBody): Promise<any> => {
  const { title, description, dueDate, repeatTask, createdBy, time } = body;
  if (!title || !description || !dueDate || !createdBy) {
      throw new Error('Please provide title, description, dueDate and createdBy.');
  }
  let parsedDueDate: Date | undefined;
  if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
          throw new Error('Invalid date format.');
      }
      if (time) {
          const [hours, minutes] = time.split(':').map(Number);
          if (isNaN(hours) || isNaN(minutes)) {
              throw new Error('Invalid time format. Please provide time in "HH:MM" format.');
          }
          parsedDueDate.setHours(hours);
          parsedDueDate.setMinutes(minutes);
      }
  }
  const newTask = new taskModel({
      title,
      description,
      type: ['Personal'],
      dueDate: parsedDueDate,
      repeatTask,
      createdBy,
      time,
  });
  if (!newTask) {
      throw new Error('Could not create a new task, please cross-check your details.');
  }
  await newTask.save();
  await newTask.populate({
      path: 'createdBy',
      select: '-password' 
  })
  return newTask;
};

export const getATask = async (id: string): Promise<any> => {
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     throw new Error('Invalid task ID');
    // }
    const task = await taskModel.findById(id).populate('createdBy', '-password');
    if (!task) {
        throw new Error ('Could not find task with this id.')
    }
    return task;
}
export const getAllTasks = async (id:string): Promise<any> => {
    const tasks = await taskModel.find().populate('createdBy', '-password');
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
export const searchTask = async ( body: searchTaskRequestBody): Promise<any> => {
    const {keyword, dueDate} = body;
    if (!keyword ) {
        throw new Error ('Please provide a valid keyword and date');
    }
    const query: any = {
        title: { $regex: keyword, $options: 'i' } 
    };

    if (dueDate) {
        const parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
            throw new Error('Invalid date provided.');
        }
        query.dueDate = { $gte: parsedDueDate }; 
    }
    const search = await taskModel.findOne(query);

    if (!search) {
        throw new Error('Could not find a task matching the provided criteria.');
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

export const getTasksForDays = async (userId: string): Promise<any> => {
  const now = new Date();
  const startOfYesterday = new Date(now);
  startOfYesterday.setDate(now.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0); 
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999); 
  const tasks = await taskModel.find({
    createdBy: userId,
    dueDate: { $gte: startOfYesterday, $lt: endOfToday }
  }).populate('createdBy', '-password');;
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
cron.schedule('0 0 * * *', async () => {
    await userModel.updateMany({}, { $set: { points: 100, dailyCompletedTasks: 0 } });
    await taskModel.deleteMany({ dueDate: { $lt: new Date() } });
});
    
