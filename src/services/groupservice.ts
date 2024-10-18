import { groupModel, invitationModel } from "../models/groupmodel";
import nodemailer from 'nodemailer';
import mongoose, { Types } from "mongoose";
import { taskModel } from "../models/taskmodel";
import { userModel } from "../models/usermodel";
import { createGroupTaskBody, invitationRequestBody, updateGroupRequest } from "../interfaces/group";

function generateInviteCode(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys0123456789';
    let inviteCode = '';
    for (let i = 0; i < length; i++ ) {
        inviteCode += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return inviteCode;
}
export const createGroup = async (groupName:string, userId: string):Promise<any> => {
    const inviteLink = generateInviteCode(6)
    const expiresAt = new Date(Date.now() + 24*60*60*1000);
    const newGroup = new groupModel({
        name: groupName,
        members: [new Types.ObjectId(userId)],
        inviteLink,
        isFull: false,
        task: [],
        expiresAt
    })
     if (!newGroup) {
        throw new Error('Please provide all the valid requirement');
     }
    await newGroup.save();
     return newGroup
}
export const getGroup = async (id:string) => {
    if (!id) {
        throw new Error('Please provide a valid group id')
    }
    const groups = await groupModel.findById(id);
    if (!groups) {
        throw new Error('Could not get the specific group with the specific id')
    }
    return groups;
}
export const getAllGroups = async (id: string) => {
    if (!id) {
        throw new Error('Please provide a valid group id')
    }
    const allGroups = await groupModel.find();
    if (!allGroups) {
        throw new Error('Could not get all groups created')
    }
    return allGroups;
}
export const createLink = async (body: invitationRequestBody)=> {
    const {groupId, inviterId, email} = body;
    if(!groupId && !inviterId && !email) {
        throw new Error ('Please provide any of the following details')
    }
    const group = await groupModel.findById(groupId);
    if (!group) {
        throw new Error('Group not found');
    }
    if (group.isFull || group.members.length >= 4) {
        throw new Error('This group is already full.')
    }
    const invitation = new invitationModel({
        email,
        groupId,
        invitedBy: inviterId
    })
    if (!invitation) {
        throw new Error('Could not send an invitation link')
    }
    await invitation.save()

    const transporter = nodemailer.createTransport({
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
    }
    await transporter.sendMail(mailOptions);
    return {message: 'Invitation sent successfully'}
}
export const joinGroup = async (userId: string, inviteLink: string): Promise<any> => {
    const userObjectId = new Types.ObjectId(userId);
    if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
    }
    const group = await groupModel.findOne({inviteLink})
    if (!group) {
        throw new Error('Invalid invite link');
    }
    if(group.isFull || group.members.length >= 4) {
        throw new Error ('Sorry, the group is full already.')
    }
    group.members.push(userObjectId)
    if(group.members.length === 4) {
        group.isFull = true
    }
    await group.save();
    await invitationModel.updateMany({ groupId: group._id, status: 'pending' }, { status: 'expired' });
    return group;
}
export const createGroupTask = async (body: createGroupTaskBody): Promise<any> => {
    const { title, groupId, description, dueDate } = body;

    if (!groupId && !title && !description && !dueDate) {
        throw new Error('Please provide all the required details');
    }
    const groupObjectId = new Types.ObjectId(groupId);
    const group = await groupModel.findById(groupObjectId);
    if (!group) {
        throw new Error('Could not find the group');
    }
    const createdByUserId = group.members[0];
    const createdByUser = await userModel.findById(createdByUserId)
    if (!createdByUser) {
        throw new Error('Could not find the person that created this task')
    }
    const newTask = new taskModel({
        title,
        type: ['Group'],
        description,
        dueDate,
        groupId: groupObjectId,
        createdBy: createdByUser,
    });
    await newTask.save();
    group.tasks.push(newTask._id);
    await group.save();

    return newTask;
};
export const updateGroupTask = async (groupId: string, updates: updateGroupRequest): Promise<any> => {
    const task = await taskModel.findByIdAndUpdate(groupId, updates, {new: true});
    if (!task) {
      throw new Error('Task not found.');
    }
    // Object.assign(task, updates);
    // await task.save();
    return task;
  };
export const completeTask = async (taskId: string, userId: string) => {
    const task = await taskModel.findById(taskId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (!task) throw new Error('Task not found');
    if (!task.completedBy.includes(userObjectId)) {
        task.completedBy.push(userObjectId);
        await task.save();
        const user = await userModel.findById(userId);
        if (user) {
            user.dailyCompletedTasks += 1;
            const totalTasks = await taskModel.countDocuments({ completedBy: userId });
            const points = Math.min(100, totalTasks * 20);
            user.points = points;
            await user.save();
        }
    }
    const taskWithFullUsers = await taskModel.findById(taskId).populate('completedBy');
    return taskWithFullUsers;
};


export const getGroupTask = async (groupId: string, taskId: string) => {
    const group = await groupModel.findById(groupId).populate('tasks');
    if (!group) throw new Error('Group not found');
    const task = group.tasks.find(task => task._id.toString() === taskId);
    if (!task) throw new Error('Task not found');

    return task;
};


export const getAllGroupTasks = async (groupId: string) => {
    const group = await groupModel.findById(groupId).populate('tasks');
    if (!group) throw new Error('Group not found');

    return group.tasks;
};

export const deleteGroupTask = async (groupId: string, taskId: string) => {
    const group = await groupModel.findById(groupId);
    if (!group) throw new Error('Group not found');
    group.tasks = group.tasks.filter(task => task.toString() !== taskId);

    await group.save();
    await taskModel.findByIdAndDelete(taskId);
    return { message: 'Task deleted successfully' };
};

export const leaveGroup = async (groupId: string, userId: string) => {
    const group = await groupModel.findById(groupId);
    if (!group) throw new Error('Group not found');

    group.members = group.members.filter(member => member.toString() !== userId);
    if (group.members.length < 4) {
        group.isFull = false;
    }
    await group.save();
    return { message: 'User left the group' };
};

export const deleteUserFromGroup = async (groupId: string, userId: string) => {
    const group = await groupModel.findById(groupId);
    if (!group) throw new Error('Group not found');

    group.members = group.members.filter(member => member.toString() !== userId);
    if (group.members.length < 4) {
        group.isFull = false;
    }

    await group.save();
    return { message: 'User removed from group' };
};
export const getLeaderboard = async (groupId: string) => {
    const users = await userModel.find({ groupId }).sort({ points: -1 });
    return users.map(user => ({
        name: user.name,
        points: user.points,
        dailyCompletedTasks: user.dailyCompletedTasks,
    }));
};