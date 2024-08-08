"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader, Plus, Text } from "lucide-react";
import { format } from "date-fns";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CardFooter } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { motion } from "framer-motion";

const AddShareProject = ({ parentShareId, users, onShareTaskAdded }) => {
  const [formData, setFormData] = useState({
    taskTitle: "",
    description: "",
    dueDate: new Date(),
    priority: "1",
    labels: [],
    comments: "",
    parentShareId,
    recipients: Array.isArray(users) ? users : [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (users) {
      setFormData((prev) => ({
        ...prev,
        recipients: users,
      }));
    }
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dueDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      dueDate: moment(formData.dueDate).valueOf(),
    };
    setIsLoading(true);
    try {
      const response = await axios.post("/api/shareProjects", taskData);
      console.log("Server response:", response.data);
      await onShareTaskAdded(); // Call the function to refresh the task list
      setFormData({
        taskTitle: "",
        description: "",
        dueDate: new Date(),
        priority: "1",
        labels: [],
        comments: "",
      });
      setIsOpen(false); // Close the drawer after successful submission
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating shared task:", error);
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <button className="pl-2 flex mt-2 flex-1" onClick={() => setIsOpen(true)}>
        <div className="flex items-center gap-2 justify-center">
          <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
          <h3 className="text-base font-light tracking-tight text-foreground/70">
            Add Task
          </h3>
        </div>
      </button>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add New Task</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-2">
              <Input
                id="taskTitle"
                name="taskTitle"
                type="text"
                placeholder="Enter your Task title"
                required
                className="border-0 font-semibold text-lg"
                value={formData.taskTitle}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Text className="ml-auto h-4 w-4 opacity-50" />
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  className="resize-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-between">
              <div className="flex flex-col w-1/2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="flex gap-2  pl-3 text-left font-normal"
                    >
                      {formData.dueDate ? (
                        format(formData.dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col w-1/2">
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                  defaultValue={formData.priority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((item) => (
                      <SelectItem key={item} value={item.toString()}>
                        Priority {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                id="labels"
                name="labels"
                type="text"
                placeholder="Enter labels"
                value={formData.labels.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    labels: e.target.value
                      .split(",")
                      .map((label) => label.trim()),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Textarea
                id="comments"
                name="comments"
                placeholder="Comments"
                value={formData.comments}
                onChange={handleChange}
              />
            </div>

            <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
              <div className="w-full lg:w-1/4"></div>
              <div className="flex gap-3 self-end">
                <motion.button
                  className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
                  variant={"outline"}
                  onClick={() => setIsOpen(false)}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  disabled={isLoading}
                  className="px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <div className="flex gap-2">
                      <Loader className="h-5 w-5 text-primary-foreground animate-spin" />
                    </div>
                  ) : (
                    "Add Task"
                  )}
                </motion.button>
              </div>
            </CardFooter>
          </motion.form>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default React.memo(AddShareProject);
