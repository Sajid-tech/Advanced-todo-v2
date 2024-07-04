import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Clock,
  Mail,
  CheckSquare,
  MessageSquare,
  FileText,
} from "lucide-react";

const ShareTaskDisplay = ({ task }) => {
  console.log("task value", task); // Ensure this logs an array of tasks

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto p-4 space-y-6"
    >
      {task.map((item) => (
        <motion.div
          key={item._id}
          variants={itemVariants}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <div className="p-6 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {item.taskTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="font-medium">Priority: {item.priority}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <CheckSquare className="w-5 h-5 text-green-500" />
                <span className="font-medium">
                  Status: {item.isCompleted ? "Completed" : "Pending"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                <FileText className="w-5 h-5 mr-2 text-green-500" />
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.comments && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                  Comments
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.comments}</p>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500">
              Parent Share ID: {item.parentShareId}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ShareTaskDisplay;
