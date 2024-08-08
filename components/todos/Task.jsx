"use client";

import React from "react";
import { motion } from "framer-motion";
import { Checkbox } from "../ui/checkbox";
import { Calendar, GitBranch } from "lucide-react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import clsx from "clsx";
import AddTaskDialog from "./AddTaskDialog";
import moment from "moment";
import axios from "axios";

// sajid hussain

const Task = ({
  data,
  showDetails = false,
  onChecked,
  disableDialogTrigger = false,
}) => {
  const { _id, taskName, dueDate, isCompleted } = data;

  const handleOnChange = async (checked) => {
    try {
      if (checked) {
        await axios.post(`api/todos/${_id}/check`);
        onChecked();
      } else {
        await axios.post(`api/todos/${_id}/uncheck`);
        onChecked();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <motion.div
      key={data._id}
      className="flex items-center space-x-2 border-b-2 p-2 border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Dialog>
        <div className="flex gap-2 items-center justify-end w-full">
          <div className="flex gap-2 w-full">
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Checkbox
                id="todo"
                className={clsx(
                  "w-5 h-5 rounded-xl",
                  isCompleted &&
                    "data-[state=checked]:bg-gray-300 border-gray-300"
                )}
                checked={isCompleted}
                onCheckedChange={handleOnChange}
              />
            </motion.div>
            {!disableDialogTrigger ? (
              <DialogTrigger asChild>
                <motion.div
                  className="flex flex-col items-start"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <button
                    className={clsx(
                      "text-sm font-normal text-left",
                      isCompleted && "line-through text-foreground/30"
                    )}
                  >
                    {taskName}
                  </button>
                  {showDetails && (
                    <motion.div
                      className="flex gap-2"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.2 }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <GitBranch className="w-3 h-3 text-foreground/70" />
                        <p className="text-xs text-foreground/70"></p>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3 text-primary" />
                        <p className="text-xs text-primary">
                          {moment(dueDate).format("LL")}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </DialogTrigger>
            ) : (
              <motion.div
                className="flex flex-col items-start"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <button
                  className={clsx(
                    "text-sm font-normal text-left",
                    isCompleted && "line-through text-foreground/30"
                  )}
                >
                  {taskName}
                </button>
                {showDetails && (
                  <motion.div
                    className="flex gap-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <GitBranch className="w-3 h-3 text-foreground/70" />
                      <p className="text-xs text-foreground/70"></p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      <p className="text-xs text-primary">
                        {moment(dueDate).format("LL")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
          {!disableDialogTrigger && (
            <AddTaskDialog data={data} refreshTodos={onChecked} />
          )}
        </div>
      </Dialog>
    </motion.div>
  );
};

export default React.memo(Task);
