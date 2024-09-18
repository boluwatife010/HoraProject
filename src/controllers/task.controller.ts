import express from 'express';
import { createTask, getATask, getAllTasks, updateTask, searchTask, 
    deleteTask, getTasksForDay, updateTaskStatus } from '../services/taskservice';
import mongoose from 'mongoose';


export const createTaskHandler = async (req: express.Request, res: express.Response) => {
    const { title, description, dueDate, repeatTask, createdBy } = req.body;
    try {
        if (!title && !description && !dueDate && !repeatTask) {
            return res.status(400).send({ message: 'Please provide all required fields.' });
        }
        const createdTask = await createTask({ title, description, dueDate, repeatTask, createdBy});

        if (!createdTask) {
            return res.status(400).send({ message: 'Could not create a new task.' });
        }

        return res.status(200).send({ message: 'Successfully created task.', createdTask });
    } catch (err) {
        console.error('Error creating task:', err);
        return res.status(500).send({ message: 'Internal server error.' });
    }
};

export const getTaskHandler = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide the valid id'})
        }
        const getTask = await getATask(id);
        if (!getTask) {
            return res.status(400).send({message: 'Could not find task with this id'})
        }
        return res.status(200).send({message: 'Successfully go task', getTask})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getTasksHandler = async (req: express.Request, res: express.Response) => {
    try {
        const task = await getAllTasks()
        if(!task) {
            return res.status(400).send({message: 'Could not get all tasks'})
        }
        return res.status(200).send({message: 'Successfully got all tasks', task})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const updateTaskHandler = async (req: express.Request, res: express.Response) => {
    const {title, description} = req.body;
    const {id} = req.params;
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id.'});
        }
        if (!title && !description) {
            return res.status(400).send({message: 'Please update one of the fields'})
        }
        const update = await updateTask(id, {title, description})
        if (!update) {
            return res.status(404).send({message: 'Could not update task'})
        }
        return res.status(200).send({message: 'Successfully updated task', update})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const searchTaskHandler = async (req: express.Request, res: express.Response) => {
    const keyword = req.query.keyword as string;
    const dueDateString = req.query.dueDate as string | undefined ;
    try {
        if (!keyword ) {
            return res.status(400).send({message: 'Could not find the above in the query'});
        }
         let dueDate: Date | undefined;
        if (dueDateString) {
            dueDate = new Date(dueDateString);
            if (isNaN(dueDate.getTime())) {
                return res.status(400).send({ message: 'Invalid date format. Please provide a valid date.' });
            }
        }
        const search = await searchTask({keyword, dueDate});
        if (search) {
            return res.status(200).send({ message: 'Task found', task: search });
        } else {
            return res.status(404).send({ message: 'Task not found' });
        }
}   catch (err) {
    console.log(err, 'Invalid err');
    return res.status(500).send({message: 'Internal server error.'}); 
}
}
export const deleteTaskHandler = async (req: express.Request, res: express.Response) => {
    const {id} = req.params
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id'})
        }
        const deleting = await deleteTask(id)
        if (!deleting) {
            return res.status(400).send({message: 'Could not delete task with id.'})
        }
        return res.status(200).send({message: 'Successfully deleted task.'})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const GetTaskForDayHandler = async (req: express.Request, res: express.Response) => {
    const {userId} = req.body;
    const date = req.query.date ? new Date(req.query.date as string): new Date()
    try {
        if (!userId && !date) {
            return res.status(400).send({message: 'Please provide the required details.'})
        }
        const tasks = await getTasksForDay(userId, date);
        if (!tasks) {
            return res.status(400).send({message: 'Could not get tasks for the day.'})
        }
        return res.status(200).send({message: 'Succsessfully got the tasks for the day', tasks});
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const updateTaskStatusHandler = async (req: express.Request, res: express.Response) => {
    const {taskId} = req.params;
    const {completed} = req.body
    try {
        if (!taskId || !completed) {
            return res.status(400).send({message: 'Please provide the required details'})
        }
        const status = await updateTaskStatus(taskId, completed);
        if (!status) {
            return res.status(400).send({message: 'Could not update task status'})
        }
        return res.status(200).send({message: 'Successfully updated task status', status})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}