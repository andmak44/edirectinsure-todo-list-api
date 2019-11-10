const express = require('express');
const Project = require('../models/Project');
const apiPath = process.env.API_PATH;
const router = express.Router();
const Transaction = require('mongoose-transactions');

router.post(apiPath + '/project', async(req, res) => {
  //Create project
  const {owner, name} = req.body;
  try {
      const project = new Project({ owner, name });
      await project.save();
      res.status(200).send({ project: project });
  } catch (err) {
    res.status(400).send(err);
  }
})

router.get(apiPath + '/project/:userId', async(req, res) => {
  //Get projects
  try {
      const projects = await Project.find({'owner': req.params.userId});
      res.send({ projects: projects });
  } catch (err) {
      res.status(401).json({ error: err.message });
  }
})

router.get(apiPath + '/project/task/:userId', async(req, res) => {
  //Get projects with tasks
  try {
      const projects = await Project.find({'owner': req.params.userId}).populate('todoList', '_id name description finished', null, {sort: {'finished': -1}});
      res.send({ projects: projects });
  } catch (err) {
      res.status(401).json({ error: err.message });
  }
})

router.delete(apiPath + '/project', async(req, res) => {
  //Delete project and related tasks
  const {projectId} = req.body;
  const transaction = new Transaction();
  try {
    const todoListIds = await Project.findById(projectId, {'todoList':1});
    todoListIds.todoList.forEach(id => {
      transaction.remove('Task', id);
    });
    transaction.remove('Project', projectId);
    await transaction.run();
    res.status(200).send({ msg: `project with id ${projectId} removed and tasks: ${todoListIds.todoList}` });
  } catch (err) {
    await transaction.rollback().catch(console.error);
    res.status(400).send(err);
  }
})

module.exports = router;
