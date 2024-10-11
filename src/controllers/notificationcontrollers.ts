import express from 'express';
import {notificationService} from '../services/notificationservice';

export const handleCreateNotification = async (req: express.Request, res: express.Response) => {
  const {userId} = req.params;
  const {message} = req.body;
  try {
    if (!userId) {
      return res.status(400).send({message: 'Please provide a valid user id.'})
    }
    if (!message) {
      return res.status(400).send({message: 'Please provide a message in the body of this app'})
    }
    const notify = await notificationService(userId, message)
    if (!notify) {
      return res.status(400).send({message: 'Could not send notifications.'})
    }
    return res.status(200).send({message: 'Successfully created notifications', notify})
  } catch (err) {
    console.log(err, 'Invalid error.')
    return res.status(500).send({message: 'Internal server error.'})
  }
};
//const { userId, message, type } = req.body;

// try {
//   if (!userId || !message || !type) {
//     return res.status(400).send({ message: 'Please provide userId, message, and type.' });
//   }

//   const status = 'pending';
//   const createdNotification = await NotificationService.createNotification({ userId, message, type, status });

//   if (!createdNotification) {
//     return res.status(400).send({ message: 'Could not create a notification for this user' });
//   }

//   if (type === 'email') {
//     try {
//       await NotificationService.sendEmailNotification(userId, message);
//       await NotificationService.updateNotificationStatus(createdNotification._id.toString(), 'sent');
//     } catch (err) {
//       await NotificationService.updateNotificationStatus(createdNotification._id.toString(), 'failed');
//       console.error('Error sending email notification:', err);
//       return res.status(500).send({ message: 'Failed to send email notification.' });
//     }
//   }

//   return res.status(200).send({ message: 'Successfully created a notification', notification: createdNotification });

// } catch (err) {
//   console.error('Error creating notification:', err);
//   return res.status(500).send({ message: 'Internal server error.' });
// }