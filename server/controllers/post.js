const Post = require('../models/post')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate('postedBy', '_id name')
    .populate('comments')
    .populate('comments.postedBy', '_id name')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        })
      }
      req.post = post
      next()
    })
}

exports.getPosts = (req, res) => {
  Post.find()
    .populate('postedBy', '_id name')
    .select('_id title body created likes')
    .populate('comments')
    .populate('comments.postedBy', '_id name')
    .sort({ created: -1 })
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((err) => console.error(err))
}

exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      })
    }
    let post = new Post(fields)
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    post.postedBy = req.profile
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    post.save((err, result) => {
      if (err) {
        return res.satus(400).json({
          error: err,
        })
      }
      res.json(result)
    })
  })
}

exports.postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate('postedBy', '_id name')
    .select('_id title body created likes')
    .sort({ created: -1 })
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        })
      }
      res.json(posts)
    })
}

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id

  if (!isPoster) {
    return res.status(403).json({
      error: 'Not authorized ddd',
    })
  }
  next()
}

exports.updatePost = (req, res, next) => {
  let form = new formidable.IncomingForm()

  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded',
      })
    }

    let post = req.post
    post = _.extend(post, fields)
    post.updated = Date.now()
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        })
      }

      res.json(result)
    })
  })
}

exports.deletePost = (req, res) => {
  let post = req.post
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err,
      })
    }
    res.json({
      message: 'Post deleted!',
    })
  })
}

exports.getPostPhoto = (req, res, next) => {
  res.set('Content-Type', req.post.photo.contentType)
  return res.send(req.post.photo.data)
}

exports.getPostById = (req, res, next) => {
  return res.json(req.post)
}

exports.performLike = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.post._id,
    {
      $push: { likes: req.auth._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err })
      }
      res.json(result)
      next()
    }
  )
}

exports.performUnlike = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.post._id,
    {
      $pull: { likes: req.auth._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err })
      }
      res.json(result)
      next()
    }
  )
}

exports.performComment = (req, res, next) => {
  let comment = req.body.comment
  comment.postedBy = req.auth._id

  Post.findByIdAndUpdate(
    req.post._id,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate('comments.postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err })
      }
      res.json(result)
      next()
    })
}

exports.performUncomment = (req, res, next) => {
  let comment = req.body.commment

  Post.findByIdAndUpdate(
    req.post._id,
    {
      $pull: { comments: { _id: comment._id } },
    },
    { new: true }
  )
    .populate('comments.postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err })
      }
      res.json(result)
      next()
    })
}
