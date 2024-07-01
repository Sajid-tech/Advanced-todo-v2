"use client";
import React, { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useSession } from "next-auth/react";
import axios from "axios";
import Task from "./Task";
import { CirclePlus } from "lucide-react";
import CompletedTodos from "./CompletedTodos";

import AddTaskButton, { AddTaskWrapper } from "../addTask/AddTaskButton";

const TodoList = () => {
  const { data: session } = useSession();
  const [getTodo, setGetTodo] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [inCompleted, setInCompleted] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const res = await axios.get("/api/todos");
        setGetTodo(res.data);
      };
      fetchData();
    }
  }, [session]);

  if (session) {
    return (
      <div className="xl:px-40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Inbox</h1>
        </div>
        <div className="flex flex-col gap-1 py-4">
          {/* Incomplete task */}

          {getTodo.map((item) => (
            <Task data={item} key={item._id} />
          ))}
        </div>
        {/* Add task button */}
        <AddTaskWrapper />
        {/* Pass props */}
        <div className="flex flex-col gap-1 py-4">
          {/* Completed task  */}
          {getTodo.map((item) => (
            <Task data={item} key={item._id} />
          ))}
        </div>
        <CompletedTodos totalTodos={totalTodos} />
      </div>
    );
  }
};

export default TodoList;
