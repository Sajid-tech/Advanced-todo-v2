"use client";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Calendar,
  ChevronDown,
  Flag,
  Hash,
  Plus,
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
import { motion, AnimatePresence } from "framer-motion";

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
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  useEffect(() => {
    const data = [
      {
        labelName: "Project",
        value: project?.name || "Made by Sajid Hussain",
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
      setInCompletedSubtodo(incompleteSubTodos);
      setIsAddingSubtask(false);
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
    <DialogContent className="max-w-4xl h-full md:h-4/5 flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-3/5 p-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            {taskName}
          </DialogTitle>
          <DialogDescription>
            <p className="my-2 text-sm text-gray-600">{description}</p>
            <div className="flex items-center justify-between mt-6 border-b-2 border-gray-100 pb-2">
              <div className="flex items-center gap-1">
                <ChevronDown className="w-5 h-5 text-primary" />
                <p className="font-bold text-sm text-gray-900">Sub-tasks</p>
              </div>
              <button
                onClick={() => setIsAddingSubtask(true)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add subtask
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <AnimatePresence>
                {inCompletedSubtodo?.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-between items-center"
                  >
                    <Task data={item} disableDialogTrigger={true} />
                    <button
                      onClick={() => handleDeleteSubtodo(item._id)}
                      className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isAddingSubtask && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AddTaskInline
                    parentId={_id}
                    onSubTodoSumbit={refreshSubTodos}
                  />
                </motion.div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </div>
      <div className="w-full md:w-2/5 bg-gray-50 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Task Details</h3>
        {todoDetails.map(({ labelName, value, icon }, idx) => (
          <motion.div
            key={`${value}-${idx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="mb-4 pb-2 border-b border-gray-200 last:border-b-0"
          >
            <Label className="flex items-center mb-1 text-sm font-medium text-gray-600">
              {icon}
              <span className="ml-2">{labelName}</span>
            </Label>
            <p className="text-sm pl-6 text-gray-800">{value}</p>
          </motion.div>
        ))}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleDeleteTodo}
            className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-md transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Task
          </button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AddTaskDialog;
