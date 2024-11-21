import { Task, TaskStatus } from "./task-model";

// Status transition validation
export const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  pending: ["active", "irrelevant"],
  active: ["planned", "done"],
  planned: [],
  done: [],
  irrelevant: [],
};

// Status icons and colors
export const statusConfig = {
  pending: {
    icon: "⚪",
    color: "text-blue-500",
    label: "Pending",
  },
  active: {
    icon: "🟢",
    color: "text-yellow-500",
    label: "Active",
  },
  planned: {
    icon: "📋",
    color: "text-gray-500",
    label: "Planned",
  },
  done: {
    icon: "✅",
    color: "text-gray-500",
    label: "Done",
  },
  irrelevant: {
    icon: "❌",
    color: "text-gray-500",
    label: "Irrelevant",
  },
} as const;

// Status utility functions
export const statusUtils = {
  canTransition: (from: TaskStatus, to: TaskStatus): boolean => {
    return allowedTransitions[from].includes(to);
  },

  isTerminal: (status: TaskStatus): boolean => {
    return ["done", "planned", "irrelevant"].includes(status);
  },

  isActive: (status: TaskStatus): boolean => {
    return status === "active";
  },

  inFrontier: (task: Task): boolean => {
    return task.status === "pending";
  },

  getAvailableTransitions: (status: TaskStatus): TaskStatus[] => {
    return allowedTransitions[status];
  },

  validateTransition: (task: Task, newStatus: TaskStatus): string | null => {
    if (!statusUtils.canTransition(task.status, newStatus)) {
      return `Cannot transition from ${task.status} to ${newStatus}`;
    }
    if (newStatus === "planned" && task.childIds.length === 0) {
      return "Cannot mark as planned without subtasks";
    }
    return null;
  },
};
