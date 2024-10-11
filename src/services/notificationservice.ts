import notificationModel from "../models/notificationmodel";
import userModel from "../models/usermodel";
import { io } from '../../app';
export const notificationService = async (message: string, userId: string): Promise<any> => {
  try {
    const user = await userModel.findById(userId)
    if (!user ) {
      throw new Error('Please provide a valid user Id.')
    }
    const notify = new notificationModel({
      userId: user._id,
      message,
      isRead: false,
    });
    await notify.save();
    if (user.socketId) {
       
      io.to(user.socketId).emit('newNotification', notify);
    }
    return notify
  } catch (err) {
    console.error('Error in notificationService:', err);
    throw new Error('Something went wrong while sending the notification.');
  }
 
}



// import notificationModel from '../models/notificationmodel';
// import nodemailer from 'nodemailer';
// import { Notification } from '../interfaces/notification';

// class NotificationService {
//   async createNotification(data: Pick<Notification, 'userId' | 'message' | 'status' | 'type'>): Promise<Notification> {
//     const notification = new notificationModel(data);
//     await notification.save();
//     return notification;
//   }

//   async sendEmailNotification(email: string, message: string): Promise<void> {
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Notification",
//       text: message
//     };

//     await transporter.sendMail(mailOptions);
//   }

//   async updateNotificationStatus(notificationId: string, status: string): Promise<void> {
//     await notificationModel.findByIdAndUpdate(notificationId, { status });
//   }
// }
// export default new NotificationService();
