const express = require('express')
const postController = require('../controllers/post')
const userController = require('../controllers/user')
const { requireSignin } = require('../controllers/auth')
const validator = require('../validator')

const router = express.Router()

router.get('/', postController.getPosts)
router.get('/:postId', postController.getPostById)
router.get('/:postId/photo', postController.getPostPhoto)

router.post(
  '/users/:userId',
  requireSignin,
  validator.createPostValidator,
  postController.createPost
)

router.get('/users/:userId', requireSignin, postController.postsByUser)

router.put(
  '/:postId',
  requireSignin,
  postController.isPoster,
  postController.updatePost
)

router.delete(
  '/:postId',
  requireSignin,
  postController.isPoster,
  postController.deletePost
)

// any route containing : userId, our app will first execute userById
router.param('userId', userController.userById)
router.param('postId', postController.postById)

module.exports = router
