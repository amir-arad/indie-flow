import { Task, ProjectState } from "./task-model";

export const treeUtils = {
  // Get full path from root to task
  getPath(tasks: Record<string, Task>, taskId: string): Task[] {
    const path: Task[] = [];
    let current = tasks[taskId];

    while (current) {
      path.unshift(current);
      current = current.parentId ? tasks[current.parentId] : null;
    }

    return path;
  },

  // Get all descendants of a task
  getDescendants(tasks: Record<string, Task>, taskId: string): Task[] {
    const result: Task[] = [];
    const stack = [...(tasks[taskId]?.childIds || [])];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const current = tasks[currentId];
      if (current) {
        result.push(current);
        stack.push(...current.childIds);
      }
    }

    return result;
  },

  // Get task depth in tree
  getDepth(tasks: Record<string, Task>, taskId: string): number {
    return this.getPath(tasks, taskId).length - 1;
  },

  // Get siblings of a task
  getSiblings(tasks: Record<string, Task>, taskId: string): Task[] {
    const task = tasks[taskId];
    if (!task?.parentId) return [];

    const parent = tasks[task.parentId];
    return parent.childIds
      .filter((id) => id !== taskId)
      .map((id) => tasks[id])
      .filter((t): t is Task => t !== undefined);
  },

  // Validate tree structure
  validateTree(state: ProjectState): string | null {
    const { tasks, rootTaskId } = state;
    if (!rootTaskId) return "No root task defined";

    // Check for cycles
    const visited = new Set<string>();
    const stack = [rootTaskId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      if (visited.has(currentId)) {
        return "Cycle detected in task tree";
      }

      visited.add(currentId);
      const current = tasks[currentId];
      if (!current) return `Missing task: ${currentId}`;

      stack.push(...current.childIds);
    }

    // Verify parent-child relationships
    for (const task of Object.values(tasks)) {
      // Check parent link
      if (task.parentId && !tasks[task.parentId]) {
        return `Invalid parent reference: ${task.parentId}`;
      }

      // Check child links
      for (const childId of task.childIds) {
        if (!tasks[childId]) {
          return `Invalid child reference: ${childId}`;
        }
        if (tasks[childId].parentId !== task.id) {
          return `Mismatched parent-child relationship: ${task.id} -> ${childId}`;
        }
      }

      // Verify resolution (depth) is correct
      const actualDepth = this.getDepth(tasks, task.id);
      if (task.resolution !== actualDepth) {
        return `Incorrect resolution for task ${task.id}: ${task.resolution} vs ${actualDepth}`;
      }
    }

    return null;
  },

  // Get tasks in display order (for tree view)
  getOrderedTasks(tasks: Record<string, Task>, rootId: string): Task[] {
    const result: Task[] = [];

    const traverse = (taskId: string) => {
      const task = tasks[taskId];
      if (task) {
        result.push(task);
        task.childIds.forEach(traverse);
      }
    };

    traverse(rootId);
    return result;
  },
};
