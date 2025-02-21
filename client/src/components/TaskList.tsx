import { useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TaskList() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { tasks, isLoading, addTask, toggleTask, deleteTask } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await addTask(newTaskTitle);
    setNewTaskTitle("");
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newTaskTitle.trim()}>
          Add Task
        </Button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4 flex items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => toggleTask(task.id, !!checked)}
            />
            <span className={task.completed ? "line-through text-muted-foreground flex-1" : "flex-1"}>
              {task.title}
            </span>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
