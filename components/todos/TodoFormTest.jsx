"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";

const TodoFormTest = ({ show, onClose, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    priority: "",
    dueDate: "",
    projectId: "",
    labelId: "",
    embedding: "",
  });

  useEffect(() => {
    if (!show) {
      setFormData({
        taskName: "",
        description: "",
        priority: "",
        dueDate: "",
        projectId: "",
        labelId: "",
        embedding: "",
      });
    }
  }, [show]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithTimestamp = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.getTime() : "", // Convert to Unix timestamp
      };
      const response = await axios.post("/api/todos", formDataWithTimestamp);
      console.log("Todo created:", response.data);
      onFormSubmit(); // Refresh the TodoList
      onClose(); // Close the drawer
    } catch (error) {
      console.error("Error creating todo:", error);
      // Handle specific error codes
      if (error.response?.status === 401) {
        // Redirect to login page or handle authentication error
        console.log("Unauthorized access. Redirect to login page.");
      } else {
        // Handle other errors
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <Drawer open={show} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a new Todo</DrawerTitle>
          <DrawerDescription>
            <form>
              <div>
                <label>Task Name</label>
                <input
                  type="text"
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Priority</label>
                <input
                  type="text"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Project ID</label>
                <input
                  type="text"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Label ID</label>
                <input
                  type="text"
                  name="labelId"
                  value={formData.labelId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Embedding</label>
                <input
                  type="text"
                  name="embedding"
                  value={formData.embedding}
                  onChange={handleChange}
                />
              </div>
            </form>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
          <DrawerClose>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TodoFormTest;
