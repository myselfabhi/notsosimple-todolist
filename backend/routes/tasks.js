import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
  bulkDelete,
} from "../controllers/taskController.js";

const router = express.Router();
// all tasks route 
router.get("/", getAllTasks);

router.post("/create-task", createTask);

router.put("/update-task", updateTask);

router.delete("/:id", deleteTask);

router.patch("/:id/complete", toggleComplete);

router.delete("/bulk", bulkDelete);

export default router;
