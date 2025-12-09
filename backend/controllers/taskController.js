import { getTasksCollection } from "../config/database.js";

async function getAllTasks(req, res) {
  try {
    const collection = getTasksCollection();
    const { completed } = req.query;
    
    let query = {};
    if (completed !== undefined) {
      query.completed = completed === "true";
    }
    
    const tasks = await collection.find(query).sort({ createdAt: -1 }).toArray();
    const formattedTasks = tasks.map(({ _id, ...task }) => task);
    
    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", message: error.message });
  }
}

async function createTask(req, res) {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required and must be a non-empty string" });
    }

    const collection = getTasksCollection();
    const now = new Date().toISOString();
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    await collection.insertOne(newTask);

    const allTasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
    const formattedTasks = allTasks.map(({ _id, ...task }) => task);

    res.status(201).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task", message: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const { id, title } = req.body;

    if (!id || !title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "ID and title are required" });
    }

    const collection = getTasksCollection();
    const existingTask = await collection.findOne({ id });
    
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const result = await collection.updateOne(
      { id },
      { 
        $set: { 
          title: title.trim(),
          updatedAt: new Date().toISOString()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const allTasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
    const formattedTasks = allTasks.map(({ _id, ...task }) => task);

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update task", message: error.message });
  }
}

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

async function toggleComplete(req, res) {
  try {
    const { id } = req.params;
    const collection = getTasksCollection();
    
    const task = await collection.findOne({ id });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const newCompletedStatus = !task.completed;
    await collection.findOneAndUpdate(
      { id },
      { 
        $set: { 
          completed: newCompletedStatus,
          updatedAt: new Date().toISOString()
        } 
      },
      { returnDocument: "after" }
    );

    const allTasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
    const formattedTasks = allTasks.map(({ _id, ...task }) => task);

    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle task completion", message: error.message });
  }
}

async function bulkDelete(req, res) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "IDs array is required and must not be empty" });
    }

    const collection = getTasksCollection();
    const result = await collection.deleteMany({ id: { $in: ids } });

    res.status(200).json({ 
      message: "Tasks deleted successfully",
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tasks", message: error.message });
  }
}

export {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
  bulkDelete,
};
