"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatusHandler = exports.GetTaskForDayHandler = exports.deleteTaskHandler = exports.searchTaskHandler = exports.updateTaskHandler = exports.getTasksHandler = exports.getTaskHandler = exports.createTaskHandler = void 0;
const taskservice_1 = require("../services/taskservice");
const createTaskHandler = async (req, res) => {
    const { title, description, dueDate, repeatTask, createdBy } = req.body;
    try {
        if (!title && !description && !dueDate && !repeatTask) {
            return res.status(400).send({ message: 'Please provide all required fields.' });
        }
        const createdTask = await (0, taskservice_1.createTask)({ title, description, dueDate, repeatTask, createdBy });
        if (!createdTask) {
            return res.status(400).send({ message: 'Could not create a new task.' });
        }
        return res.status(200).send({ message: 'Successfully created task.', createdTask });
    }
    catch (err) {
        console.error('Error creating task:', err);
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.createTaskHandler = createTaskHandler;
const getTaskHandler = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send({ message: 'Please provide the valid id' });
        }
        const getTask = await (0, taskservice_1.getATask)(id);
        if (!getTask) {
            return res.status(400).send({ message: 'Could not find task with this id' });
        }
        return res.status(200).send({ message: 'Successfully go task', getTask });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getTaskHandler = getTaskHandler;
const getTasksHandler = async (req, res) => {
    try {
        const task = await (0, taskservice_1.getAllTasks)();
        if (!task) {
            return res.status(400).send({ message: 'Could not get all tasks' });
        }
        return res.status(200).send({ message: 'Successfully got all tasks', task });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getTasksHandler = getTasksHandler;
const updateTaskHandler = async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send({ message: 'Please provide a valid id.' });
        }
        if (!title && !description) {
            return res.status(400).send({ message: 'Please update one of the fields' });
        }
        const update = await (0, taskservice_1.updateTask)(id, { title, description });
        if (!update) {
            return res.status(404).send({ message: 'Could not update task' });
        }
        return res.status(200).send({ message: 'Successfully updated task', update });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.updateTaskHandler = updateTaskHandler;
const searchTaskHandler = async (req, res) => {
    const keyword = req.query.keyword;
    const dueDateString = req.query.dueDate;
    try {
        if (!keyword || !dueDateString) {
            return res.status(400).send({ message: 'Could not find the above in the query' });
        }
        const dueDate = new Date(dueDateString);
        if (isNaN(dueDate.getTime())) {
            return res.status(400).send({ message: 'Invalid date format. Please provide a valid date.' });
        }
        const search = await (0, taskservice_1.searchTask)({ keyword, dueDate });
        if (search) {
            return res.status(200).send({ message: 'Task found', task: search });
        }
        else {
            return res.status(404).send({ message: 'Task not found' });
        }
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.searchTaskHandler = searchTaskHandler;
const deleteTaskHandler = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send({ message: 'Please provide a valid id' });
        }
        const deleting = await (0, taskservice_1.deleteTask)(id);
        if (!deleting) {
            return res.status(400).send({ message: 'Could not delete task with id.' });
        }
        return res.status(200).send({ message: 'Successfully deleted task.' });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.deleteTaskHandler = deleteTaskHandler;
const GetTaskForDayHandler = async (req, res) => {
    const { userId } = req.body;
    const date = req.query.date ? new Date(req.query.date) : new Date();
    try {
        if (!userId || !date) {
            return res.status(400).send({ message: 'Please provide the required details.' });
        }
        const tasks = await (0, taskservice_1.getTasksForDay)(userId, date);
        if (!tasks) {
            return res.status(400).send({ message: 'Could not get tasks for the day.' });
        }
        return res.status(200).send({ message: 'Succsessfully got the tasks for the day', tasks });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.GetTaskForDayHandler = GetTaskForDayHandler;
const updateTaskStatusHandler = async (req, res) => {
    const { taskId } = req.params;
    const { completed } = req.body;
    try {
        if (!taskId || !completed) {
            return res.status(400).send({ message: 'Please provide the required details' });
        }
        const status = await (0, taskservice_1.updateTaskStatus)(taskId, completed);
        if (!status) {
            return res.status(400).send({ message: 'Could not update task status' });
        }
        return res.status(200).send({ message: 'Successfully updated task status', status });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.updateTaskStatusHandler = updateTaskStatusHandler;
