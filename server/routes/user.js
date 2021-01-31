const express = require('express')
const userController = require('../controllers/user')
const authController = require('../controllers/auth')

const router = express.Router()

router.get('/', userController.allUsers)

router.get('/:userId/photo', userController.getUserPhoto)
router.put(
  '/:followId/follow',
  authController.requireSignin,
  userController.addFollowing,
  userController.addFollower
)

router.put(
  '/:unfollowId/unfollow',
  authController.requireSignin,
  userController.removeFollowing,
  userController.removeFollower
)

router.get('/:userId', authController.requireSignin, userController.getUser)
router.put(
  '/:userId',
  authController.requireSignin,
  userController.hasAuthorization,
  userController.updateUser
)
router.delete(
  '/:userId',
  authController.requireSignin,
  userController.hasAuthorization,
  userController.deleteUser
)

router.get(
  '/:userId/suggestedUsers',
  authController.requireSignin,
  userController.hasAuthorization,
  userController.suggestedUsers
)

// any route containing : userId, our app will first execute userById
router.param('userId', userController.userById)

module.exports = router
