const express = require('express')
const User = require('../models/User')
const apiPath = process.env.API_PATH
const router = express.Router()

router.post(apiPath + '/user/login', async(req, res) => {
  //Login a registered user
  const { email, password } = req.body
  try {
      const user = await User.findByCredentials(email, password)
      
      res.send({ currentUser: user })
  } catch (err) {
      res.status(401).json({ error: err.message })
  }
})

router.post(apiPath + '/user', async(req, res) => {
  //Crete a new user
  const {name, email, password} = req.body
  try {
    const msgExist = "User exist!"
    const user = await User.findByEmail(email)
    if (!user) {
      const user = new User({ name, email, password })
      try {
        await user.save();
        res.status(200).send({ currentUser: user })
      } catch (err) {
        console.log('err1', err)
        res.status(400).send(err)
      }
    } else {
      res.status(200).send(msgExist)
    }
  } catch (err) {
    console.log('err2', err)
    res.status(400).send(err)
  }
})

module.exports = router
