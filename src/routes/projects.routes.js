const router = require("express").Router()
const controller = require("../controllers/projects.controller")
const middleware = require("../middleware/auth.middleware")

router.get("/", controller.get_all_projects)
router.get("/:id", controller.get_project)
router.post("/", controller.create_project)
router.put("/:id", controller.update_project)
router.delete("/:id", controller.delete_project)

module.exports = router
