import express from "express";
import { createTaskHandler, getTaskHandler, getTasksHandler, deleteTaskHandler,
     searchTaskHandler, updateTaskHandler, GetTaskForDayHandler, updateTaskStatusHandler } from "../controllers/task.controller";
const router = express.Router();
router.post('/create', createTaskHandler);
router.put('/update/:id', updateTaskHandler);
router.get('/:id', getTaskHandler);
router.get('/:id', getTasksHandler);
router.get('/search/:id', searchTaskHandler);
router.delete('/delete/:id', deleteTaskHandler);
router.get('/today/:id', GetTaskForDayHandler )
router.patch('/status/:taskId', updateTaskStatusHandler)

export default router;