"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupcontroller_1 = require("../controllers/groupcontroller");
const router = express_1.default.Router();
router.post('/create', groupcontroller_1.createGroupHandler);
router.post('/join', groupcontroller_1.joinGroupHandler);
router.post('/new-task', groupcontroller_1.createGroupTaskHandler);
router.put('/update-task/:groupId', groupcontroller_1.updateGroupTaskHandler);
router.post('/send-link', groupcontroller_1.createLinkHandler);
router.post('/:groupId/leave', groupcontroller_1.leaveGroupHandler);
router.get('/task/:taskId', groupcontroller_1.getGroupTaskHandler);
router.get('/:groupId/tasks', groupcontroller_1.getAllGroupTasksHandler);
router.delete('/:groupId/member/:userId', groupcontroller_1.deleteUserHandler);
router.delete('/:groupId/task/:taskId', groupcontroller_1.deleteGroupTaskHandler);
router.get('/leaderboard/:groupId', groupcontroller_1.getLeaderBoardHandler);
exports.default = router;