const express = require('express')
const authController = require('../controllers/auth')
const validator = require('../validator')

const router = express.Router()

router.post('/signup', validator.userSignupValidator, authController.signup)
router.post('/signin', authController.signin)
router.post('/signout', authController.signout)

module.exports = router
