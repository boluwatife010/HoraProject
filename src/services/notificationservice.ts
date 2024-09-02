import notificationModel from '../models/notificationmodel';
import nodemailer from 'nodemailer';
import { Notification } from 'src/interfaces/notification';

class NotificationService {
  async createNotification(data: Pick<Notification, 'userId' | 'message' | 'status' | 'type'>): Promise<Notification> {
    const notification = new notificationModel(data);
    await notification.save();
    return notification;
  }

  async sendEmailNotification(email: string, message: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Notification",
      text: message
    };

    await transporter.sendMail(mailOptions);
  }

  async updateNotificationStatus(notificationId: string, status: string): Promise<void> {
    await notificationModel.findByIdAndUpdate(notificationId, { status });
  }
}
export default new NotificationService();
