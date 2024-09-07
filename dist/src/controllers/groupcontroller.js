"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderBoardHandler = exports.deleteUserHandler = exports.leaveGroupHandler = exports.deleteGroupTaskHandler = exports.getAllGroupTasksHandler = exports.getGroupTaskHandler = exports.completeTaskHandler = exports.updateGroupTaskHandler = exports.createGroupTaskHandler = exports.joinGroupHandler = exports.createLinkHandler = exports.createGroupHandler = void 0;
const groupservice_1 = require("../services/groupservice");
const createGroupHandler = async (req, res) => {
    const { groupName, userId } = req.body;
    try {
        if (!groupName || !userId) {
            return res.status(400).send({ message: 'Please provide the following details' });
        }
        const create = await (0, groupservice_1.createGroup)(groupName, userId);
        if (!create) {
            return res.status(400).send({ message: 'Could not create the group.' });
        }
        return res.status(200).send({ message: 'Successfully created a group', create });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.createGroupHandler = createGroupHandler;
const createLinkHandler = async (req, res) => {
    const { groupId, email, inviterId } = req.body;
    try {
        if (!groupId || !email || !inviterId) {
            return res.status(400).send({ message: 'Please provide the following details' });
        }
        const link = await (0, groupservice_1.createLink)({ groupId, inviterId, email });
        if (!link) {
            return res.status(400).send({ message: 'Could not create link to send to members' });
        }
        return res.status(200).send({ message: 'Invitation sent successfully', link });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.createLinkHandler = createLinkHandler;
const joinGroupHandler = async (req, res) => {
    const { userId, inviteLink } = req.body;
    try {
        if (!userId || !inviteLink) {
            return res.status(400).send({ message: 'Please provide the following details' });
        }
        const join = await (0, groupservice_1.joinGroup)(userId, inviteLink);
        if (!join) {
            return res.status(400).send({ message: 'Could not join group successfully' });
        }
        return res.status(200).send({ message: 'Successfully joined  group', join });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.joinGroupHandler = joinGroupHandler;
const createGroupTaskHandler = async (req, res) => {
    const { groupId, title, description, dueDate } = req.body;
    try {
        if (!groupId || !title || !description || !dueDate) {
            return res.status(400).send({ message: 'Please provide one of the following details' });
        }
        const task = await (0, groupservice_1.createGroupTask)({ title, description, dueDate, groupId });
        if (!task) {
            return res.status(400).send({ message: 'Could not crete group tasks' });
        }
        return res.status(200).send({ message: 'Successfully created group task', task });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.createGroupTaskHandler = createGroupTaskHandler;
const updateGroupTaskHandler = async (req, res) => {
    const { title, description, dueDate } = req.body;
    const { groupId } = req.params;
    try {
        if (!groupId) {
            return res.status(400).send({ message: 'Please provide a valid id.' });
        }
        if (!title || !description || !dueDate) {
            return res.status(400).send({ message: 'Please provide the following details' });
        }
        const updating = await (0, groupservice_1.updateGroupTask)(groupId, { title, description, dueDate });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.updateGroupTaskHandler = updateGroupTaskHandler;
const completeTaskHandler = async (req, res) => {
    const { taskId, userId } = req.body;
    try {
        if (!taskId || !userId) {
            return res.status(400).send({ message: 'Please provide the folllowing details' });
        }
        const completed = await (0, groupservice_1.completeTask)(taskId, userId);
        if (!completed) {
            return res.status(400).send({ message: 'Could not get the completed tasks' });
        }
        return res.status(200).send({ message: 'Successfully got the completed tasks', completed });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.completeTaskHandler = completeTaskHandler;
const getGroupTaskHandler = async (req, res) => {
    const { taskId } = req.params;
    try {
        if (!taskId) {
            return res.status(400).send({ message: 'Please provide the following details' });
        }
        const getTasks = await (0, groupservice_1.getGroupTask)(taskId);
        if (!getTasks) {
            return res.status(200).send({ message: 'Could not get group tasks' });
        }
        return res.status(200).send({ message: 'Successfully got all tasks' });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getGroupTaskHandler = getGroupTaskHandler;
const getAllGroupTasksHandler = async (req, res) => {
    const { groupId } = req.params;
    try {
        if (!groupId) {
            return res.status(400).send({ message: 'Please provide the specified id' });
        }
        const allTasks = await (0, groupservice_1.getAllGroupTasks)(groupId);
        if (!allTasks) {
            return res.status(400).send({ message: 'Could not get all tasks' });
        }
        return res.status(200).send({ message: 'successfully got all tasks', allTasks });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getAllGroupTasksHandler = getAllGroupTasksHandler;
const deleteGroupTaskHandler = async (req, res) => {
    const { groupId, taskId } = req.params;
    try {
        if (!groupId || !taskId) {
            return res.status(400).send({ message: 'Please provide the following details' });
        }
        const deleteTask = await (0, groupservice_1.deleteGroupTask)(groupId, taskId);
        if (!deleteTask) {
            return res.status(400).send({ message: '' });
        }
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.deleteGroupTaskHandler = deleteGroupTaskHandler;
const leaveGroupHandler = async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body.userId;
    try {
        if (!groupId && !userId) {
            return res.status(400).send({ message: 'Please update the following fields' });
        }
        const leave = await (0, groupservice_1.leaveGroup)(groupId, userId);
        if (!leave) {
            return res.status(400).send({ message: 'Could not leave group', leave });
        }
        return res.status(200).send({ message: 'Successfully left the group', leaveGroup: groupservice_1.leaveGroup });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.leaveGroupHandler = leaveGroupHandler;
const deleteUserHandler = async (req, res) => {
    const { groupId, userId } = req.params;
    try {
        if (!groupId || !userId) {
            return res.status(400).send({ message: 'Please update the following fields' });
        }
        const deleted = await (0, groupservice_1.deleteUserFromGroup)(groupId, userId);
        if (!deleted) {
            return res.status(400).send({ message: 'Could not remove user', deleted });
        }
        return res.status(200).send({ message: 'Successfully removed user', leaveGroup: groupservice_1.leaveGroup });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.deleteUserHandler = deleteUserHandler;
const getLeaderBoardHandler = async (req, res) => {
    const { groupId } = req.params;
    try {
        if (!groupId) {
            return res.status(400).send({ message: 'Please provide the required details' });
        }
        const lead = await (0, groupservice_1.getLeaderboard)(groupId);
        if (!lead) {
            return res.status(400).send({ message: 'Could not get leaderboard' });
        }
        return res.status(200).send({ message: 'Successfully got the leaderboard', lead });
    }
    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.getLeaderBoardHandler = getLeaderBoardHandler;
