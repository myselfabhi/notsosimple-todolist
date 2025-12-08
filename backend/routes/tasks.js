import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get("/", getAllTasks);

// GET /api/tasks/:id - Get single task
router.get("/:id", getTaskById);

// POST /api/tasks - Create new task
router.post("/", createTask);

// PUT /api/tasks/:id - Update task
router.put("/:id", updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", deleteTask);

export default router;

