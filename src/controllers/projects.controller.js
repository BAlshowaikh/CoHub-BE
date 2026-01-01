const { Project } = require("../models/Index.model")
const Team = require("../models/Team.model")
const User = require("../models/User.model")
const { isPM } = require("../utils/auth.js")

//create the project
const create_project = async (req, res) => {
  try {
    const user = req.user
    if (!user) return res.status(401).send({ message: "Unauthorized" })
    if (String(user.role).toLowerCase() !== "pm")
      return res.status(403).send({ message: "PM only" })

    const { name, description, deadline, status, Team_id } = req.body

    // required fields
    if (!name || !description || !Team_id) {
      return res.status(400).send({ message: "name, description and Team_id are required" })
    }

    // validate team exists
    // const Team = require("../models/Team.model")
    const team = await Team.findById(Team_id).select("_id")
    if (!team) {
      return res.status(404).send({ message: "Team not found" })
    }

    // create project (PM_id from token, do NOT trust req.body.PM_id)
    const Nproject = await Project.create({
      name,
      description,
      deadline: deadline ?? null,
      status: status ?? "pending",
      Team_id,
      PM_id: user.id,
    })

    res.status(201).send(Nproject)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Failed to create project" })
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
  try {
    const { projectId } = req.params

    // 1. Must match schema key: "Team_id"
    const project = await Project.findById(projectId).select("Team_id")
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // 2. Check the specific field from your model
    if (!project.Team_id) {
      return res.status(400).json({ message: "Project has no team assigned" })
    }

    // 3. Find the team using that ID
    const team = await Team.findById(project.Team_id).select("members")
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

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
