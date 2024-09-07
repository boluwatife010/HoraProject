"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationmodel_1 = __importDefault(require("../models/notificationmodel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class NotificationService {
    async createNotification(data) {
        const notification = new notificationmodel_1.default(data);
        await notification.save();
        return notification;
    }
    async sendEmailNotification(email, message) {
        const transporter = nodemailer_1.default.createTransport({
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
    async updateNotificationStatus(notificationId, status) {
        await notificationmodel_1.default.findByIdAndUpdate(notificationId, { status });
    }
}
exports.default = new NotificationService();
