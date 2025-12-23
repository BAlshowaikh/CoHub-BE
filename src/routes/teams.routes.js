const router = require("express").Router()

const teamCtrl = require("../controllers/teams.controller")
const middleware = require('../middleware')

router.get("/",
  middleware.stripToken,
  middleware.verifyToken,
  teamCtrl.team_index_get);
router.post("/",
  middleware.stripToken,
  middleware.verifyToken,
  teamCtrl.team_create_post);
router.get("/new",
    middleware.stripToken,
  middleware.verifyToken,
  teamCtrl.team_create_get);
router.get("/:teamId",
  middleware.stripToken,
  middleware.verifyToken,
  teamCtrl.team_show_get);
router.get("/:teamId/edit",
    middleware.stripToken,
  middleware.verifyToken,
  teamCtrl.team_edit_get);
router.put("/:teamId",
    middleware.stripToken,
  middleware.verifyToken,
  teamCtrl.team_update_put);
router.delete("/:teamId",
    middleware.stripToken,
  middleware.verifyToken,
  teamCtrl.team_delete_delete);

module.exports = router
