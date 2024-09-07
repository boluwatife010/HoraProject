"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationHandler = void 0;
const notificationservice_1 = __importDefault(require("../services/notificationservice"));
const createNotificationHandler = async (req, res) => {
    const { userId, message, type } = req.body;
    try {
        if (!userId || !message || !type) {
            return res.status(400).send({ message: 'Please provide userId, message, and type.' });
        }
        const status = 'pending';
        const createdNotification = await notificationservice_1.default.createNotification({ userId, message, type, status });
        if (!createdNotification) {
            return res.status(400).send({ message: 'Could not create a notification for this user' });
        }
        if (type === 'email') {
            try {
                await notificationservice_1.default.sendEmailNotification(userId, message);
                await notificationservice_1.default.updateNotificationStatus(createdNotification._id.toString(), 'sent');
            }
            catch (err) {
                await notificationservice_1.default.updateNotificationStatus(createdNotification._id.toString(), 'failed');
                console.error('Error sending email notification:', err);
                return res.status(500).send({ message: 'Failed to send email notification.' });
            }
        }
        return res.status(200).send({ message: 'Successfully created a notification', notification: createdNotification });
    }
    catch (err) {
        console.error('Error creating notification:', err);
        return res.status(500).send({ message: 'Internal server error.' });
    }
};
exports.createNotificationHandler = createNotificationHandler;
