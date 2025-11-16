var express = require('express');
var router = express.Router();
const Task = require('../models/Task');

// Landing Page
router.get('/', (req, res) => {
  res.render('home', { title: "TaskNest" });
});

// View all tasks
router.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.render('tasks', { title: "All Tasks", tasks });
});

// Add Task Page
router.get('/tasks/add', (req, res) => {
  res.render('add', { title: "Add Task" });
});

// Create Task
router.post('/tasks/add', async (req, res) => {
  const { title, due, category } = req.body;
  await Task.create({ title, due, category });
  res.redirect('/tasks');
});

// Edit Task Page
router.get('/tasks/edit/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.render('edit', { title: "Edit Task", task });
});

// Update Task
router.post('/tasks/edit/:id', async (req, res) => {
  const { title, due, category } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { title, due, category });
  res.redirect('/tasks');
});

// Delete Task
router.get('/tasks/delete/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/tasks');
});

module.exports = router;

