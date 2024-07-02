"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Task from "../todos/Task";
import { useParams } from "next/navigation";

const AddFilterLabel = () => {
  const { labelId } = useParams(); // Get labelId from URL params
  const todolabelId = labelId;
  console.log("tjsakkskd", todolabelId);
  console.log("labelid", labelId);
  const [label, setLabel] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabelAndTodos = async () => {
      try {
        // Fetch label
        const labelResponse = await axios.get(`/api/labels/${labelId}`);
        setLabel(labelResponse.data);
        // Fetch todos for the specific labelId
        const todosResponse = await axios.get(`/api/todos?labelId=${labelId}`);
        setTodos(todosResponse.data);
      } catch (error) {
        console.error("Error fetching label or todos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabelAndTodos();
  }, [labelId]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!label) {
    return <p>Label not found</p>;
  }

  return (
    <>
      <div className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in">
        <p> {label?.name}</p>
      </div>
      <div>
        {todos.length > 0 ? (
          todos.map((item) => <Task key={item._id} data={item} />)
        ) : (
          <p>No todos found for this label</p>
        )}
      </div>
    </>
  );
};

export default AddFilterLabel;
