import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TASKS_FILE = join(__dirname, "../data/tasks.json");

// Helper function to read tasks from file
async function readTasks() {
  try {
    const data = await readFile(TASKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

// Helper function to write tasks to file
async function writeTasks(tasks) {
  await writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

// Get all tasks
async function getAllTasks(req, res) {
  try {
    const tasks = await readTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to read tasks", message: error.message });
  }
}

// Get single task by ID
async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to read task", message: error.message });
  }
}

// Create new task
async function createTask(req, res) {
  try {
    const { title } = req.body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required and must be a non-empty string" });
    }

    const tasks = await readTasks();
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task", message: error.message });
  }
}

// Update task
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required and must be a non-empty string" });
    }

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title.trim(),
    };

    await writeTasks(tasks);

    res.status(200).json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task", message: error.message });
  }
}

// Delete task
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    await writeTasks(tasks);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task", message: error.message });
  }
}

export {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

