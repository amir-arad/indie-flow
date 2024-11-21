import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Task } from "../core/task-model";

interface ScoreEditorProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const ScoreEditor = ({ task, onUpdate }: ScoreEditorProps) => {
  const handleConfidenceChange = (value: number[]) => {
    onUpdate(task.id, { confidence: value[0] });
  };

  const handleValueChange = (value: string) => {
    onUpdate(task.id, { value: parseInt(value) as Task["value"] });
  };

  const handleLearningChange = (value: string) => {
    onUpdate(task.id, { learning: parseInt(value) as Task["learning"] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Scoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Confidence ({(task.confidence * 100).toFixed()}%)
          </label>
          <Slider
            value={[task.confidence]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleConfidenceChange}
            className="w-full"
          />
          <div className="text-xs text-gray-500">
            {task.confidence >= 0.7
              ? "Known approach"
              : task.confidence >= 0.3
              ? "Research needed"
              : "Complete unknown"}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Value</label>
          <Select
            value={task.value.toString()}
            onValueChange={handleValueChange}
          >
            <SelectTrigger>
              <SelectValue />
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
            value={task.learning.toString()}
            onValueChange={handleLearningChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 - Multiple Branches</SelectItem>
              <SelectItem value="2">2 - Single Branch</SelectItem>
              <SelectItem value="1">1 - Implementation Details</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Computed Scores</label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Resolution: {task.resolution}</div>
            <div>Focus: {task.focus}</div>
            <div>Total: {task.totalScore.toFixed(1)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreEditor;
