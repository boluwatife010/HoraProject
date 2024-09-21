import express from 'express';
import { createGroupHandler, createLinkHandler, updateGroupTaskHandler,
     getGroupTaskHandler, getAllGroupTasksHandler,
    joinGroupHandler, createGroupTaskHandler, deleteGroupTaskHandler, 
    deleteUserHandler,leaveGroupHandler, getLeaderBoardHandler} from '../controllers/groupcontroller';
const router = express.Router();
router.post('/create', createGroupHandler);
router.post('/join', joinGroupHandler)
router.post('/new-task', createGroupTaskHandler);
router.put('/update-task/:groupId', updateGroupTaskHandler);
router.post('/send-link', createLinkHandler);
router.post('/:groupId/leave', leaveGroupHandler);
router.get('/:groupId/task/:taskId', getGroupTaskHandler);
router.get('/:groupId/tasks', getAllGroupTasksHandler);
router.delete('/:groupId/member/:userId', deleteUserHandler);
router.delete('/:groupId/task/:taskId', deleteGroupTaskHandler);
router.get('/leaderboard/:groupId', getLeaderBoardHandler)
export default router;