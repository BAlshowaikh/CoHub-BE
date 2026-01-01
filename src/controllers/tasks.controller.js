// ----- Required models ---------
const Task = require("../models/Task.model")
const {Project} = require("../models/Index.model")
const User = require("../models/User.model")
const Team = require("../models/Team.model")

// ---------- Required Utils -heplers- ---------------
const { isPM } = require("../utils/auth.js");
const { isValidStatus, canTransition } = require("../utils/task.js")

// ----------- Show all tasks for a dedicated project (When clicked on a specific project) -------------
exports.getAllTasks = async (req, res) => {
  const user = req.user
  if (!user){ 
    return res.status(401).json({ message: "Unauthorized Access" })
  }

  const { projectId } = req.query
    if (!projectId) {
    return res.status(400).json({ message: "projectId query parameter is required" })
  }

  try {
    const project = await Project.findById(projectId);
    if (!project){
        return res.status(404).json({message: "Project not found"})
    } 

    const tasks = await Task.find({ projectId }).populate("assignedTo", "username").sort({ createdAt: -1 })

    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
}


// -------- Show task details -----------
exports.getTaskDetails = async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "username")
    if (!task){
        return res.status(404).json({ message: "Task not found" })
    }

    if (!isPM(user) && String(task.assignedTo) !== String(user.id)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    res.status(200).json({data:task})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch task details" })
  }
}

// ----------- Create a task (PM only) ---------
exports.postTask = async (req, res) => {
  const user = req.user
  if (!user) return res.status(401).json({ message: "Unauthorized" })
  if (!isPM(user)) return res.status(403).json({ message: "PM only" })

  try {
    const { title, description, dueDate, assignedTo, projectId } = req.body

    // Required: projectId
    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" })
    }

    // Ensure project exists + has team assigned
    const project = await Project.findById(projectId).select("_id Team_id")
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!project.Team_id) {
      return res.status(400).json({ message: "This project has no team assigned" })
    }

    // Load the team members (only users from this team can be assigned)
    const team = await Team.findById(project.Team_id).select("_id members")
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    // Validate assignedTo if provided (optional field)
    let assignedUserId = null
    if (assignedTo !== undefined && assignedTo !== null && assignedTo !== "") {
      const targetUser = await User.findById(assignedTo).select("_id")
      if (!targetUser) {
        return res.status(404).json({ message: "Assigned user not found" })
      }

      // Validate that the assigned user is inside the project's team
      const isMember = (team.members || []).some(
        (m) => String(m) === String(assignedTo)
      )
      if (!isMember) {
        return res.status(400).json({
          message: "assignedTo must be a member of the team assigned to this project",
        })
      }

      assignedUserId = assignedTo
    }

    // Create task (force status = todo, set createdBy from token)
    const task = await Task.create({
      title,
      description,
      dueDate: dueDate ?? null,
      assignedTo: assignedUserId,
      projectId,
      createdBy: user.id,
      status: "todo",
    })

    // Populate assignedTo so FE receives username not only ID
    const populatedTask = await Task.findById(task._id).populate("assignedTo", "username")

    return res.status(201).json({ message: "Task created", data: populatedTask })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to create task" })
  }
}

// ----------- Edit a task ---------
exports.putTask = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (!isPM(user)) return res.status(403).json({ message: "PM only" });

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" })

    if (task.status !== "todo") {
      return res.status(403).json({ message: "Only TODO tasks can be edited" })
    }

    const { title, description, dueDate, assignedTo } = req.body

    // Validate assignee ONLY if it's being changed to a specific user
    if (assignedTo) {
      // Changed from teamId to Team_id
      const project = await Project.findById(task.projectId).select("_id Team_id")
      
      if (!project || !project.Team_id) {
        return res.status(400).json({ message: "This project has no team (Team_id) assigned" })
      }

      const team = await Team.findById(project.Team_id).select("_id members")
      if (!team) return res.status(404).json({ message: "Team not found" })

      // Validate member
      const isMember = (team.members || []).some(m => String(m) === String(assignedTo));
      if (!isMember) {
        return res.status(400).json({ message: "Assigned user is not in the project team" })
      }

      task.assignedTo = assignedTo;
    } else if (assignedTo === null || assignedTo === "") {
      // Allows unassigning
      task.assignedTo = null
    }

    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (dueDate !== undefined) task.dueDate = dueDate

    await task.save();
    const populatedTask = await Task.findById(task._id).populate("assignedTo", "username")

    res.status(200).json({ message: "Task updated", data: populatedTask })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to update task" })
  }
}

// ---------- Change the task status (User assigned to the task + PM) -------
exports.putTaskStatus = async (req, res) => {
  const user = req.user
  if (!user) { 
    return res.status(401).json({ message: "Unauthorized" })
  }

  const status = (req.body.status || "").toLowerCase()

  if (!isValidStatus(status)) {
    return res.status(400).json({ message: "Invalid status only 'todo', 'doing', 'done' " })
  }

  try {
    const task = await Task.findById(req.params.id)
    if (!task){
        return res.status(404).json({ message: "Task not found" })
    }

    const isAssignedUser = String(task.assignedTo) === String(user.id);
    if (!isPM(user) && !isAssignedUser) {
      return res.status(403).json({ message: "You can't update this task unless you are the PM or it's assigned to you" })
    }

    if (!canTransition(task.status, status)) {
      return res.status(400).json({
        message: `Invalid transition from ${task.status} to ${status}`,
      })
    }

    task.status = status
    await task.save()

    res.status(200).json({ message: "Status updated", data: task })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to update task status" })
  }
}

// ---------- Delete a task ----------
exports.deleteTask = async (req, res) => {
  const user = req.user
  if (!user){
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (!isPM(user)){
    return res.status(403).json({ message: "PM only can delete the task" })
  }

  try {
    const task = await Task.findById(req.params.id)
    if (!task){
        return res.status(404).json({ message: "Task not found" })
    }

    if (task.status !== "todo") {
      return res.status(409).json({ message: "Only TODO tasks can be deleted" })
    }

    await task.deleteOne()
    res.status(200).json({ message: "Task deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete task" })
  }
}

// ---------- Show project's tasks bu user  ----------
exports.getTasksByUser = async (req, res) => {
  const user = req.user
  if (!user){
    return res.status(401).json({ message: "Unauthorized" })
  }

  const requestedUserId = req.params.userId || user.id

  if (!isPM(user) && String(requestedUserId) !== String(user.id)) {
    return res.status(403).json({ message: "You can't filter by other's tasks." })
  }

  try {
    const tasks = await Task.find({ assignedTo: requestedUserId }).populate("assignedTo", "username").sort({ createdAt: -1 })

    res.status(200).json({ data: tasks })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch user tasks" })
  }
}

