import { Task } from "../core/task-model";
import { statusConfig } from "../core/status-utils";

interface TreeNodeProps {
  task: Task;
  depth: number;
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

const TreeNode = ({ task, depth, onStatusChange }: TreeNodeProps) => {
  const status = statusConfig[task.status];

  return (
    <div
      className="flex items-center gap-2 py-1 hover:bg-gray-50 relative group"
      style={{ paddingLeft: `${depth * 24}px` }}
    >
      <button
        onClick={() => onStatusChange?.(task.id, "active")}
        disabled={task.status !== "pending"}
        className={`flex items-center gap-2 ${status.color} ${
          task.status === "pending" ? "hover:opacity-80" : "opacity-60"
        }`}
      >
        <span className="w-6 text-center">{status.icon}</span>
      </button>

      <span className={`${task.status === "active" ? "font-bold" : ""}`}>
        {task.name}
      </span>

      {task.status === "pending" && (
        <span className="text-sm text-gray-500 ml-2">
          ({task.totalScore.toFixed(1)})
        </span>
      )}

      {(task.status === "active" || task.status === "pending") && (
        <div className="text-xs text-gray-400 ml-auto">
          R:{task.resolution} + CV:{(task.confidence * task.value).toFixed(1)} +
          L:{task.learning} + F:{task.focus}
        </div>
      )}

      {task.status === "pending" && (
        <div className="hidden group-hover:block absolute right-0 -top-6 bg-white shadow-lg rounded-md p-2 text-xs text-gray-600 z-10">
          Click the status icon to mark as active
        </div>
      )}

      {task.status === "active" && (
        <div className="hidden group-hover:block absolute right-0 -top-6 bg-white shadow-lg rounded-md p-2 text-xs text-gray-600 z-10">
          Use the right panel to add subtasks or update status
        </div>
      )}
    </div>
  );
};

export default TreeNode;
