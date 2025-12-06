"use client";

import { useState } from "react";
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
}

const initialTasks: Task[] = [
  { id: "1", title: "Write Frontend code" },
  { id: "2", title: "Learn Nodejs" },
  { id: "3", title: "Docker bhi padhlo" },
  { id: "4", title: "Samjhdaar bano" },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

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
            {tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <Checkbox id={`task-${task.id}`} />
                  <label
                    htmlFor={`task-${task.id}`}
                    className="text-foreground cursor-pointer"
                  >
                    {task.title}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 py-4">
              <Input
                placeholder="Type here"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (newTaskTitle.trim()) {
                    setTasks([
                      ...tasks,
                      {
                        id: Date.now().toString(),
                        title: newTaskTitle.trim(),
                      },
                    ]);
                    setNewTaskTitle("");
                    setIsDialogOpen(false);
                  }
                }}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                SUBMIT
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
