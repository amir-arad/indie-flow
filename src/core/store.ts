import {
  Task,
  ProjectState,
  NewTaskParams,
  calculateScore,
} from "./task-model";
import { statusUtils } from "./status-utils";

export interface TaskStore {
  // Core state access
  getState(): ProjectState;
  getTask(id: string): Task | null;
  getFrontierTasks(): Task[];

  // Task operations
  createTask(params: NewTaskParams): Task;
  updateTaskStatus(id: string, status: Task["status"]): void;
  addSubtasks(parentId: string, subtasks: NewTaskParams[]): void;

  // Listeners
  subscribe(listener: () => void): () => void;
}

export class RCVLFStore implements TaskStore {
  private state: ProjectState = {
    tasks: {},
    activeTaskId: null,
    rootTaskId: null,
  };
  private listeners: (() => void)[] = [];

  // Core state access
  getState(): ProjectState {
    return this.state;
  }

  getTask(id: string): Task | null {
    return this.state.tasks[id] || null;
  }

  getFrontierTasks(): Task[] {
    return Object.values(this.state.tasks)
      .filter((task) => statusUtils.inFrontier(task))
      .sort((a, b) => b.totalScore - a.totalScore);
  }

  // State updates
  private updateState(newState: ProjectState) {
    this.state = newState;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // Task operations
  createTask(params: NewTaskParams): Task {
    const id = crypto.randomUUID();
    const parentTask = params.parentId ? this.getTask(params.parentId) : null;

    const task: Task = {
      id,
      name: params.name,
      status: "pending",
      parentId: params.parentId,
      childIds: [],
      confidence: params.confidence,
      value: params.value,
      learning: params.learning,
      resolution: parentTask ? parentTask.resolution + 1 : 0,
      focus: this.calculateFocus(params.parentId),
      totalScore: 0, // Will be calculated below
    };

    task.totalScore = calculateScore(task);

    // Update state
    const newTasks = {
      ...this.state.tasks,
      [id]: task,
    };

    // Update parent's childIds if needed
    if (parentTask) {
      newTasks[parentTask.id] = {
        ...parentTask,
        childIds: [...parentTask.childIds, id],
      };
    }

    this.updateState({
      ...this.state,
      tasks: newTasks,
      rootTaskId: this.state.rootTaskId || id,
    });

    return task;
  }

  updateTaskStatus(id: string, newStatus: Task["status"]): void {
    const task = this.getTask(id);
    if (!task) return;

    const validationError = statusUtils.validateTransition(task, newStatus);
    if (validationError) throw new Error(validationError);

    // Update task status
    const updatedTask = {
      ...task,
      status: newStatus,
    };

    // Update active task tracking
    const newActiveTaskId =
      newStatus === "active"
        ? id
        : newStatus !== "active" && id === this.state.activeTaskId
        ? null
        : this.state.activeTaskId;

    // Recalculate focus scores if active task changed
    const tasks = this.recalculateFocusScores(
      {
        ...this.state.tasks,
        [id]: updatedTask,
      },
      newActiveTaskId
    );

    this.updateState({
      ...this.state,
      tasks,
      activeTaskId: newActiveTaskId,
    });
  }

  addSubtasks(parentId: string, subtasks: NewTaskParams[]): void {
    const parent = this.getTask(parentId);
    if (!parent || !statusUtils.isActive(parent.status)) {
      throw new Error("Parent task must exist and be active");
    }

    // Create all subtasks
    subtasks.forEach((params) => {
      this.createTask({ ...params, parentId });
    });

    // Mark parent as planned
    this.updateTaskStatus(parentId, "planned");
  }

  // Focus calculation
  private calculateFocus(parentId: string | null): Task["focus"] {
    const activeTask = this.state.activeTaskId
      ? this.getTask(this.state.activeTaskId)
      : null;

    if (!activeTask) return 0;
    if (parentId === activeTask.id) return 2;
    if (parentId === activeTask.parentId) return 1;
    return 0;
  }

  private recalculateFocusScores(
    tasks: Record<string, Task>,
    activeTaskId: string | null
  ): Record<string, Task> {
    return Object.entries(tasks).reduce((acc, [id, task]) => {
      const focus = this.calculateFocus(task.parentId);
      const totalScore = calculateScore({ ...task, focus });
      acc[id] = { ...task, focus, totalScore };
      return acc;
    }, {} as Record<string, Task>);
  }

  // Subscription management
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}
