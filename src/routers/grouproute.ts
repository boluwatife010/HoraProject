import express from 'express';
import { createGroupHandler, inviteGroupLinkHandler, updateGroupTaskHandler,
     getGroupTaskHandler, getAllGroupTasksHandler, getAllGroupsHandler, getGroupHandler,
    joinGroupHandler, createGroupTaskHandler, deleteGroupTaskHandler, deleteGroupHandler,
    deleteUserHandler,leaveGroupHandler, getLeaderBoardHandler, updateGroupHandler} from '../controllers/groupcontroller';
const router = express.Router();
router.post('/create', createGroupHandler);
router.post('/join', joinGroupHandler)
router.post('/new-task', createGroupTaskHandler);
router.put('/update-task/:id', updateGroupTaskHandler);
router.post('/send-link', inviteGroupLinkHandler);
router.post('/leave/:groupId', leaveGroupHandler);
router.post('/name/:userId', updateGroupHandler)
router.get('/:id', getGroupHandler)
router.get('/all-groups/', getAllGroupsHandler)
router.get('/:groupId/task/:taskId', getGroupTaskHandler);
router.get('/:groupId/tasks', getAllGroupTasksHandler);
router.delete('/:groupId/member/:userId', deleteUserHandler);
router.delete('/:groupId/task/:taskId', deleteGroupTaskHandler);
router.get('/leaderboard/:groupId', getLeaderBoardHandler)
router.delete('/delete-group/:groupId', deleteGroupHandler)
export default router;