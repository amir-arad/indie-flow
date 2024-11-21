import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { statusConfig, statusUtils } from "../core/status-utils";

import { Button } from "@/components/ui/button";
import React from "react";
import { Task } from "../core/task-model";

interface StatusControlsProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
}

const StatusControls = ({ task, onStatusChange }: StatusControlsProps) => {
  const [confirmTarget, setConfirmTarget] = React.useState<
    Task["status"] | null
  >(null);

  const availableTransitions = statusUtils.getAvailableTransitions(task.status);

  const handleStatusClick = (newStatus: Task["status"]) => {
    const error = statusUtils.validateTransition(task, newStatus);
    if (error) {
      setConfirmTarget(null);
      return;
    }

    // Require confirmation for irrelevant and done states
    if (newStatus === "irrelevant" || newStatus === "done") {
      setConfirmTarget(newStatus);
    } else {
      onStatusChange(task.id, newStatus);
    }
  };

  const handleConfirm = () => {
    if (confirmTarget) {
      onStatusChange(task.id, confirmTarget);
      setConfirmTarget(null);
    }
  };

  if (statusUtils.isTerminal(task.status)) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        {availableTransitions.map((newStatus) => {
          const config = statusConfig[newStatus];
          return (
            <Button
              key={newStatus}
              size="sm"
              variant="outline"
              className={`${config.color} text-xs`}
              onClick={() => handleStatusClick(newStatus)}
            >
              {config.icon} {config.label}
            </Button>
          );
        })}
      </div>

      <AlertDialog
        open={!!confirmTarget}
        onOpenChange={() => setConfirmTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget === "irrelevant"
                ? "This will mark the task as irrelevant and remove it from consideration. This cannot be undone."
                : "This will mark the task as complete. This cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StatusControls;
