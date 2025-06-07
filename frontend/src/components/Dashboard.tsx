import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTasks, addTask, deleteTask, updateTask } from "../api/taskApi";
import type { Task } from "../api/types";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newTask, setNewTask] = useState<
    Omit<
      Task,
      "id" | "status" | "dueDateTime" | "notificationTime" | "createdAt"
    >
  >({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "12:00",
    priority: "Medium",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        // Ensure each task has a unique ID
        const tasksWithIds = tasksData.map((task, index) => ({
          ...task,
          id: task.id || `temp-${index}-${Date.now()}`, // Add unique temp ID if missing
        }));
        setTasks(tasksWithIds);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      (task.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  const handleAddTask = async () => {
    try {
      const addedTask = await addTask(newTask);
      setTasks([...tasks, addedTask]);
      setIsAddTaskModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "12:00",
        priority: "Medium",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTaskToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete);
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      setIsDeleteConfirmOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusChange = async (task: Task) => {
    try {
      const updatedTask = await updateTask(task.id, { status: !task.status });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  // const priorityTextColors = {
  //   High: "text-red-500",
  //   Medium: "text-yellow-500",
  //   Low: "text-green-500",
  // };

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold text-gray-800"
        >
          Dashboard
        </motion.h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
          >
            <i className="fas fa-user text-white"></i>
          </motion.div>
        </div>
      </header>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddTaskModalOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all mb-8 flex items-center"
      >
        <i className="fas fa-plus mr-2"></i>
        Add Task
      </motion.button>

      <section>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-semibold text-gray-700 mb-6"
        >
          Task List
        </motion.h3>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center">
              <i className="fas fa-tasks text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-600">No tasks found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      "Status",
                      "Title",
                      "Due Date",
                      "Due Time",
                      "Priority",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="p-4 text-sm font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredTasks.map((task) => (
                      <motion.tr
                        key={task.id} // Using the unique ID as key
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={task.status}
                              onChange={() => handleStatusChange(task)} // Added onChange handler
                              className="form-checkbox text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-gray-600">
                              {task.status ? "Completed" : "Pending"}
                            </span>
                          </label>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-800">
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.description}
                          </div>
                        </td>
                        <td className="p-4">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              new Date(task.dueDate) < new Date()
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-gray-500">
                            {task.dueTime}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md ${
                                priorityColors[task.priority]
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-red-500 hover:text-red-700 transition"
                              onClick={() => handleDeleteTask(task.id)}
                              title="Delete task"
                            >
                              <i className="fas fa-trash"></i>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Add New Task</h3>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Enter task description"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Time
                </label>
                <input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value as "High" | "Medium" | "Low",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Task
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl"
          >
            <div className="flex flex-col items-center text-center">
              <i className="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex justify-center space-x-4 w-full">
                <button
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setTaskToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTask}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
