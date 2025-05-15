"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.addTask = exports.getTasks = void 0;
let tasks = [];
const getTasks = (req, res) => {
    res.json(tasks);
};
exports.getTasks = getTasks;
const addTask = (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
};
exports.addTask = addTask;
const updateTask = (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;
    tasks = tasks.map((task) => (task.id === id ? updatedTask : task));
    res.json(updatedTask);
};
exports.updateTask = updateTask;
const deleteTask = (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter((task) => task.id !== id);
    res.status(204).send();
};
exports.deleteTask = deleteTask;
