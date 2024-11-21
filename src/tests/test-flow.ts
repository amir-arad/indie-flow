import { ErrorCode, errorUtils } from "../core/error-handling";
import { NewTaskParams, Task } from "../core/task-model";

import { RCVLFStore } from "../core/store";
import { ScoreHandler } from "../core/score-handler";

describe("RCVLF System Tests", () => {
  let store: RCVLFStore;
  let scoreHandler: ScoreHandler;

  beforeEach(() => {
    store = new RCVLFStore();
    scoreHandler = new ScoreHandler();
  });

  describe("Task Creation Flow", () => {
    test("Should create root task", () => {
      const params: NewTaskParams = {
        name: "Build Web App",
        confidence: 1.0,
        value: 3,
        learning: 3,
        parentId: null,
      };

      store.createTask(params);
      const state = store.getState();

      expect(state.rootTaskId).toBeTruthy();
      expect(state.tasks[state.rootTaskId!].name).toBe("Build Web App");
      expect(state.tasks[state.rootTaskId!].totalScore).toBe(8.0); // 0+3+3+2
    });

    test("Should create subtasks", () => {
      // Create root
      const root = store.createTask({
        name: "Root",
        confidence: 1.0,
        value: 3,
        learning: 3,
        parentId: null,
      });

      // Activate root
      store.updateTaskStatus(root.id, "active");

      // Add subtasks
      const subtask = store.createTask({
        name: "Subtask",
        confidence: 0.7,
        value: 2,
        learning: 1,
        parentId: root.id,
      });

      const state = store.getState();
      expect(state.tasks[root.id].childIds).toContain(subtask.id);
      expect(state.tasks[subtask.id].resolution).toBe(1);
      expect(state.tasks[subtask.id].focus).toBe(2); // Child of active
    });

    test("Should reject invalid tasks", () => {
      expect(() =>
        store.createTask({
          name: "", // Empty name
          confidence: 1.0,
          value: 3,
          learning: 3,
          parentId: null,
        })
      ).toThrow(ErrorCode.INVALID_TASK);

      expect(() =>
        store.createTask({
          name: "Task",
          confidence: 1.5, // Invalid confidence
          value: 3,
          learning: 3,
          parentId: null,
        })
      ).toThrow(ErrorCode.INVALID_SCORE);
    });
  });

  describe("Status Transitions", () => {
    let rootTask: Task;

    beforeEach(() => {
      rootTask = store.createTask({
        name: "Root",
        confidence: 1.0,
        value: 3,
        learning: 3,
        parentId: null,
      });
    });

    test("Should handle valid transitions", () => {
      // pending -> active
      store.updateTaskStatus(rootTask.id, "active");
      expect(store.getState().tasks[rootTask.id].status).toBe("active");
      expect(store.getState().activeTaskId).toBe(rootTask.id);

      // active -> planned (with subtasks)
      const subtask = store.createTask({
        name: "Subtask",
        confidence: 0.7,
        value: 2,
        learning: 1,
        parentId: rootTask.id,
      });
      store.updateTaskStatus(rootTask.id, "planned");
      expect(store.getState().tasks[rootTask.id].status).toBe("planned");
    });

    test("Should reject invalid transitions", () => {
      // Can't go directly to planned
      expect(() => store.updateTaskStatus(rootTask.id, "planned")).toThrow(
        ErrorCode.INVALID_TRANSITION
      );

      // Can't go to done without being active
      expect(() => store.updateTaskStatus(rootTask.id, "done")).toThrow(
        ErrorCode.INVALID_TRANSITION
      );
    });
  });

  describe("Scoring System", () => {
    test("Should calculate scores correctly", () => {
      const root = store.createTask({
        name: "Root",
        confidence: 1.0, // C=1.0
        value: 3, // V=3
        learning: 3, // L=3
        parentId: null, // R=0, F=2 (first task)
      });

      const state = store.getState();
      const score = state.tasks[root.id].totalScore;
      // R(0) + CV(1.0×3) + L(3) + F(2) = 8.0
      expect(score).toBe(8.0);
    });

    test("Should update focus scores", () => {
      // Create and activate root
      const root = store.createTask({
        name: "Root",
        confidence: 1.0,
        value: 3,
        learning: 3,
        parentId: null,
      });
      store.updateTaskStatus(root.id, "active");

      // Create siblings
      const child1 = store.createTask({
        name: "Child 1",
        confidence: 0.7,
        value: 2,
        learning: 1,
        parentId: root.id,
      });

      const child2 = store.createTask({
        name: "Child 2",
        confidence: 0.7,
        value: 2,
        learning: 1,
        parentId: root.id,
      });

      const state = store.getState();
      // Children of active task get focus=2
      expect(state.tasks[child1.id].focus).toBe(2);
      expect(state.tasks[child2.id].focus).toBe(2);

      // Activate child1
      store.updateTaskStatus(child1.id, "active");
      const newState = store.getState();
      // Sibling of active task gets focus=1
      expect(newState.tasks[child2.id].focus).toBe(1);
    });
  });

  describe("Tree Operations", () => {
    test("Should maintain tree integrity", () => {
      const root = store.createTask({
        name: "Root",
        confidence: 1.0,
        value: 3,
        learning: 3,
        parentId: null,
      });

      store.updateTaskStatus(root.id, "active");

      const child = store.createTask({
        name: "Child",
        confidence: 0.7,
        value: 2,
        learning: 1,
        parentId: root.id,
      });

      const state = store.getState();

      // Check parent-child links
      expect(state.tasks[root.id].childIds).toContain(child.id);
      expect(state.tasks[child.id].parentId).toBe(root.id);

      // Check resolution (depth)
      expect(state.tasks[root.id].resolution).toBe(0);
      expect(state.tasks[child.id].resolution).toBe(1);
    });
  });
});
