const mongoose = require("mongoose")
const projectSchema = require("./Project.model")

const Project = mongoose.model("Project", projectSchema)

module.exports = {
  Project,
}
