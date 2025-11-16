const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  due: { type: String, required: true },
  category: { type: String, required: true }
});

module.exports = mongoose.model("Task", TaskSchema);
