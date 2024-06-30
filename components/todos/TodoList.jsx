"use client";
import React, { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useSession } from "next-auth/react";
import axios from "axios";
import TodoFormTest from "./TodoFormTest";
import Task from "./Task";
import { CirclePlus } from "lucide-react";
import CompletedTodos from "./CompletedTodos";

const TodoList = () => {
  const { data: session } = useSession();
  const [getTodo, setGetTodo] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [inCompleted, setInCompleted] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);
  const [showTodoForm, setShowTodoForm] = useState(false);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const res = await axios.get("/api/todos");
        setGetTodo(res.data);
      };
      fetchData();
    }
  }, [session]);

  const handleCirclePlusClick = () => {
    setShowTodoForm(true); // Show the TodoFormTest drawer
  };

  const refreshTodos = async () => {
    if (session) {
      const res = await axios.get("/api/todos");
      setGetTodo(res.data);
    }
  };

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
        <CirclePlus onClick={handleCirclePlusClick} />{" "}
        {/* Attach the click handler */}
        <TodoFormTest
          show={showTodoForm}
          onClose={() => setShowTodoForm(false)}
          onFormSubmit={refreshTodos}
        />{" "}
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
