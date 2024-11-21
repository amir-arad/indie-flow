import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewTaskParams, Task } from "../core/task-model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Slider } from "@/components/ui/slider";

interface TaskCreationProps {
  parentTask?: Task | null;
  onCreateTask: (params: NewTaskParams) => void;
}

const TaskCreation = ({ parentTask, onCreateTask }: TaskCreationProps) => {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [params, setParams] = React.useState<Partial<NewTaskParams>>({
    confidence: 0.7,
    value: 2,
    learning: 1,
    parentId: parentTask?.id || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!params.name?.trim()) {
      setError("Task name is required");
      return;
    }

    try {
      onCreateTask(params as NewTaskParams);
      setOpen(false);
      setError(null);
      setParams({
        confidence: 0.7,
        value: 2,
        learning: 1,
        parentId: parentTask?.id || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {parentTask ? "Add Subtask" : "Create Root Task"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {parentTask ? "Create New Subtask" : "Create Root Task"}
          </DialogTitle>
          <DialogDescription>
            {parentTask
              ? "Add a new subtask to break down the current task."
              : "Create the root task to start your project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Task Name</label>
            <Input
              value={params.name || ""}
              onChange={(e) => setParams({ ...params, name: e.target.value })}
              placeholder="Enter task name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Confidence ({((params.confidence || 0) * 100).toFixed()}%)
            </label>
            <Slider
              value={[params.confidence || 0.7]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([value]) =>
                setParams({ ...params, confidence: value })
              }
            />
            <div className="text-xs text-gray-500">
              {(params.confidence || 0) >= 0.7
                ? "Known approach"
                : (params.confidence || 0) >= 0.3
                ? "Research needed"
                : "Complete unknown"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Value</label>
            <Select
              value={params.value?.toString()}
              onValueChange={(v) =>
                setParams({ ...params, value: parseInt(v) as Task["value"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 - Core Functionality</SelectItem>
                <SelectItem value="2">2 - Supporting Component</SelectItem>
                <SelectItem value="1">1 - Nice to Have</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Learning Impact</label>
            <Select
              value={params.learning?.toString()}
              onValueChange={(v) =>
                setParams({
                  ...params,
                  learning: parseInt(v) as Task["learning"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select learning impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 - Multiple Branches</SelectItem>
                <SelectItem value="2">2 - Single Branch</SelectItem>
                <SelectItem value="1">1 - Implementation Details</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreation;
