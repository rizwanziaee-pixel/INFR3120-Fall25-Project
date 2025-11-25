var express = require('express');
var router = express.Router();

const Task = require('../models/Task');
const taskController = require('../controllers/taskController');
const { requireLogin } = require('../middleware/auth');

// -------------------------
// Landing Page
// -------------------------
router.get('/', (req, res) => {
  res.render('home', { title: "TaskNest" });
});

// -------------------------
// View ALL tasks (Public Page)
// Step 7 requirement fulfilled
// -------------------------
router.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ due: 1 }); // earliest → latest
  res.render('tasks', { title: "All Tasks", tasks });
});

// -------------------------
// Add Task Page
// -------------------------
router.get('/tasks/add', requireLogin, (req, res) => {
  res.render('add', { title: "Add Task" });
});

// -------------------------
// Create Task
// -------------------------
router.post('/tasks/add', requireLogin, async (req, res) => {
  const { title, due, category } = req.body;
  await Task.create({ title, due, category });
  res.redirect('/tasks');
});

// -------------------------
// Edit Task Page (protected)
// -------------------------
router.get('/tasks/edit/:id', requireLogin, async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.render('edit', { title: "Edit Task", task });
});

// -------------------------
// Update Task (protected)
// -------------------------
router.post('/tasks/edit/:id', requireLogin, async (req, res) => {
  const { title, due, category } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { title, due, category });
  res.redirect('/tasks');
});

// -------------------------
// Delete Task (protected + POST)
// -------------------------
router.post('/tasks/delete/:id', requireLogin, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/tasks');
});

module.exports = router;


