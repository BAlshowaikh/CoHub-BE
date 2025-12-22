// ----------- Dependencies and packages ---------------
const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()

// ----- DB Connection ----
const mongoose = require("./src/config/db")
const port = process.env.PORT ? process.env.PORT : 3000

// ----------- Start the BE server ----------------
app.listen(port, () => {
  console.log(`App is listening in port ${process.env.PORT}`)
})

