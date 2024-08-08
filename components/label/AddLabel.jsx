"use client";
import { CirclePlus, CirclePlusIcon, Loader, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AddLabel = ({ onFormSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for dialog open/close
  const [name, setName] = useState(""); // State for input value
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    if (name) {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/labels", { name });
        console.log("Todo created:", response.data);
        router.push("/loggedin/label");
        await onFormSubmit(); // Refresh the labels
        setIsLoading(false);

        setIsOpen(false); // Close the dialog
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <button className="pl-2 flex mt-2 flex-1" onClick={() => setIsOpen(true)}>
        <div className="flex items-center gap-2 justify-center">
          <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
          <h3 className="text-base font-light tracking-tight text-foreground/70">
            Add Label
          </h3>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
          <DialogHeader className="w-full">
            <DialogTitle>Add a Label</DialogTitle>
            <DialogDescription className="capitalize">
              <form
                onSubmit={onSubmit}
                className="space-y-2 border-2 p-6 border-gray-200 my-2 rounded-sm border-foreground/20"
              >
                <div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Label name"
                    required
                    className="border-0 font-semibold text-lg"
                    value={name} // Use value for input
                    onChange={(e) => setName(e.target.value)} // Update state on change
                  />
                </div>
                <Button disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex gap-2">
                      <Loader className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  ) : (
                    "Add"
                  )}
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Delete button */}
    </div>
  );
};

export default React.memo(AddLabel);
