"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Text } from "lucide-react";

import { format } from "date-fns";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CardFooter } from "../ui/card";
import { cn } from "@/lib/utils";

//  Used to create task
export default function AddTaskInline({
  setShowAddTask,
  parentTask,
  projectId: myProjectId,
}) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("1");
  const [projectId, setProjectId] = useState(
    myProjectId || parentTask?.projectId || "defaultProjectId"
  );
  const [labelId, setLabelId] = useState(
    parentTask?.labelId || "defaultLabelId"
  );
  const [projects, setProjects] = useState([]);
  const [labels, setLabels] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    //To fetch label
    const fetchLabels = async () => {
      try {
        const response = await axios.get("/api/labels");
        setLabels(response.data);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    fetchProjects();
    fetchLabels();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    if (taskName.length < 2) {
      toast({
        title: "Task name must be at least 2 characters.",
        duration: 3000,
      });
      return;
    }
    if (!projectId) {
      toast({ title: "Please select a Project.", duration: 3000 });
      return;
    }
    if (!labelId) {
      toast({ title: "Please select a Label.", duration: 3000 });
      return;
    }

    const taskData = {
      taskName,
      description,
      priority: parseInt(priority),
      dueDate: moment(dueDate).valueOf(),
      projectId,
      labelId,
    };

    try {
      let response;
      if (parentTask?._id) {
        response = await axios.post("/api/subtodo", {
          ...taskData,
          parentId: parentTask._id,
        });
      } else {
        response = await axios.post("/api/todos", taskData);
      }

      if (response.status === 200) {
        toast({ title: "🦄 Created a task!", duration: 3000 });
        setTaskName("");
        setDescription("");
        setPriority("1");
        setDueDate(new Date());
        setShowAddTask(false);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
      >
        <div className="space-y-2">
          <Input
            id="taskName"
            type="text"
            placeholder="Enter your Task name"
            required
            className="border-0 font-semibold text-lg"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Text className="ml-auto h-4 w-4 opacity-50" />
            <Textarea
              id="description"
              placeholder="Description"
              className="resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "flex gap-2 w-[240px] pl-3 text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <Select onValueChange={setPriority} defaultValue={priority}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Priority" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((item, idx) => (
                  <SelectItem key={idx} value={item.toString()}>
                    Priority {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <Select onValueChange={setLabelId} defaultValue={labelId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Label" />
              </SelectTrigger>
              <SelectContent>
                {labels.map((label, idx) => (
                  <SelectItem key={idx} value={label._id}>
                    {label?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col">
          <Select onValueChange={setProjectId} defaultValue={projectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project, idx) => (
                <SelectItem key={idx} value={project._id}>
                  {project?.name}
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
              onClick={() => setShowAddTask(false)}
            >
              Cancel
            </Button>
            <Button className="px-6" type="submit">
              Add task
            </Button>
          </div>
        </CardFooter>
      </form>
    </div>
  );
}
