const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    minlength: 5,
    maxlength: 30,
  },
  body: {
    type: String,
    required: 'Body is required',
    minlength: 5,
    maxlength: 1000,
  },
  photo: {
    data: Buffer,
    contenType: String
  },
  postedBy: {
    type: ObjectId,
    ref: 'User',
  },
  created: {
    type: Date,
    default: Date.Now,
  },
})

module.exports = mongoose.model('Post', postSchema)
