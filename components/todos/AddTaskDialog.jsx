"use client";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Calendar,
  ChevronDown,
  Flag,
  Hash,
  TagIcon,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Task from "./Task";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import { format } from "date-fns";

const AddTaskDialog = ({ data }) => {
  const { taskName, description, projectId, labelId, priority, dueDate, _id } =
    data;

  const project = projectId;
  const label = labelId;

  const [todoDetails, setTodoDetails] = useState([]);
  const [completedSubtodosByProject, setCompletedSubtodosByProject] = useState(
    []
  );
  const [inCompletedSubtodosByProject, setInCompletedSubtodosByProject] =
    useState([]);

  useEffect(() => {
    const fetchSubtodos = async () => {
      try {
        const res = await axios.get(`/api/todos/completed`); // Adjust endpoint as per your API route
        setCompletedSubtodosByProject(
          res.data.filter((todo) => todo.isCompleted)
        );
        setInCompletedSubtodosByProject(
          res.data.filter((todo) => !todo.isCompleted)
        );
      } catch (error) {
        console.error("Error fetching subtodos:", error);
      }
    };
    fetchSubtodos();
  }, []);

  useEffect(() => {
    const data = [
      {
        labelName: "Project",
        value: project?.name || "",
        icon: <Hash className="w-4 h-4 text-primary capitalize" />,
      },
      {
        labelName: "Due date",
        value: format(dueDate || new Date(), "MMM dd yyyy"),
        icon: <Calendar className="w-4 h-4 text-primary capitalize" />,
      },
      {
        labelName: "Priority",
        value: priority?.toString() || "",
        icon: <Flag className="w-4 h-4 text-primary capitalize" />,
      },
      {
        labelName: "Label",
        value: label?.name || "",
        icon: <TagIcon className="w-4 h-4 text-primary capitalize" />,
      },
    ];
    if (data) {
      setTodoDetails(data);
    }
  }, [dueDate, label?.name, priority, project]);

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>
          <p className="my-2 capitalize">{description}</p>
          <div className="flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg:gap-0 ">
            <div className="flex gap-1">
              <ChevronDown className="w-5 h-5 text-primary" />
              <p className="font-bold flex text-sm text-gray-900">Sub-tasks</p>
            </div>
            <div>
              <h4>Suggest missing task</h4>
            </div>
          </div>
          <div className="pl-4">
            {inCompletedSubtodosByProject.map((task) => {
              return (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() =>
                    checkASubTodoMutation({ taskId: task._id })
                  }
                />
              );
            })}
            <div className="pb-4">
              <h1>Add task Wrapper</h1>
            </div>
            {completedSubtodosByProject.map((task) => {
              return (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() =>
                    unCheckASubTodoMutation({ taskId: task._id })
                  }
                />
              );
            })}
          </div>
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 bg-gray-100 lg:w-1/2">
        {todoDetails.map(({ labelName, value, icon }, idx) => (
          <div
            key={`${value}-${idx}`}
            className="grid gap-2 p-4 border-b-2 w-full"
          >
            <Label className="flex items-start">{labelName}</Label>
            <div className="flex text-left items-center justify-start gap-2 pb-2">
              {icon}
              <p className="text-sm">{value}</p>
            </div>
          </div>
        ))}
        <div className="flex gap-2 p-4 w-full justify-end">
          <form onSubmit={(e) => handleDeleteTodo(e)}>
            <button type="submit">
              <Trash2 className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </DialogContent>
  );
};

export default AddTaskDialog;