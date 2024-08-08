import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckSquare,
  MessageSquare,
  FileText,
  ChevronDown,
  Trash2,
} from "lucide-react";

const ShareTaskDisplay = ({ task, onDeleteTask }) => {
  const [expandedTask, setExpandedTask] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const toggleExpand = (id) => {
    setExpandedTask(expandedTask === id ? null : id);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto p-2 space-y-2"
    >
      {task.map((item) => (
        <motion.div
          key={item._id}
          variants={itemVariants}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md"
        >
          <div
            className="p-3 cursor-pointer flex justify-between items-center"
            onClick={() => toggleExpand(item._id)}
          >
            <h2 className="text-lg font-medium text-gray-800 truncate">
              {item.taskTitle}
            </h2>
            <div className="flex items-center">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(item._id);
                }}
                className="mr-2 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </motion.button>
              <motion.div
                animate={{ rotate: expandedTask === item._id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {expandedTask === item._id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-3 pb-3 space-y-2">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <motion.div
                      className="flex items-center"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Clock className="w-3 h-3 mr-1 text-green-500" />
                      <span>Priority: {item.priority}</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CheckSquare className="w-3 h-3 mr-1 text-green-500" />
                      <span>
                        Status: {item.isCompleted ? "Completed" : "Pending"}
                      </span>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-sm font-medium text-gray-800 flex items-center mb-1">
                      <FileText className="w-3 h-3 mr-1 text-green-500" />
                      Description
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>

                  {item.comments && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-sm font-medium text-gray-800 flex items-center mb-1">
                        <MessageSquare className="w-3 h-3 mr-1 text-green-500" />
                        Comments
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.comments}
                      </p>
                    </motion.div>
                  )}

                  <motion.div
                    className="text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Parent Share ID: {item.parentShareId}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default React.memo(ShareTaskDisplay);
