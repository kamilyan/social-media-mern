const { body, validationResult } = require('express-validator')

exports.createPostValidator = [
  body('title')
    .exists()
    .isLength({ min: 4, max: 30 })
    .withMessage('Title must be between 4 to 30 characters'),
  body('body')
    .exists()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Body must be between 5 to 1000 characters'),
  (req, res, next) => {
    // check for errors
    const errorsValidation = validationResult(req)
    // if error show the first one as they happen
    if (errorsValidation.isEmpty()) {
      return res.status(400).json({ error: errorsValidation.errors[0].msg })
    }
    next()
  },
]

exports.userSignupValidator = [
  body('name').exists(),
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must contain at least 5 characters'),
  (req, res, next) => {
    // check for errors
    const errorsValidation = validationResult(req)
    // if error show the first one as they happen
    if (errorsValidation.errors.length) {
      return res.status(400).json({ error: errorsValidation.errors[0].msg })
    }
    next()
  },
]
