import { Task, ProjectState, calculateScore } from "./task-model";
import { treeUtils } from "./tree-utils";

export class ScoreHandler {
  // Update a task's score components
  updateTaskScore(
    state: ProjectState,
    taskId: string,
    updates: Partial<Pick<Task, "confidence" | "value" | "learning">>
  ): ProjectState {
    const task = state.tasks[taskId];
    if (!task) return state;

    // Create updated task with new score components
    const updatedTask: Task = {
      ...task,
      ...updates,
      totalScore: 0, // Will be recalculated
    };

    // Recalculate total score
    updatedTask.totalScore = calculateScore(updatedTask);

    // Update state
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: updatedTask,
      },
    };
  }

  // Recalculate all scores after a structural change
  recalculateAllScores(state: ProjectState): ProjectState {
    if (!state.rootTaskId) return state;

    const newTasks = { ...state.tasks };

    // Update resolution (depth) for all tasks
    for (const taskId of Object.keys(newTasks)) {
      const depth = treeUtils.getDepth(newTasks, taskId);
      newTasks[taskId] = {
        ...newTasks[taskId],
        resolution: depth,
      };
    }

    // Update focus scores based on active task
    if (state.activeTaskId) {
      const activeTask = newTasks[state.activeTaskId];
      for (const task of Object.values(newTasks)) {
        let focus: 0 | 1 | 2 = 0;

        // Child of active task
        if (task.parentId === activeTask.id) {
          focus = 2;
        }
        // Sibling of active task
        else if (task.parentId === activeTask.parentId) {
          focus = 1;
        }

        task.focus = focus;
      }
    }

    // Recalculate total scores
    for (const task of Object.values(newTasks)) {
      task.totalScore = calculateScore(task);
    }

    return {
      ...state,
      tasks: newTasks,
    };
  }

  // Get frontier tasks sorted by score
  getFrontierTasks(state: ProjectState): Task[] {
    return Object.values(state.tasks)
      .filter((task) => task.status === "pending")
      .sort((a, b) => b.totalScore - a.totalScore);
  }

  // Validate score components
  validateScores(task: Task): string | null {
    if (task.confidence < 0 || task.confidence > 1) {
      return "Confidence must be between 0 and 1";
    }

    if (![1, 2, 3].includes(task.value)) {
      return "Value must be 1, 2, or 3";
    }

    if (![1, 2, 3].includes(task.learning)) {
      return "Learning must be 1, 2, or 3";
    }

    if (![0, 1, 2].includes(task.focus)) {
      return "Focus must be 0, 1, or 2";
    }

    if (task.resolution < 0) {
      return "Resolution cannot be negative";
    }

    return null;
  }

  // Get score breakdown for display
  getScoreBreakdown(task: Task): {
    resolution: number;
    confidenceValue: number;
    learning: number;
    focus: number;
    total: number;
  } {
    return {
      resolution: task.resolution,
      confidenceValue: +(task.confidence * task.value).toFixed(1),
      learning: task.learning,
      focus: task.focus,
      total: task.totalScore,
    };
  }

  // Check if task meets minimum confidence threshold
  isTaskReady(task: Task, minConfidence: number = 0.7): boolean {
    return task.confidence >= minConfidence;
  }
}
