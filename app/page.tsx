"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = "http://localhost:3001/api";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from backend on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks/create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTaskTitle.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      const updatedTasks = await response.json();
      setTasks(updatedTasks);
      setNewTaskTitle("");
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  const handleUpdateTask = async () => {
    if (!newTaskTitle.trim() || !editingTaskId) return;

    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks/update-task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editingTaskId, title: newTaskTitle.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      const updatedTasks = await response.json();
      setTasks(updatedTasks);
      setNewTaskTitle("");
      setEditingTaskId(null);
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle task completion");
      }

      const updatedTasks = await response.json();
      setTasks(updatedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle completion");
      console.error("Error toggling completion:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = (task: Task) => {
    setNewTaskTitle(task.title);
    setEditingTaskId(task.id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setNewTaskTitle("");
      setEditingTaskId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-semibold text-foreground">
          NotSoSimple ToDo
        </h1>

        <div className="mb-8 flex justify-center">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-purple-600 text-white hover:bg-purple-700"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            ADD NEW TASK
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border px-6 py-4">
            <div className="font-semibold text-foreground">TASKS</div>
            <div className="font-semibold text-foreground">ACTIONS</div>
          </div>

          <div className="divide-y divide-border">
            {loading && (
              <div className="px-6 py-8 text-center text-muted-foreground">
                Loading tasks...
              </div>
            )}
            {error && (
              <div className="px-6 py-8 text-center text-red-500">
                Error: {error}
              </div>
            )}
            {!loading && !error && tasks.length === 0 && (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No tasks yet. Add your first task!
              </div>
            )}
            {!loading &&
              !error &&
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-foreground cursor-pointer ${task.completed ? "line-through opacity-60" : ""}`}
                    >
                      {task.title}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                      onClick={() => handleEdit(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTaskId ? "Edit Task" : "Add New Task"}</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 py-4">
              <Input
                placeholder="Type here"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editingTaskId ? handleUpdateTask() : handleCreateTask();
                  }
                }}
              />
              <Button
                onClick={editingTaskId ? handleUpdateTask : handleCreateTask}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                {editingTaskId ? "UPDATE" : "SUBMIT"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
