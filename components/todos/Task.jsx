import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Calendar, GitBranch } from "lucide-react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import clsx from "clsx";
import AddTaskDialog from "./AddTaskDialog";
import moment from "moment";
import axios from "axios";

const Task = ({ data, showDetails = false, onChecked }) => {
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
    <div
      key={data._id}
      className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in"
    >
      <Dialog>
        <div className="flex gap-2 items-center justify-end w-full">
          <div className="flex gap-2 w-full">
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
            <DialogTrigger asChild>
              <div className="flex flex-col items-start">
                <button
                  className={clsx(
                    "text-sm font-normal text-left",
                    isCompleted && "line-through text-foreground/30"
                  )}
                >
                  {taskName}
                </button>
                {showDetails && (
                  <div className="flex gap-2">
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
                  </div>
                )}
              </div>
            </DialogTrigger>
          </div>
          {<AddTaskDialog data={data} refreshTodos={onChecked} />}
        </div>
      </Dialog>
    </div>
  );
};

export default Task;
