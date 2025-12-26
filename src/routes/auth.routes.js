const router = require('express').Router()
const controller = require('../controllers/AuthController')
const middleware = require('../middleware')

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
