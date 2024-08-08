"use client";

import { Dot } from "lucide-react";
import Task from "../todos/Task";
import moment from "moment";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";

const Today = () => {
  const { data: session } = useSession();
  const [getData, setGetData] = useState([]);
  const [overDueData, setOverDueData] = useState([]);

  useMemo(async () => {
    if (session) {
      try {
        const response = await axios.get("/api/overdueTodos");
        setOverDueData(response.data);
      } catch (error) {
        console.error("Error fetching labels:", error);
        return []; // Return empty array in case of error
      }
    }
  }, [session]);

  useMemo(async () => {
    if (session) {
      try {
        const response = await axios.get("/api/todayTodos");
        setGetData(response.data);
      } catch (error) {
        console.error("Error fetching labels:", error);
        return []; // Return empty array in case of error
      }
    }
  }, [session]);

  if (session) {
    <p>Loading...</p>;
  }

  return (
    <>
      <div className="xl:px-40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Today</h1>
        </div>
        <div className="flex flex-col gap-1 py-4">
          <p className="font-bold flex text-sm">Overdue</p>
          {overDueData?.map((item) => (
            <Task data={item} key={item._id} showDetails={true} />
          ))}
        </div>
        <div className="flex flex-col gap-1 py-4">
          <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
            {moment(new Date()).format("LL")}
            <Dot />
            Today
            <Dot />
            {moment(new Date()).format("dddd")}
          </p>
          {getData?.map((item) => (
            <Task data={item} key={item._id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default React.memo(Today);
