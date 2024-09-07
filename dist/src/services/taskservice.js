"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.getTasksForDay = exports.deleteTask = exports.searchTask = exports.updateTask = exports.getAllTasks = exports.getATask = exports.createTask = void 0;
const taskmodel_1 = require("../models/taskmodel");
const node_cron_1 = __importDefault(require("node-cron"));
const usermodel_1 = require("../models/usermodel");
const createTask = async (body) => {
    const { title, description, dueDate, repeatTask, createdBy } = body;
    if (!title && !description && !dueDate && !repeatTask && !createdBy) {
        throw new Error('Please provide the following details.');
    }
    let parsedDueDate;
    if (dueDate) {
        parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
            throw new Error('Invalid date format.');
        }
    }
    const newTask = new taskmodel_1.taskModel({ title, description, dueDate: parsedDueDate, repeatTask, createdBy });
    if (!newTask) {
        throw new Error('Could not create a new task, please cross-check your details');
    }
    await newTask.save();
    return newTask;
};
exports.createTask = createTask;
const getATask = async (id) => {
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     throw new Error('Invalid task ID');
    // }
    const task = await taskmodel_1.taskModel.findById(id);
    if (!task) {
        throw new Error('Could not find task with this id.');
    }
    return task;
};
exports.getATask = getATask;
const getAllTasks = async () => {
    const tasks = await taskmodel_1.taskModel.find();
    if (!tasks) {
        throw new Error('Could not get all tasks');
    }
    return tasks;
};
exports.getAllTasks = getAllTasks;
const updateTask = async (id, body) => {
    const { title, description } = body;
    if (!title && !description) {
        throw new Error('Please provide one of the following fields to update');
    }
    const updates = await taskmodel_1.taskModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, (title && { title })), (description && { description })), { new: true });
    if (!updates) {
        throw new Error('Could not find task with specific id.');
    }
    return updates;
};
exports.updateTask = updateTask;
const searchTask = async (body) => {
    const { keyword, dueDate } = body;
    if (!keyword || !dueDate) {
        throw new Error('Please provide a valid keyword');
    }
    const search = await taskmodel_1.taskModel.findOne({
        title: { $regex: keyword, $options: 'i' },
        dueDate: { $gte: dueDate }
    });
    if (!search) {
        throw new Error('Could not find the following task');
    }
    return search;
};
exports.searchTask = searchTask;
const deleteTask = async (id) => {
    const deleted = await taskmodel_1.taskModel.findByIdAndDelete(id);
    if (!deleted) {
        throw new Error('Could not delete the task with this id');
    }
    return deleted;
};
exports.deleteTask = deleteTask;
const getTasksForDay = async (userId, date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const tasks = await taskmodel_1.taskModel.find({
        createdBy: userId,
        dueDate: { $gte: startOfDay, $lt: endOfDay }
    });
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    return { tasks, completedTasks, totalTasks: tasks.length, progress };
};
exports.getTasksForDay = getTasksForDay;
const updateTaskStatus = async (taskId, completed) => {
    const task = await taskmodel_1.taskModel.findById(taskId);
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
};
exports.updateTaskStatus = updateTaskStatus;
node_cron_1.default.schedule('0 0 * * *', async () => {
    await usermodel_1.userModel.updateMany({}, { $set: { points: 100, dailyCompletedTasks: 0 } });
    await taskmodel_1.taskModel.deleteMany({ dueDate: { $lt: new Date() } });
});
