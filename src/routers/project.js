const express = require('express');
const Project = require('../models/Project');
const apiPath = process.env.API_PATH;
const router = express.Router();

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

module.exports = router;
