"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const router = express_1.default.Router();
router.post('/create', task_controller_1.createTaskHandler);
router.put('/update/:id', task_controller_1.updateTaskHandler);
router.get('/:id', task_controller_1.getTaskHandler);
router.get('/', task_controller_1.getTasksHandler);
router.get('/search', task_controller_1.searchTaskHandler);
router.delete('/delete/:id', task_controller_1.deleteTaskHandler);
router.get('/today/:userId', task_controller_1.GetTaskForDayHandler);
router.patch('/status/:taskId', task_controller_1.updateTaskStatusHandler);
exports.default = router;
