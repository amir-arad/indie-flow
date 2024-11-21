// Core task status types
export type TaskStatus = 'pending' | 'active' | 'planned' | 'done' | 'irrelevant';

// Base task interface
export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  parentId: string | null;
  childIds: string[];
  
  // RCVLF scoring components
  confidence: number;  // 0.0-1.0
  value: 1 | 2 | 3;   // Core=3, Support=2, Nice=1
  learning: 1 | 2 | 3; // Multi=3, Single=2, Minor=1
  
  // Computed fields (updated by system)
  resolution: number;  // Depth in tree
  focus: 0 | 1 | 2;   // Position relative to active
  totalScore: number; // R + C×V + L + F
}

// Project state interface
export interface ProjectState {
  tasks: Record<string, Task>;
  activeTaskId: string | null;
  rootTaskId: string | null;
}

// Task creation parameters
export interface NewTaskParams {
  name: string;
  confidence: number;
  value: 1 | 2 | 3;
  learning: 1 | 2 | 3;
  parentId: string | null;
}

// Utility type for frontier tasks
export type FrontierTask = Task & {
  isAvailable: boolean;
  prerequisites: string[];
}

// Score calculation helper
export const calculateScore = (task: Task): number => {
  return task.resolution + 
         (task.confidence * task.value) + 
         task.learning + 
         task.focus;
};

// Task validation
export const validateTask = (task: Task): boolean => {
  return task.confidence >= 0 && task.confidence <= 1 &&
         [1, 2, 3].includes(task.value) &&
         [1, 2, 3].includes(task.learning) &&
         [0, 1, 2].includes(task.focus);
};
