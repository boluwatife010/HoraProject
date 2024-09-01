import express from "express";
import { createTaskHandler, getTaskHandler, getTasksHandler, deleteTaskHandler, searchTaskHandler, updateTaskHandler } from "../controllers/task.controller";
const router = express.Router();
router.post('/create', createTaskHandler);
router.put('/update/:id', updateTaskHandler);
router.get('/:id', getTaskHandler);
router.get('/', getTasksHandler);
router.get('/search/:id', searchTaskHandler);
router.delete('/delete/:id', deleteTaskHandler);

export default router;