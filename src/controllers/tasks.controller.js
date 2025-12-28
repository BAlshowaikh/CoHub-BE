// ----- Required models ---------
const Task = require("../models/Task.model")
const Project = require("../models/Project.model")
const User = require("../models/User.model")

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

    const tasks = await Task.find({projectId}).sort({ createdAt: -1 })
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
    const task = await Task.findById(req.params.id)
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

// ----------- Edit a task ---------
exports.putTask = async (req, res) => {
  const user = req.user
  if (!user) return res.status(401).json({ message: "Unauthorized" })
  if (!isPM(user)) return res.status(403).json({ message: "PM only" })

  try {
    const task = await Task.findById(req.params.id)
    if (!task){
        return res.status(404).json({ message: "Task not found" })
    }

    if (task.status !== "todo") {
      return res.status(403).json({ message: "Only TODO tasks can be edited" })
    }

    const { title, description, dueDate, assignedTo  } = req.body
    if (assignedTo !== undefined) {
      if (!assignedTo) {
        return res.status(400).json({ message: "assignedTo cannot be empty" })
      }

      const targetUser = await User.findById(assignedTo).select("_id")
      if (!targetUser) {
        return res.status(404).json({ message: "Assigned user not found" })
      }

      task.assignedTo = assignedTo
    }
    if (title !== undefined) {
        task.title = title
    }
    if (description !== undefined){
        task.description = description
    }
    if (dueDate !== undefined){ 
        task.dueDate = dueDate
    }

    await task.save();
    res.status(200).json({ message: "Task updated", data: task })
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
    const tasks = await Task.find({ assignedTo: requestedUserId }).sort({ createdAt: -1 })

    res.status(200).json({ data: tasks })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch user tasks" })
  }
}

