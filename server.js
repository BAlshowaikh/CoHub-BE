// ----------- Dependencies and packages ---------------
const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()

// --------------- Required Routes ------------------
const taskRoute = require("./src/routes/tasks.routes")
const projectRoute = require("./src/routes/projects.routes")

// --------------- Use the routes ---------------
app.use("/task", taskRoute)
app.use("/project", projectRoute)

// ----- DB Connection ----
const mongoose = require("./src/config/db")
const port = process.env.PORT ? process.env.PORT : 3000

// ----------- Start the BE server ----------------
app.listen(port, () => {
  console.log(`App is listening in port ${process.env.PORT}`)
})

