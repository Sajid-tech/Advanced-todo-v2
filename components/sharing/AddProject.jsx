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
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemToAdd, setSelectedItemToAdd] = useState("");

  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = {
      projectName: name,
      selectUser: [...selectedItems, session.user.name],
    };
    setIsLoading(true);
    try {
      const response = await axios.post("/api/shareLabels", data);
      await onFormSubmit();
      console.log("Share label created:", response.data);
      router.push("/loggedin/sharing");
      setIsLoading(false);
      setIsOpen(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

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
        <DialogContent className="max-w-lg w-full lg:w-96 flex flex-col lg:flex-row justify-between text-right p-4">
          <DialogHeader className="w-full">
            <DialogTitle className="text-lg font-semibold">
              Add a Project
            </DialogTitle>
            <DialogDescription className="mt-2">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Project name"
                    required
                    className="border-0 font-semibold text-lg w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="example1"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Select Users
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 p-2"
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
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleAddItemClick}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="text-sm font-medium">Selected Users:</h2>
                  <ul>
                    {selectedItems.map((itemName) => (
                      <li
                        key={itemName}
                        className="flex items-center justify-between mb-1"
                      >
                        <span>{itemName}</span>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          onClick={() => handleRemoveItemClick(itemName)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 mt-4 bg-primary text-white rounded-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  ) : (
                    "Add Project"
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
