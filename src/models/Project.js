const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  todoList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
