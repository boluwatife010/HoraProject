import { createNotificationHandler } from "../controllers/notificationcontrollers";
import express from 'express';
const router = express.Router()
router.get('/notifications', createNotificationHandler)
export default router;