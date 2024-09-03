import express from 'express';
import { createTask, getATask, getAllTasks, updateTask, searchTask, deleteTask } from '../services/taskservice';

export const createTaskHandler = async (req: express.Request, res: express.Response) => {
    const {title, description, dueDate, repeatTask} = req.body;
    try {
        if (!title && !description && !dueDate && ! repeatTask) {
            return res.status(400).send({message: 'Please provide the required fields.'})
        }
        const create = await createTask({title, description, dueDate, repeatTask});
        if (!create) {
            return res.status(400).send({message: 'Could not create a new task.'})
        }
        return res.status(200).send({message: 'Successfully created task.', create})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
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
    const dueDateString = req.query.dueDate as string ;
    const {id} = req.params;
    try {
        if (!keyword || !dueDateString) {
            return res.status(400).send({message: 'Could not find the above in the query'});
        }
        const dueDate = new Date(dueDateString)
        if (isNaN(dueDate.getTime())) {
            return res.status(400).send({ message: 'Invalid date format. Please provide a valid date.' });
        }
        const search = await searchTask(id, {keyword, dueDate});
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