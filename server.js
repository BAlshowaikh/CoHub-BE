// ----------- Dependencies and packages ---------------
const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()


const logger = require('morgan')
const cors = require('cors')

const AuthRouter = require('./src/routes/auth.routes')
const TeamRouter = require('./src/routes/teams.routes')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', AuthRouter)
app.use('/teams', TeamRouter)


// ----- DB Connection ----
const mongoose = require("./src/config/db")
const port = process.env.PORT ? process.env.PORT : 3000

// ----------- Start the BE server ----------------
app.listen(port, () => {
  console.log(`App is listening in port ${process.env.PORT}`)
})

