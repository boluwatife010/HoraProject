import express from 'express';
import { createGroupHandler, inviteGroupLinkHandler, updateGroupTaskHandler,
     getGroupTaskHandler, getAllGroupTasksHandler, getAllGroupsHandler, getGroupHandler,
    joinGroupHandler, createGroupTaskHandler, deleteGroupTaskHandler, deleteGroupHandler,
    deleteUserHandler,leaveGroupHandler, getLeaderBoardHandler, updateGroupHandler, completeTaskHandler} from '../controllers/groupcontroller';
const router = express.Router();
router.post('/create', createGroupHandler);
router.post('/join', joinGroupHandler)
router.post('/new-task', createGroupTaskHandler);
router.put('/update-task/:id', updateGroupTaskHandler);
router.post('/send-link', inviteGroupLinkHandler);
router.delete('/:groupId/leave/:userId', leaveGroupHandler);
router.post('/groupName/:groupId', updateGroupHandler)
router.get('/:id', getGroupHandler)
router.get('/allgroups/:userId', getAllGroupsHandler)
router.get('/:groupId/task/:taskId', getGroupTaskHandler);
router.get('/:groupId/tasks', getAllGroupTasksHandler);
router.get('/complete/group-task', completeTaskHandler)
router.delete('/:groupId/member/:userId', deleteUserHandler);
router.delete('/:groupId/task/:taskId', deleteGroupTaskHandler);
router.get('/leaderboard/:groupId', getLeaderBoardHandler)
router.delete('/delete-group/:groupId', deleteGroupHandler)
export default router;