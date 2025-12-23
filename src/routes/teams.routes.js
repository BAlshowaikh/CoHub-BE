const router = require("express").Router()

const teamCtrl = require("../controllers/teams.controller")

router.get("/",teamCtrl.team_index_get);
router.post("/",teamCtrl.team_create_post);
router.get("/new",teamCtrl.team_create_get);
router.get("/:teamId",teamCtrl.team_show_get);
router.get("/:teamId/edit",teamCtrl.team_edit_get);
router.put("/:teamId",teamCtrl.team_update_put);
router.delete("/:teamId",teamCtrl.team_delete_delete);

module.exports = router
