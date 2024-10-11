import { handleCreateNotification } from "../controllers/notificationcontrollers";
import express from 'express';
const router = express.Router()
router.get('/notifications', handleCreateNotification)
export default router;