// ----------- Dependencies and packages ---------------
const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("./src/config/db")
const express = require("express")
const app = express()
const logger = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// --------------- Required Routes ------------------
const projectRoute = require("./src/routes/projects.routes")
const taskRoute = require("./src/routes/tasks.routes")
const AuthRouter = require('./src/routes/auth.routes')
const TeamRouter = require('./src/routes/teams.routes')

// --------------- Use the routes ---------------
app.use("/task", taskRoute)
app.use("/project", projectRoute)
app.use('/auth', AuthRouter)
app.use('/teams', TeamRouter)


// ----- DB Connection ----
const port = process.env.PORT ? process.env.PORT : 3000

// ----------- Start the BE server ----------------
app.listen(port, () => {
  console.log(`App is listening in port ${port}`)
})

