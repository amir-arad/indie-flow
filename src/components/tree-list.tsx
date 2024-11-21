import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import React from "react";
import { Task } from "../core/task-model";
import TreeNode from "./tree-node";
import { treeUtils } from "../core/tree-utils";

interface TreeListProps {
  tasks: Record<string, Task>;
  rootTaskId: string | null;
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

const TreeList = ({ tasks, rootTaskId, onStatusChange }: TreeListProps) => {
  if (!rootTaskId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">No tasks created yet</div>
        </CardContent>
      </Card>
    );
  }

  const orderedTasks = treeUtils.getOrderedTasks(tasks, rootTaskId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task Tree</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {orderedTasks.map((task) => (
            <TreeNode
              key={task.id}
              task={task}
              depth={task.resolution}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>

        {orderedTasks.length === 0 && (
          <div className="text-center text-gray-500">Task tree is empty</div>
        )}
      </CardContent>
    </Card>
  );
};

export default TreeList;
