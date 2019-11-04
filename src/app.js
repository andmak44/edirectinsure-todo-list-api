const express = require('express')
const cors = require('cors')
const userRouter = require('./routers/user')
const projectRouter = require('./routers/project')
const taskRouter = require('./routers/task')
const port = process.env.PORT
require('./db/db')

const app = express()

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(projectRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
