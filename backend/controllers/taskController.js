import { getTasksCollection } from "../config/database.js";

// Get all tasks
async function getAllTasks(req, res) {
  try {
    const collection = getTasksCollection();
    const tasks = await collection.find({}).toArray();
    
    // Remove MongoDB _id and return only our id and title
    const formattedTasks = tasks.map(({ _id, ...task }) => task);
    
    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to read tasks", message: error.message });
  }
}

// Get single task by ID
async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const collection = getTasksCollection();
    const task = await collection.findOne({ id });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Remove MongoDB _id
    const { _id, ...formattedTask } = task;
    res.status(200).json(formattedTask);
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

    const collection = getTasksCollection();
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
    };

    await collection.insertOne(newTask);

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

    const collection = getTasksCollection();
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { title: title.trim() } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Remove MongoDB _id
    const { _id, ...updatedTask } = result.value;
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task", message: error.message });
  }
}

// Delete task
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const collection = getTasksCollection();
    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

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

