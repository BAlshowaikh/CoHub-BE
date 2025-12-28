// ----------- Dependencies and packages ---------------
const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const ProjectRouter = require("./src/routes/projects.routes")
app.use("/project", ProjectRouter)

// ----- DB Connection ----
const mongoose = require("./src/config/db")
const port = process.env.PORT ? process.env.PORT : 3000

app.use("/", (req, res) => {
  res.send("connected")
})

// ----------- Start the BE server ----------------
app.listen(port, () => {
  console.log(`App is listening in port ${process.env.PORT}`)
})
