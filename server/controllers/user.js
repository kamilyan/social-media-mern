const User = require('../models/user')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User not found',
        })
      }
      req.profile = user
      next()
    })
}

exports.hasAuthorization = (req, res, next) => {
  let sameUser = req.profile && req.auth && req.profile._id == req.auth._id
  let adminUser = req.profile && req.auth && req.auth.role == 'admin'
  const authorized = sameUser || adminUser
  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized',
    })
  }
  next()
}

exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      })
    }
    res.json(users)
  }).select('name email updated created')
}

exports.getUser = (req, res) => {
  try {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
  } catch (e) {
    console.error(e)
    next(e)
  }
}

exports.updateUser = (req, res, next) => {
  try {
    let form = new formidable.IncomingForm()

    form.keepExtensions = true

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: 'Photo could not be uploaded',
        })
      }

      let user = req.profile
      user = _.extend(user, fields)
      user.updated = Date.now()
      if (files.photo) {
        user.photo.data = fs.readFileSync(files.photo.path)
        user.photo.contentType = files.photo.type
      }
      user.save((err) => {
        if (err) {
          return res.status(400).json({
            error: err,
          })
        }
        user.hashed_password = undefined
        user.salt = undefined
        res.json({ user })
      })
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

exports.getUserPhoto = (req, res, next) => {
  try {
    if (req.profile.photo.data) {
      res.set('Content-Type', req.profile.photo.contentType)
      return res.send(req.profile.photo.data)
    }
    next()
  } catch (e) {
    console.error(e)
    next(e)
  }
}

exports.deleteUser = (req, res, next) => {
  try {
    let user = req.profile
    user.remove((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        })
      }

      res.json({ message: 'User deleted!' })
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.auth._id,
    {
      $push: { following: req.params.followId },
    },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err })
      }
      next()
    }
  )
}

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.params.followId,
    {
      $push: { followers: req.auth._id },
    },
    { new: true }
  )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err })
      }
      result.hashed_password = undefined
      result.salt = undefined
      res.json(result)
    })
}

exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.auth._id,
    {
      $pull: { following: req.params.unfollowId },
    },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err })
      }
      next()
    }
  )
}

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.params.unfollowId,
    {
      $pull: { followers: req.auth._id },
    },
    { new: true }
  )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err })
      }
      result.hashed_password = undefined
      result.salt = undefined
      res.json(result)
    })
}

exports.suggestedUsers = (req, res) => {
  try {
    let following = req.profile.following
    User.find(
      { _id: { $nin: [...following, req.profile_id] } },
      (err, users) => {
        if (err) {
          return res.status(400).json({
            error: err,
          })
        }
        res.json(users)
      }
    ).select('name')
  } catch (e) {
    console.error(e)
    next(e)
  }
}
