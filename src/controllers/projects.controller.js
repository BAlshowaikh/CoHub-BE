const { Project } = require("../models/Index.model")

//create the project
const create_project = async (req, res) => {
  try {
    const Nproject = await Project.create(req.body)
    res.status(200).send(Nproject)
  } catch (error) {
    throw error
  }
}

//get the project
const get_project = async (req, res) => {
  try {
    const Nproject = await Project.find({})
    res.status(200).send(Nproject)
  } catch (error) {
    throw error
  }
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
    res.status(200).send({ msg: "project deleted", id: req.params.id })
  } catch (error) {
    throw error
  }
}

module.exports = {
  create_project,
  get_project,
  update_project,
  delete_project,
}
