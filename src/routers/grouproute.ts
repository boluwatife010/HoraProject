import express from 'express';
import { createGroupHandler, createLinkHandler, updateGroupTaskHandler, joinGroupHandler, createGroupTaskHandler } from '../controllers/groupcontroller';
const router = express.Router();
router.post('/create', createGroupHandler);
router.post('/join', joinGroupHandler)
router.post('/new-task', createGroupTaskHandler);
router.put('update-task', updateGroupTaskHandler),
router.post('/send-link', createLinkHandler)
export default router;