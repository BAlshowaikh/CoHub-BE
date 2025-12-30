const router = require("express").Router()
const controller = require("../controllers/projects.controller")
const middleware = require("../middleware/auth.middleware")
const { isPM } = require("../utils/auth.js")

router.get("/", controller.get_all_projects)
router.get("/:id", controller.get_project)
router.get("/:id/assignees", controller.getProjectAssignees)
router.post("/", isPM, controller.create_project)
router.put("/:id",isPM, controller.update_project)
router.delete("/:id", isPM, controller.delete_project)

module.exports = router
