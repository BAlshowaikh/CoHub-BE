const { Project } = require("../models/Index.model")
const Team = require("../models/Team.model")
const User = require("../models/User.model")
const { isPM } = require("../utils/auth.js")

//create the project
const create_project = async (req, res) => {
  try {
    console.log(req.body)

    const Nproject = await Project.create(req.body)
    res.status(200).send(Nproject)
  } catch (error) {
    throw error
  }
}

//get all the project
const get_all_projects = async (req, res) => {
  try {
    const Nproject = await Project.find({})
    res.status(200).send(Nproject)
  } catch (error) {
    throw error
  }
}

const get_project = async (req, res) => {
  const Nproject = await Project.findById(req.params.id)
  res.status(200).send(Nproject)
}

//update the project
const update_project = async (req, res) => {
  try {
    const Nproject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.status(200).send(Nproject)
  } catch (error) {
    throw error
  }
}

//delete the project
const delete_project = async (req, res) => {
  try {
    await Project.deleteOne({ _id: req.params.id })
    console.log(Project)
    res.status(200).send({ msg: "project deleted", id: req.params.id })
  } catch (error) {
    throw error
  }
}

// Get all members in the assigned team (For FE DDL)
const getProjectAssignees = async (req, res) => {
  const user = req.user
  if (!user) return res.status(401).json({ message: "Unauthorized" })

  try {
    const { projectId } = req.params

    const project = await Project.findById(projectId).select("TeamId")
    if (!project) return res.status(404).json({ message: "Project not found" })

    if (!project.Team_id) {
      return res.status(400).json({ message: "Project has no team assigned" })
    }

    const team = await Team.findById(project.Team_id).select("members")
    if (!team) return res.status(404).json({ message: "Team not found" })

    // Return only needed fields for dropdown
    const users = await User.find({ _id: { $in: team.members } })
      .select("_id username fullname email")
      .sort({ username: 1 })

    return res.status(200).json({ data: users })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to fetch assignees" })
  }
}

module.exports = {
  create_project,
  get_all_projects,
  get_project,
  update_project,
  delete_project,
  getProjectAssignees
}
