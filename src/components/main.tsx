import { Alert, AlertDescription } from "@/components/ui/alert";
import { NewTaskParams, Task } from "../core/task-model";
import { RCVLFStore, TaskStore } from "../core/store";

import React from "react";
import ScoreBreakdown from "./score-breakdown";
import ScoreEditor from "./score-editor";
import { ScoreHandler } from "../core/score-handler";
import StatusControls from "./status-controls";
import TaskCreation from "./task-creation";
import TreeList from "./tree-list";
import { errorUtils } from "../core/error-handling";
import { useToast } from "@/hooks/use-toast";

const RCVLFApp = () => {
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);

  // Initialize core services
  const [store] = React.useState<TaskStore>(() => new RCVLFStore());
  const [scoreHandler] = React.useState(() => new ScoreHandler());

  // Track state
  const [state, setState] = React.useState(() => store.getState());

  // Subscribe to store updates
  React.useEffect(() => {
    return store.subscribe(() => {
      try {
        const newState = store.getState();
        setError(null);
        setState(newState);
      } catch (err) {
        const { message } = errorUtils.formatError(err);
        setError(message);
      }
    });
  }, [store]);

  // Get active task if any
  const activeTask = state.activeTaskId
    ? state.tasks[state.activeTaskId]
    : null;

  // Get frontier tasks
  const frontierTasks = scoreHandler.getFrontierTasks(state);

  const handleError = (error: unknown) => {
    const toastData = errorUtils.getErrorToast(error);
    toast(toastData);
  };

  const handleCreateTask = (params: NewTaskParams) => {
    try {
      store.createTask(params);
    } catch (err) {
      handleError(err);
    }
  };

  const handleStatusChange = (taskId: string, status: Task["status"]) => {
    try {
      store.updateTaskStatus(taskId, status);
    } catch (err) {
      handleError(err);
    }
  };

  const handleScoreUpdate = (taskId: string, updates: Partial<Task>) => {
    try {
      const newState = scoreHandler.updateTaskScore(state, taskId, updates);
      store.updateTaskStatus(taskId, newState.tasks[taskId].status);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">RCVLF Project Management</h1>
          {activeTask && (
            <div className="text-sm text-gray-600">
              Active: {activeTask.name}
            </div>
          )}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Tree view */}
          <div className="col-span-2 space-y-4">
            {!state.rootTaskId && (
              <TaskCreation onCreateTask={handleCreateTask} />
            )}

            <TreeList
              tasks={state.tasks}
              rootTaskId={state.rootTaskId}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            <ScoreBreakdown tasks={frontierTasks} activeTask={activeTask} />

            {activeTask && (
              <>
                <ScoreEditor task={activeTask} onUpdate={handleScoreUpdate} />

                <TaskCreation
                  parentTask={activeTask}
                  onCreateTask={handleCreateTask}
                />

                <StatusControls
                  task={activeTask}
                  onStatusChange={handleStatusChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RCVLFApp;
