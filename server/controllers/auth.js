const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
require('dotenv').config()
const User = require('../models/user')

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email })
  if (userExists)
    return res.status(403).json({
      error: 'Email is taken!',
    })
  const user = await new User(req.body)
  await user.save()
  res.status(201).json({ message: 'Signup success' })
}

exports.signin = (req, res) => {
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
}

exports.signout = (req, res) => {
  res.clearCookie('t')
  return res.json({ message: 'Signout success!' })
}

exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
})
