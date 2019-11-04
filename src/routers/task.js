const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const apiPath = process.env.API_PATH;
const router = express.Router();
const Transaction = require('mongoose-transactions');

router.post(apiPath + '/task/:projectId', async(req, res) => {
  //Create task
  const {name, description} = req.body;
  const task = new Task({ name, description });  
  const transaction = new Transaction();
  try {
      const todoId = transaction.insert('Task', task);
      transaction.update('Project', req.params.projectId, {$push: {todoList: todoId}}, {new: true, useFindAndModify: false});
      await transaction.run();
      res.status(200).send({ todo: task });
  } catch (err) {
    await transaction.rollback().catch(console.error);
    res.status(400).send(err);
  }
})

router.get(apiPath + '/tasks/:projectId', async(req, res) => {
  //Get tasks by project id
  try {
      const tasks = await Project.findById(req.params.projectId).populate('todoList');
      res.send({ tasks: tasks });
  } catch (err) {
      res.status(401).json({ error: err.message });
  }
})

router.post(apiPath + '/task/update/:taskId', async(req, res) => {
  //Update task
  const id = req.params.taskId;
  const {name, description} = req.body;

  const transaction = new Transaction();
  try {
      transaction.update('Task', req.params.taskId, {$set: {name: name, description: description}}, {new: true, useFindAndModify: false});
      await transaction.run();
      res.status(200).send({ msg: 'task updated' });
  } catch (err) {
    await transaction.rollback().catch(console.error);
    res.status(400).send(err);
  }
})

router.post(apiPath + '/task/done/:taskId', async(req, res) => {
  //Done task
  const id = req.params.taskId;
  const {finished} = req.body;
console.log('finished');

  const transaction = new Transaction();
  try {
      transaction.update('Task', req.params.taskId, {$set: {finished: finished}}, {new: true, useFindAndModify: false});
      await transaction.run();
      res.status(200).send({ msg: 'task finished' });
  } catch (err) {
    await transaction.rollback().catch(console.error);
    res.status(400).send(err);
  }
})

router.delete(apiPath + '/task', async(req, res) => {
  //Delete task
  const {id, projectId} = req.body;
  const transaction = new Transaction();
  try {
    const task = transaction.remove('Task', id);
    transaction.update('Project', projectId, {$pull: {todoList: id}}, {new: true, useFindAndModify: false});
    await transaction.run();
    res.status(200).send({ todo: task });
  } catch (err) {
    await transaction.rollback().catch(console.error);
    res.status(400).send(err);
  }
})

module.exports = router;
