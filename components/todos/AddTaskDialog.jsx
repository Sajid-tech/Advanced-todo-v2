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
import React, { useEffect, useMemo, useState } from "react";
import Task from "./Task";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import { format } from "date-fns";
import AddTaskInline from "../addTask/AddTaskInline";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

//  Subtodos
const AddTaskDialog = ({ data, refreshTodos }) => {
  const { data: session } = useSession();
  const { taskName, description, projectId, labelId, priority, dueDate, _id } =
    data;

  const project = projectId;
  const label = labelId;
  const router = useRouter();

  const [todoDetails, setTodoDetails] = useState([]);
  const [completedSubtodo, setCompletedSubtodo] = useState([]);
  const [inCompletedSubtodo, setInCompletedSubtodo] = useState([]);

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
  }, [dueDate, label, priority, project]);

  useMemo(async () => {
    if (session) {
      try {
        const res = await axios.get(`/api/subtodos/${_id}`);

        const completedSubTodos = res.data.filter((todo) => todo.isCompleted);
        const incompleteSubTodos = res.data.filter((todo) => !todo.isCompleted);
        setCompletedSubtodo(completedSubTodos);
        // setTotalTodos(completedTodos.length);
        setInCompletedSubtodo(incompleteSubTodos);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    }
  }, [_id, session]);

  const refreshSubTodos = async () => {
    if (session) {
      const res = await axios.get(`/api/subtodos/${_id}`);
      const completedSubTodos = res.data.filter((todo) => todo.isCompleted);
      const incompleteSubTodos = res.data.filter((todo) => !todo.isCompleted);
      setCompletedSubtodo(completedSubTodos);
      // setTotalTodos(completedTodos.length);
      setInCompletedSubtodo(incompleteSubTodos);
    }
  };

  const handleDeleteTodo = async (e) => {
    e.preventDefault();
    if (session) {
      try {
        // Delete the todo and its subtodos
        await axios.delete(`/api/todos/${_id}?deleteSubtodos=true`);
        await refreshTodos(); // Refresh the list of todos after deletion
        router.refresh(); // Go back to the previous page or close the dialog
      } catch (error) {
        console.error("Error deleting todo and subtodos:", error);
      }
    }
  };

  const handleDeleteSubtodo = async (subtodoId) => {
    try {
      await axios.delete(`/api/subtodos/${subtodoId}`);
      await refreshSubTodos();
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

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
            {inCompletedSubtodo?.map((item) => (
              <div
                key={item._id}
                className="flex flex-row justify-between items-center"
              >
                <Task data={item} />
                <button
                  onClick={() => handleDeleteSubtodo(item._id)}
                  className="ml-2"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ))}

            <div className="pb-4">
              <AddTaskInline parentId={_id} onSubTodoSumbit={refreshSubTodos} />
            </div>
            {/* {completedSubtodo?.map((item) => (
              
            ))} */}
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
          <form onSubmit={handleDeleteTodo}>
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
