const router = require('express').Router()
const controller = require('../controllers/auth.controller.js')
const middleware = require('../middleware/auth.middleware.js')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.put(
  '/update/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.updatePassword
)
router.get(
  '/session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.checkSession
)

module.exports = router
