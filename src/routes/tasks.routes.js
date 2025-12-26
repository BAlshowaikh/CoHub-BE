// ---------- Imports ---------
const router = require("express").Router()
const taskCtrl = require("../controllers/tasks.controller")

// ---------- Middlewares ----------
// Currently no middlewares are implemented

// --------------- Endpoints ---------------

// ----- Task details -----
router.get("/tasks/:id", taskCtrl.getTaskDetails)

// ----- Edit task -----
router.put("/tasks/:id", taskCtrl.putTask)

// ----- Change status -----
router.put("/tasks/:id/status", taskCtrl.putTaskStatus)

// ----- Delete -----
router.delete("/tasks/:id", taskCtrl.deleteTask)

// ----- Tasks by user (for filter) -----
router.get("/tasks/user/:userId", taskCtrl.getTasksByUser)

module.exports = router