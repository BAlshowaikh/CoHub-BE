// ---------- Imports ---------
const router = require("express").Router()
const taskCtrl = require("../controllers/tasks.controller")

// ---------- Middlewares ----------
// Currently no middlewares are implemented

// --------------- Endpoints ---------------

// ----- Task details -----
router.get("/tasks/:id", taskController.getTaskDetails)

// ----- Edit task -----
router.put("/tasks/:id", taskController.putTask)

// ----- Change status -----
router.put("/tasks/:id/status", taskController.putTaskStatus)

// ----- Delete -----
router.delete("/tasks/:id", taskController.deleteTask)

// ----- Tasks by user (for filter) -----
router.get("/tasks/user/:userId", taskController.getTasksByUser)

module.exports = router