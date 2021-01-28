const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const _ = require('lodash')
const { sendEmail } = require('../helpers')
const dotenv = require('dotenv')
dotenv.config()
const User = require('../models/user')

exports.signup = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists)
      return res.status(403).json({
        error: 'Email is taken!',
      })
    const user = await new User(req.body)
    await user.save()
    res.status(201).json({ message: 'Signup success' })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

exports.signin = (req, res) => {
  try {
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          error: 'User does not exist',
        })
      }
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: 'Incorrect password',
        })
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

      res.cookie('t', token, { expire: new Date() + 9999 })

      const { _id, name, email } = user
      return res.json({ token, user: { _id, email, name } })
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

exports.signout = (req, res) => {
  try {
    res.clearCookie('t')
    return res.json({ message: 'Signout success!' })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
})

exports.forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({ message: 'No request body' })
  if (!req.body.email)
    return res.status(400).json({ message: 'No Email in request body' })

  const { email } = req.body

  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status('401').json({
        error: 'User with that email does not exist!',
      })

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD)

    const emailData = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: 'Password Reset Instructions',
      text: `Please use the following link to reset your password: https://social-media-mern-project.herokuapp.com/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>https://social-media-mern-project.herokuapp.com/reset-password/${token}</p>`,
    }

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err })
      } else {
        sendEmail(emailData)
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
        })
      }
    })
  })
}

exports.resetPassword = (req, res) => {
  try {
    const { resetPasswordLink, newPassword } = req.body

    User.findOne({ resetPasswordLink }, (err, user) => {
      // if err or no user
      if (err || !user)
        return res.status('401').json({
          error: 'Not authorized to reset!',
        })

      const updatedFields = {
        password: newPassword,
        resetPasswordLink: '',
      }

      user = _.extend(user, updatedFields)
      user.updated = Date.now()

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          })
        }
        res.json({
          message: 'Password Reset Successfully',
        })
      })
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

exports.socialLogin = (req, res) => {
  try {
    // try signup by finding user with req.email
    let user = User.findOne({ email: req.body.email }, (err, user) => {
      if (err || !user) {
        // create a new user and login
        user = new User(req.body)
        req.profile = user
        user.save()

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.cookie('t', token, { expire: new Date() + 9999 })
        // return response with user and token to frontend client
        const { _id, name, email } = user
        return res.json({ token, user: { _id, name, email } })
      } else {
        // update existing user with new social info and login
        req.profile = user
        user = _.extend(user, req.body)
        user.updated = Date.now()
        user.save()
        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.cookie('t', token, { expire: new Date() + 9999 })
        // return response with user and token to frontend client
        const { _id, name, email } = user
        return res.json({ token, user: { _id, name, email } })
      }
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}
