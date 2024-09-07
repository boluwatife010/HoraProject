"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.deleteUserFromGroup = exports.leaveGroup = exports.deleteGroupTask = exports.getAllGroupTasks = exports.getGroupTask = exports.completeTask = exports.updateGroupTask = exports.createGroupTask = exports.joinGroup = exports.createLink = exports.createGroup = void 0;
const groupmodel_1 = require("../models/groupmodel");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mongoose_1 = __importStar(require("mongoose"));
const taskmodel_1 = require("../models/taskmodel");
const usermodel_1 = require("../models/usermodel");
const uuid_1 = require("uuid");
const createGroup = async (groupName, userId) => {
    const inviteLink = (0, uuid_1.v4)();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newGroup = new groupmodel_1.groupModel({
        name: groupName,
        members: [new mongoose_1.Types.ObjectId(userId)],
        inviteLink,
        isFull: false,
        task: [],
        expiresAt
    });
    if (!newGroup) {
        throw new Error('Please provide all the valid requirement');
    }
    await newGroup.save();
    return newGroup;
};
exports.createGroup = createGroup;
const createLink = async (body) => {
    const { groupId, inviterId, email } = body;
    if (!groupId && !inviterId && !email) {
        throw new Error('Please provide any of the following details');
    }
    const group = await groupmodel_1.groupModel.findById(groupId);
    if (!group) {
        throw new Error('Group not found');
    }
    if (group.isFull || group.members.length >= 4) {
        throw new Error('This group is already full.');
    }
    const invitation = new groupmodel_1.invitationModel({
        email,
        groupId,
        invitedBy: inviterId
    });
    if (!invitation) {
        throw new Error('Could not send an invitation link');
    }
    await invitation.save();
    const transporter = nodemailer_1.default.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'You are invited to join a group',
        text: `You have been invited to join the group "${group.name}". Click the link to join: ${process.env.FRONTEND_URL}/join/${group.inviteLink}`
    };
    await transporter.sendMail(mailOptions);
    return { message: 'Invitation sent successfully' };
};
exports.createLink = createLink;
const joinGroup = async (userId, inviteLink) => {
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
    }
    const group = await groupmodel_1.groupModel.findOne({ inviteLink });
    if (!group) {
        throw new Error('Invalid invite link');
    }
    if (group.isFull || group.members.length >= 4) {
        throw new Error('Sorry, the group is full already.');
    }
    group.members.push(userObjectId);
    if (group.members.length === 4) {
        group.isFull = true;
    }
    await group.save();
    await groupmodel_1.invitationModel.updateMany({ groupId: group._id, status: 'pending' }, { status: 'expired' });
    return group;
};
exports.joinGroup = joinGroup;
const createGroupTask = async (body) => {
    const { title, groupId, description, dueDate } = body;
    if (!groupId && !title && !description && !dueDate) {
        throw new Error('Please provide all the required details');
    }
    const groupObjectId = new mongoose_1.Types.ObjectId(groupId);
    const group = await groupmodel_1.groupModel.findById(groupObjectId);
    if (!group) {
        throw new Error('Could not find the group');
    }
    const newTask = new taskmodel_1.taskModel({
        title,
        description,
        dueDate,
        groupId: groupObjectId,
        createdBy: group.members[0],
    });
    await newTask.save();
    group.tasks.push(newTask._id);
    await group.save();
    return newTask;
};
exports.createGroupTask = createGroupTask;
const updateGroupTask = async (groupId, updates) => {
    const task = await taskmodel_1.taskModel.findByIdAndUpdate(groupId);
    if (!task) {
        throw new Error('Task not found.');
    }
    Object.assign(task, updates);
    await task.save();
    return task;
};
exports.updateGroupTask = updateGroupTask;
const completeTask = async (taskId, userId) => {
    const task = await taskmodel_1.taskModel.findById(taskId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    if (!task)
        throw new Error('Task not found');
    if (!task.completedBy.includes(userObjectId)) {
        task.completedBy.push(userObjectId);
        await task.save();
        const user = await usermodel_1.userModel.findById(userId);
        if (user) {
            user.dailyCompletedTasks += 1;
            const totalTasks = await taskmodel_1.taskModel.countDocuments({ completedBy: userId });
            const points = Math.min(100, totalTasks * 20);
            user.points = points;
            await user.save();
        }
    }
    return task;
};
exports.completeTask = completeTask;
const getGroupTask = async (taskId) => {
    const group = await groupmodel_1.groupModel.findById(taskId).populate('tasks');
    if (!group)
        throw new Error('Group not found');
    const task = group.tasks.find(task => task._id.toString() === taskId);
    if (!task)
        throw new Error('Task not found');
    return task;
};
exports.getGroupTask = getGroupTask;
const getAllGroupTasks = async (groupId) => {
    const group = await groupmodel_1.groupModel.findById(groupId).populate('tasks');
    if (!group)
        throw new Error('Group not found');
    return group.tasks;
};
exports.getAllGroupTasks = getAllGroupTasks;
const deleteGroupTask = async (groupId, taskId) => {
    const group = await groupmodel_1.groupModel.findById(groupId);
    if (!group)
        throw new Error('Group not found');
    group.tasks = group.tasks.filter(task => task.toString() !== taskId);
    await group.save();
    await taskmodel_1.taskModel.findByIdAndDelete(taskId);
    return { message: 'Task deleted successfully' };
};
exports.deleteGroupTask = deleteGroupTask;
const leaveGroup = async (groupId, userId) => {
    const group = await groupmodel_1.groupModel.findById(groupId);
    if (!group)
        throw new Error('Group not found');
    group.members = group.members.filter(member => member.toString() !== userId);
    if (group.members.length < 4) {
        group.isFull = false;
    }
    await group.save();
    return { message: 'User left the group' };
};
exports.leaveGroup = leaveGroup;
const deleteUserFromGroup = async (groupId, userId) => {
    const group = await groupmodel_1.groupModel.findById(groupId);
    if (!group)
        throw new Error('Group not found');
    group.members = group.members.filter(member => member.toString() !== userId);
    if (group.members.length < 4) {
        group.isFull = false;
    }
    await group.save();
    return { message: 'User removed from group' };
};
exports.deleteUserFromGroup = deleteUserFromGroup;
const getLeaderboard = async (groupId) => {
    const users = await usermodel_1.userModel.find({ groupId }).sort({ points: -1 });
    return users.map(user => ({
        name: user.name,
        points: user.points,
        dailyCompletedTasks: user.dailyCompletedTasks,
    }));
};
exports.getLeaderboard = getLeaderboard;
