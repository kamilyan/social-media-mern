const express = require('express')
const postController = require('../controllers/post')
const { requireSignin } = require('../controllers/auth')
const validator = require('../validator')

const router = express.Router()

router.get('/', requireSignin, postController.getPosts)
router.post('/post', validator.createPostValidator, postController.createPost)

module.exports = router
