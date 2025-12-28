const User = require('../models/User.model')
const Team = require('../models/Team.model')

exports.team_index_get = async (req, res) => {
  const teams = await Team.find().populate("members", "fullname")
  res.status(200).send(teams)
}

exports.team_create_get = async (req, res) => {
  const users = await User.find()
  res.status(200).send(users)
}

exports.team_create_post = async (req, res) => {
  const team = await Team.create(req.body)
  res.status(200).send(team)
}

exports.team_show_get = async (req, res) => {
  const team = await Team.findById(req.params.teamId).populate(
    "members",
    "fullname email user_role department"
  )
  res.status(200).send(team)
}

exports.team_edit_get = async (req, res) => {
  const team = await Team.findById(req.params.teamId).populate(
    "members",
    "fullname email user_role department"
  )
  const users = await User.find()
  res.status(200).send({ team, users })
}

exports.team_update_put = async (req, res) => {
  try {
    if (res.locals.payload.user_role !== "Manager") {
      return res.status(400).send("You dont have permission to do that.")
    }

    const updateTeam = await Team.findByIdAndUpdate(
      req.params.teamId,
      req.body,
      { new: true }
    )

    res.status(200).send(updateTeam)
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: "Error", msg: "  logging in error!" })
  }
}

exports.team_delete_delete = async (req, res) => {
  const team = await Team.findById(req.params.teamId)
if (res.locals.payload.user_role !== "Manager") {
    return res.status(400).send("You dont have permission to do that.")
  }
  await team.deleteOne()
  res.status(200).send(team)
}
;
