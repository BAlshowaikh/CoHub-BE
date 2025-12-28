// ---------- Imports ---------
const router = require("express").Router()
const taskCtrl = require("../controllers/tasks.controller")

// ---------- Middlewares ----------
const { stripToken, verifyToken } = require('../middleware/auth.middleware')

//----- All routes below this line will require a valid JWT ------
router.use(stripToken, verifyToken)

// --------------- Endpoints ---------------

// ----- Task details -----
router.get("/:id", taskCtrl.getTaskDetails)

// ----- Edit task -----
router.put("/:id", taskCtrl.putTask)

// ----- Change status -----
router.put("/:id/status", taskCtrl.putTaskStatus)

// ----- Delete -----
router.delete("/:id", taskCtrl.deleteTask)

// ----- Tasks by user (for filter) -----
router.get("/user/:userId", taskCtrl.getTasksByUser)

module.exports = router