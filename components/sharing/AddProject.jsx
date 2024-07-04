"use client";
import { Plus, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";

const AddProject = ({ onFormSubmit }) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for dialog open/close
  const [name, setName] = useState(""); // State for input value

  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemToAdd, setSelectedItemToAdd] = useState("");

  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const data = {
      projectName: name,
      selectUser: [...selectedItems, session.user.name], // Add current user's name to selected items
    };
    setIsLoading(true);
    try {
      const response = await axios.post("/api/shareLabels", data);
      console.log("Share label created:", response.data);
      router.push("/loggedin/sharing");
      setIsLoading(false);
      setIsOpen(false); // Close the dialog
    } catch (error) {
      setIsLoading(false);
    }
  };

  // Fetch users for the form
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/users");
      setUsers(res.data.filter((user) => user.email !== session?.user?.email));
      console.log("setuser", res.data);
    };

    fetchData();
  }, [session]);

  const handleSelectChange = (event) => {
    setSelectedItemToAdd(event.target.value);
  };

  const handleAddItemClick = () => {
    if (selectedItemToAdd && !selectedItems.includes(selectedItemToAdd)) {
      const selectedItemName = users.find(
        (item) => item._id === selectedItemToAdd
      )?.name;
      if (selectedItemName) {
        setSelectedItems([...selectedItems, selectedItemName]);
      }
    }
    setSelectedItemToAdd("");
  };

  const handleRemoveItemClick = (itemName) => {
    setSelectedItems(selectedItems.filter((item) => item !== itemName));
  };

  console.log("selecteditems", selectedItems);

  return (
    <div>
      <button className="pl-2 flex mt-2 flex-1" onClick={() => setIsOpen(true)}>
        <div className="flex items-center gap-2 justify-center">
          <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
          <h3 className="text-base font-light tracking-tight text-foreground/70">
            Add Project
          </h3>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
          <DialogHeader className="w-full">
            <DialogTitle>Add a Project</DialogTitle>
            <DialogDescription className="capitalize">
              <form
                onSubmit={onSubmit}
                className="space-y-2 border-2 p-6 border-gray-200 my-2 rounded-sm border-foreground/20"
              >
                <div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Project name"
                    required
                    className="border-0 font-semibold text-lg"
                    value={name} // Use value for input
                    onChange={(e) => setName(e.target.value)} // Update state on change
                  />
                </div>

                {/* for select user category  */}
                <div className=" mx-auto my-4">
                  <div className="mt-8 mx-auto max-w-screen-lg">
                    <label
                      htmlFor="example1"
                      className="mb-1 block text-lg font-medium text-gray-700 py-1"
                    >
                      Select Users
                    </label>
                    <select
                      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 p-3"
                      value={selectedItemToAdd}
                      onChange={handleSelectChange}
                    >
                      <option value="">Select User</option>
                      {users.map(
                        (item) =>
                          !selectedItems.includes(item.name) && (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          )
                      )}
                    </select>
                    {selectedItemToAdd && (
                      <button
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleAddItemClick}
                      >
                        Add
                      </button>
                    )}
                  </div>

                  <div className="mt-4 mx-auto max-w-screen-lg">
                    <h2 className="text-lg font-semibold">Selected Items:</h2>
                    <ul>
                      {selectedItems.map((itemName) => (
                        <li
                          key={itemName}
                          className="flex items-center justify-between mb-1"
                        >
                          <span>{itemName}</span>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            onClick={() => handleRemoveItemClick(itemName)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
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
    </div>
  );
};

export default AddProject;
