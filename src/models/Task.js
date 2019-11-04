const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  finished: {
    type: Date
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
