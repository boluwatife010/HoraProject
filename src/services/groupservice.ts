import { groupModel, invitationModel } from "../models/groupmodel";
import nodemailer from 'nodemailer';
import { Types } from "mongoose";
import { taskModel } from "../models/taskmodel";
import { userModel } from "../models/usermodel";
import { createGroupTaskBody, invitationRequestBody } from "../interfaces/group";
import {v4 as uuidv4} from 'uuid';

export const createGroup = async (groupName:string, userId: string):Promise<any> => {
    const inviteLink = uuidv4();
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
    const group = await groupModel.findOne({inviteLink})
    if (!group) {
        throw new Error('Invalid invite link');
    }
    if(group.isFull || group.members.length >= 4) {
        throw new Error ('Sorry, the group is full already.')
    }
    group.members.push(new Types.ObjectId(userId))
    if(group.members.length === 4) {
        group.isFull = true
    }
    await group.save();
    await invitationModel.updateMany({ groupId: group._id, status: 'pending' }, { status: 'expired' });
    return group;
}
export const createGroupTask = async (body: createGroupTaskBody): Promise<any> => {
    const {title, groupId, description, dueDate} = body
    if (!groupId || !title || description ||  dueDate) {
        throw new Error ('Please provide the following details')
    }
    const group = await groupModel.findById(groupId)
    if (!group) {
        throw new Error('Could not find the group id')
    }
    const newTask = new taskModel({
        title, description, dueDate, groupId, createdBy: group.members[0] 
    })
    await newTask.save()
    group.tasks.push(newTask._id);
    await group.save();

  return newTask;
}
export const updateGroupTask = async (taskId: string, updates: Partial<{ title: string; description: string; dueDate: Date; }>): Promise<any> => {
    const task = await taskModel.findById(taskId);
    if (!task) {
      throw new Error('Task not found.');
    }
    Object.assign(task, updates);
    await task.save();
    return task;
  };