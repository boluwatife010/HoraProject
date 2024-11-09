import { groupModel, invitationModel } from "../models/groupmodel";
import nodemailer from 'nodemailer';
import { generateOtp } from "../utils/generateOtp";
import mongoose, { Types } from "mongoose";
import { taskModel } from "../models/taskmodel";
import { userModel } from "../models/usermodel";
import { createGroupTaskBody, invitationRequestBody, updateGroupRequest } from "../interfaces/group";
import { sendEmail } from "../utils/sendmail";

function generateInviteCode(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys0123456789';
    let inviteCode = '';
    for (let i = 0; i < length; i++ ) {
        inviteCode += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return inviteCode;
}
export const createGroup = async (groupName: string, userId: string): Promise<any> => {
    const inviteLink = generateInviteCode(6);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newGroup = new groupModel({
      groupName,
      members: [new Types.ObjectId(userId)],
      inviteLink,
      isFull: false,
      tasks: [],
      createdBy: new Types.ObjectId(userId),
      expiresAt,
    });
    if (!newGroup) {
      throw new Error('Please provide all the valid requirements');
    }
    await newGroup.save();
    const populatedGroup = await groupModel
      .findById(newGroup._id)
      .populate('createdBy', '-password') 
      .populate({
        path: 'members',  
        select: '-password',
        options: { strictPopulate: false }, 
      });
    return populatedGroup;
  };
  export const updateGroup = async (groupName: string, groupId: string): Promise<any> => {
        const updateFields = await groupModel.findById(groupId);
        if (!updateFields) {
            throw new Error ('Could not find group with this id.')
        }
        console.log(updateFields)
        if (groupName) {
            updateFields.groupName = groupName
        }
        await updateFields.save()
        return {updateFields}
};

export const getGroup = async (id: string) => {
    if (!id) {
        throw new Error('Please provide a valid group id');
    }
    const group = await groupModel.findById(id)
        .populate('createdBy', '-password') 
        .populate('members', '-password');  

    if (!group) {
        throw new Error('Could not get the specific group with the provided id');
    }
    return group;
};
export const getAllGroups = async (userId:string) => {
    const allGroups = await groupModel.find()
        .populate('createdBy', '-password -__v') 
        .populate('members', '-password -__v');  
    if (!allGroups) {
        throw new Error('Could not get all groups created');
    }
    return allGroups;
};
export const inviteGroupLink = async (body: invitationRequestBody) => {
    const { groupId, inviterId, emails } = body;

    if (!groupId || !inviterId || !Array.isArray(emails) || emails.length < 1 || emails.length > 4) {
        throw new Error('Please provide a valid groupId, inviterId, and a list of 1 to 4 emails.');
    }
    const group = await groupModel.findById(groupId);
    if (!group) {
        throw new Error('Group not found');
    }
    if (group.members.length + emails.length > 4) {
        throw new Error('Inviting these users would exceed the group capacity.');
    }
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
    for (const email of emails) {
        const invitation = new invitationModel({
            email,
            groupId,
            invitedBy: inviterId
        });
        await invitation.save();
        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'You are invited to join a group',
            text: `You have been invited to join the group "${group.groupName}".Sign in or create a new account and join on: ${'https://hora-student-app.vercel.app'}/groups/joingroup ${group.inviteLink}`
        };
        await transporter.sendMail(mailOptions);
    }
    return { message: 'Invitations sent successfully.' };
};
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
    const { title, groupId, description, dueDate,  repeatTask, time } = body;

    if (!groupId && !title && !description && !dueDate && !repeatTask && !time) {
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
        repeatTask,
        time,
        groupId: groupObjectId,
        createdBy: createdByUser,
    });
    await newTask.save();
    group.tasks.push(newTask._id);
    await group.save();

    return newTask;
};
export const updateGroupTask = async (id: string, updates: updateGroupRequest): Promise<any> => {
    const task = await taskModel.findByIdAndUpdate(id, updates, {new: true});
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
export const deleteGroup = async (groupId: string) => {
    const deletes = await groupModel.findByIdAndDelete(groupId)
    if(!deletes) {
        throw new Error('Could not delete group')
    }
    return deletes
}