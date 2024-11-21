import { Task } from "./task-model";

// Custom error types
export class RCVLFError extends Error {
  constructor(message: string, public code: ErrorCode) {
    super(message);
    this.name = "RCVLFError";
  }
}

export enum ErrorCode {
  INVALID_TASK = "INVALID_TASK",
  INVALID_TRANSITION = "INVALID_TRANSITION",
  INVALID_SCORE = "INVALID_SCORE",
  INVALID_TREE = "INVALID_TREE",
  STATE_ERROR = "STATE_ERROR",
}

// Error messages
const errorMessages: Record<ErrorCode, string> = {
  INVALID_TASK: "Invalid task operation",
  INVALID_TRANSITION: "Invalid status transition",
  INVALID_SCORE: "Invalid score values",
  INVALID_TREE: "Invalid tree structure",
  STATE_ERROR: "State update error",
};

// Error utilities
export const errorUtils = {
  // Task validation errors
  validateTask(task: Task): void {
    if (!task.name?.trim()) {
      throw new RCVLFError("Task name is required", ErrorCode.INVALID_TASK);
    }

    if (task.confidence < 0 || task.confidence > 1) {
      throw new RCVLFError(
        "Confidence must be between 0 and 1",
        ErrorCode.INVALID_SCORE
      );
    }

    if (![1, 2, 3].includes(task.value)) {
      throw new RCVLFError("Value must be 1, 2, or 3", ErrorCode.INVALID_SCORE);
    }

    if (![1, 2, 3].includes(task.learning)) {
      throw new RCVLFError(
        "Learning must be 1, 2, or 3",
        ErrorCode.INVALID_SCORE
      );
    }
  },

  // Tree validation errors
  validateTreeOperation(
    tasks: Record<string, Task>,
    taskId: string,
    operation: "add" | "update" | "delete"
  ): void {
    const task = tasks[taskId];
    if (!task) {
      throw new RCVLFError(`Task ${taskId} not found`, ErrorCode.INVALID_TREE);
    }

    if (operation === "delete" && task.childIds.length > 0) {
      throw new RCVLFError(
        "Cannot delete task with children",
        ErrorCode.INVALID_TREE
      );
    }

    if (operation === "update") {
      if (task.parentId && !tasks[task.parentId]) {
        throw new RCVLFError(
          "Invalid parent reference",
          ErrorCode.INVALID_TREE
        );
      }

      for (const childId of task.childIds) {
        if (!tasks[childId]) {
          throw new RCVLFError(
            "Invalid child reference",
            ErrorCode.INVALID_TREE
          );
        }
      }
    }
  },

  // Format error for display
  formatError(error: unknown): { message: string; code?: ErrorCode } {
    if (error instanceof RCVLFError) {
      return {
        message: error.message || errorMessages[error.code],
        code: error.code,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        code: ErrorCode.STATE_ERROR,
      };
    }

    return {
      message: "An unknown error occurred",
      code: ErrorCode.STATE_ERROR,
    };
  },

  // Create error toast content
  getErrorToast(error: unknown) {
    const { message, code } = this.formatError(error);
    return {
      title: code ? errorMessages[code] : "Error",
      description: message,
      variant: "destructive" as const,
    };
  },
};
