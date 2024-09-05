import { createGroup, createLink, joinGroup, createGroupTask , updateGroupTask} from "../services/groupservice";
import express from 'express';
export const createGroupHandler = async (req: express.Request, res: express.Response) => {
    const {groupName, userId} = req.body
    try {
        if (!groupName || !userId) {
            return res.status(400).send({message: 'Please provide the following details' })
        }
        const create = await createGroup(groupName, userId)
        if (!create) {
            return res.status(400).send({message: 'Could not create the group.'})
        }
        return res.status(200).send({message: 'Successfully created a group', create})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const createLinkHandler = async (req: express.Request, res: express.Response) => {
    const {groupId, email, inviterId } = req.body
    try {
        if (!groupId || !email || !inviterId) {
            return res.status(400).send({message: 'Please provide the following details'})
        }
        const link = await createLink({groupId, inviterId, email})
        if (!link) {
            return res.status(400).send({message: 'Could not create link to send to members'})
        }
        return res.status(200).send({message: 'Invitation sent successfully', link})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const joinGroupHandler = async (req: express.Request, res: express.Response) => {
    const {userId, inviteLink} = req.body
    try {
        if (!userId || !inviteLink) {
            return res.status(400).send({message: 'Please provide the following details'})
        }
        const join = await joinGroup(inviteLink, userId) 
        if (!join) {
            return res.status(400).send({message: 'Could not join group successfully'})
        }
        return res.status(200).send({message: 'Successfully joined  group', join})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const createGroupTaskHandler = async (req: express.Request, res: express.Response) => {
    const {groupId, title, description, dueDate} = req.body;
    try {
        if (!groupId || !title || !description || !dueDate) {
            return res.status(400).send({message: 'Please provide one of the following details'})
        }
        const task = await createGroupTask({title, description, dueDate, groupId})
        if (!task) {
            return res.status(400).send({message: 'Could not crete group tasks'})
        }
        return res.status(200).send({message: 'Successfully created group task', task});

    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const updateGroupTaskHandler = async (req: express.Request, res: express.Response) => {
    const {title, description, dueDate} = req.body
    const {id} = req.params
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id.'});
        }
        if (!title || !description || !dueDate) {
            return res.status(400).send({message: 'Please provide the following details'});
        }
        const updating = await updateGroupTask(id, {title, description, dueDate})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}