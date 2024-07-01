"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader, Plus, Tag, TagIcon, Text } from "lucide-react";
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
} from "../ui/drawer";

export default function AddTaskInline({ parentTask, onTodoSubmit }) {
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    dueDate: new Date(),
    priority: "1",
    labelId: parentTask?.labelId || "defaultLabelId",
  });
  const [labels, setLabels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchLabels = async () => {
  //     try {
  //       const response = await axios.get("/api/labels");
  //       setLabels(response.data);
  //     } catch (error) {
  //       console.error("Error fetching labels:", error);
  //     }
  //   };

  //   fetchLabels();
  // }, []);

  // Memoized function to fetch labels
  useMemo(async () => {
    try {
      const response = await axios.get("/api/labels");
      setLabels(response.data);
    } catch (error) {
      console.error("Error fetching labels:", error);
      return []; // Return empty array in case of error
    }
  }, []);

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
      await axios.post("/api/todos", taskData);

      setFormData({
        taskName: "",
        description: "",
        dueDate: new Date(),
        priority: "1",
        labelId: parentTask?.labelId || "defaultLabelId",
      });
      await onTodoSubmit();
      router.push("/loggedin");
      // Refresh the labels
      setIsLoading(false);

      setIsOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error creating task:", error);
      setIsLoading(false);
    }
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
          <form
            onSubmit={handleSubmit}
            className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
          >
            <div className="space-y-2">
              <Input
                id="taskName"
                name="taskName"
                type="text"
                placeholder="Enter your Task name"
                required
                className="border-0 font-semibold text-lg"
                value={formData.taskName}
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
            <div className=" space-y-2">
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, labelId: value })
                }
                defaultValue={formData.labelId}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <TagIcon />
                    <SelectValue>
                      {formData.labelId
                        ? labels.find((label) => label._id === formData.labelId)
                            ?.name || "Select a Label"
                        : "Select a Label"}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {labels.map((label) => (
                    <SelectItem key={label._id} value={label._id}>
                      {label?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
              <div className="w-full lg:w-1/4"></div>
              <div className="flex gap-3 self-end">
                <Button
                  className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
                  variant={"outline"}
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} className="px-6" type="submit">
                  {isLoading ? (
                    <div className="flex gap-2">
                      <Loader className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  ) : (
                    "Add Task"
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
