"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Task from "./Task";
import CompletedTodos from "./CompletedTodos";
import AddTaskInline from "../addTask/AddTaskInline";

const TodoList = () => {
  const { data: session } = useSession();
  const [getTodo, setGetTodo] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [inCompleted, setInCompleted] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);

  useMemo(async () => {
    if (session) {
      try {
        const res = await axios.get("/api/todos");
        setGetTodo(res.data);
        setTotalTodos(res.data.length);

        const completedTodos = res.data.filter((todo) => todo.isCompleted);
        const incompleteTodos = res.data.filter((todo) => !todo.isCompleted);
        setCompleted(completedTodos);
        setInCompleted(incompleteTodos);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    }
  }, [session]);

  // useMemo(async () => {
  //
  //     const response = await axios.get("/api/labels");
  //     setLabels(response.data);
  //
  // }, []);

  const refreshTodos = async () => {
    if (session) {
      const res = await axios.get("/api/todos");
      setGetTodo(res.data);
      setTotalTodos(res.data.length);

      const completedTodos = res.data.filter((todo) => todo.isCompleted);
      const incompleteTodos = res.data.filter((todo) => !todo.isCompleted);
      setCompleted(completedTodos);
      setInCompleted(incompleteTodos);
    }
  };

  if (!session) return null;

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Inbox</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        {/* Incomplete task */}
        {inCompleted.map((item) => (
          <Task data={item} key={item._id} />
        ))}
      </div>
      <AddTaskInline onTodoSubmit={refreshTodos} />
      <div className="flex flex-col gap-1 py-4">
        {/* Completed task  */}
        {completed.map((item) => (
          <Task data={item} key={item._id} />
        ))}
      </div>
      <CompletedTodos totalTodos={totalTodos} />
    </div>
  );
};

export default TodoList;
