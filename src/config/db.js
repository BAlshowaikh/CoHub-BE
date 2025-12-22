// ------ Load the db connection url from the env file and try to connect to the db

const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB with database name ${mongoose.connection.name}`)
})

module.exports = mongoose