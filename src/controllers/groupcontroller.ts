
import { createGroup, createLink, joinGroup, createGroupTask , updateGroupTask, completeTask, 
    leaveGroup, getAllGroupTasks, deleteGroupTask, getGroupTask,
    deleteUserFromGroup, getAllGroups, getGroup,
    getLeaderboard,
    updateGroup,
    deleteGroup} from "../services/groupservice";
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
export const updateGroupHandler = async (req: express.Request, res: express.Response) => {
    const {groupName} = req.body
    const {userId} = req.params
    if (!groupName && !userId) {
        return res.status(400).send({message: 'Please provide the groupname or the id in the request.'})
    }
    try {
        const change = await updateGroup(groupName, userId)
        if (!change) {
            return res.status(400).send({message: 'Could not update the group name.'})
        }
        return res.status(200).send({message: 'Successfully updated the group name.', change})
    }    catch (err) {
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
            return res.status(400).send({message: 'Could not send link to send to members'})
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
        const join = await joinGroup(userId, inviteLink) 
        if (!join) {
            return res.status(400).send({message: 'Could not join group successfully'})
        }
        return res.status(200).send({message: 'Successfully joined  group', join})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getGroupHandler = async (req: express.Request, res: express.Response) => {
    const {id} = req.params
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id.'})
        }
        const group = await getGroup(id)
        if (!group) {
            return res.status(400).send({message: 'Could not get the group information'})
        }
        return res.status(200).send({message: 'Successfully got the group :)', group})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getAllGroupsHandler = async (req: express.Request, res: express.Response) => {
    const {id} = req.params
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id.'})
        }
        const groups = await getAllGroups(id)
        if (!groups) {
            return res.status(400).send({message: 'Could not get all groups'})
        }
        return res.status(200).send({message: 'Successfully got all groups!', groups} )
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
        if (!updating) {
            return res.status(400).send({message: 'Could not update the task'})
        }
        return res.status(200).send({message: 'Successfully updated task', updating})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const completeTaskHandler = async (req: express.Request, res: express.Response) => {
    const {taskId, userId} = req.body
    try {
        if (!taskId || !userId) {
            return res.status(400).send({message: 'Please provide the folllowing details'});
        }
        const completed = await completeTask(taskId, userId)
        if (!completed) {
            return res.status(400).send({message: 'Could not get the completed tasks'});
        }
        return res.status(200).send({message: 'Successfully got the completed tasks', completed})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getGroupTaskHandler = async (req: express.Request, res: express.Response) => {
    const { groupId, taskId } = req.params;

    try {
        if (!groupId || !taskId) {
            return res.status(400).send({ message: 'Please provide both groupId and taskId.' });
        }
        const task = await getGroupTask(groupId, taskId);
        return res.status(200).send({ message: 'Successfully got the task', task });
    } catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};

export const getAllGroupTasksHandler = async (req: express.Request, res: express.Response) => {
    const {groupId} = req.params
    try {
        if(!groupId) {
            return res.status(400).send({message: 'Please provide the specified id'})
        }
        const allTasks = await getAllGroupTasks(groupId)
        if (!allTasks) {
            return res.status(400).send({message: 'Could not get all tasks'})
        }
        return res.status(200).send({message: 'successfully got all tasks', allTasks})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const deleteGroupTaskHandler = async (req: express.Request, res: express.Response) => {
    const {groupId, taskId} = req.params;
    try {
        if (!groupId || !taskId) {
            return res.status(400).send({message: 'Please provide the following details'})
        }
        const deleteTask = await deleteGroupTask(groupId, taskId)
        if (!deleteTask) {
            return res.status(400).send({message: 'Could not delete task'})
        }
        return res.status(200).send({message: 'Successfully deleted task', deleteTask})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const leaveGroupHandler = async (req: express.Request, res: express.Response) => {
    const {groupId} = req.params
    const { userId} = req.body.userId
    try {
        if (!groupId && !userId) {
            return res.status(400).send({message: 'Please update the following fields'})
        }
        const leave = await leaveGroup(groupId, userId)
        if (!leave) {
            return res.status(400).send({message: 'Could not leave group', leave})
        }
        return res.status(200).send({message: 'Successfully left the group', leaveGroup})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const deleteUserHandler = async (req: express.Request, res: express.Response) => {
    const {groupId, userId} = req.params
    try {
        if (!groupId || !userId) {
            return res.status(400).send({message: 'Please update the following fields'})
        }
        const deleted = await deleteUserFromGroup(groupId, userId)
        if (!deleted) {
            return res.status(400).send({message: 'Could not remove user', deleted})
        }
        return res.status(200).send({message: 'Successfully removed user', leaveGroup})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getLeaderBoardHandler = async (req: express.Request, res: express.Response) => {
    const {groupId} = req.params;
    try {
        if (!groupId) {
            return res.status(400).send({message: 'Please provide the required details'})
        }
        const lead = await getLeaderboard(groupId);
        if (!lead) {
            return res.status(400).send({message: 'Could not get leaderboard'})
        }
        return res.status(200).send({message: 'Successfully got the leaderboard', lead})
    }  catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    } 
}
export const  deleteGroupHandler = async (req: express.Request, res: express.Response) => {
    const {groupId} = req.params
    if (!groupId) {
        return res.status(400).send({message: 'Please provide a valid id.'})
    }
    try {
        const deletes = await deleteGroup(groupId)
        if (!deletes) {
            return res.status(400).send({message: 'Could not delete the group'})
        }
        return res.status(200).send({message: 'Successfully deleted the group.'})
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    } 
}