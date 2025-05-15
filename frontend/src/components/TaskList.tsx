import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTasks, addTask } from "../api/taskApi";
import type { Task } from "../api/types";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "status">>({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        priority: "Medium",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "calendar", label: "Calendar", icon: "calendar" },
    { id: "notifications", label: "Notifications", icon: "bell" },
  ];

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  const priorityTextColors = {
    High: "text-red-500",
    Medium: "text-yellow-500",
    Low: "text-green-500",
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-blue-600 mb-10 tracking-tight"
        >
          TaskMaster
        </motion.h1>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href="#"
              className={`flex items-center p-2 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-5 h-5 mr-3">
                <i className={`fas fa-${item.icon}`}></i>
              </div>
              <span className="text-md font-medium">{item.label}</span>
            </motion.a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-8 overflow-auto">
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
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-8 text-center">
                <i className="fas fa-tasks text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-600">No tasks found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Status", "Title", "Due Date", "Priority"].map(
                        (header) => (
                          <th
                            key={header}
                            className="p-4 text-sm font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredTasks.map((task) => (
                        <motion.tr
                          key={task.id}
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
                            <div className="flex items-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md ${
                                  priorityColors[task.priority]
                                }`}
                              >
                                {task.priority}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`ml-2 p-1 rounded-full ${
                                  priorityTextColors[task.priority]
                                }`}
                              >
                                <i className="fas fa-ellipsis-h"></i>
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
      </main>

      {/* Add Task Modal */}
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
    </div>
  );
};

export default TaskList;
