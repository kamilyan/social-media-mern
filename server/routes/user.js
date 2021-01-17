const express = require('express')
const userController = require('../controllers/user')
const authController = require('../controllers/auth')

const router = express.Router()

router.get('/', userController.allUsers)
router.get('/:userId', authController.requireSignin, userController.getUser)
router.put('/:userId', authController.requireSignin, userController.updateUser)
router.delete(
  '/:userId',
  authController.requireSignin,
  userController.deleteUser
)

// any route containing : userId, our app will first execute userById
router.param('userId', userController.userById)

module.exports = router