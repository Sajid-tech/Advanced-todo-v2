"use client";
import axios from "axios";
import { CirclePlus, CirclePlusIcon, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import AddTaskInline from "./AddTaskInline";

export const AddTaskWrapper = ({ parentTask, projectId }) => {
  const [showAddTask, setShowAddTask] = useState(false);

  return showAddTask ? (
    <AddTaskInline
      setShowAddTask={setShowAddTask}
      parentTask={parentTask}
      projectId={projectId}
    />
  ) : (
    <AddTaskButton
      onClick={() => setShowAddTask(true)}
      title={parentTask ? "Add sub-task" : "Add task"}
    />
  );
};

// Add task button
export default function AddTaskButton({ onClick, title }) {
  return (
    <button className="pl-2 flex mt-2 flex-1" onClick={onClick}>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <div className="flex items-center gap-2 justify-center">
          <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
          <h3 className="text-base font-light tracking-tight text-foreground/70">
            {title}
          </h3>
        </div>
      </div>
    </button>
  );
}
