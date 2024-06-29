import React from "react";
import TodoFormTest from "./TodoFormTest";

const TodoList = () => {
  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Inbox</h1>
      </div>
      <div
        className="flex flex-col gap-4
       py-4"
      >
        <TodoFormTest />
        <h1>hellp</h1>
      </div>
    </div>
  );
};

export default TodoList;
