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
    contentType: String,
  },
  postedBy: {
    type: ObjectId,
    ref: 'User',
  },
  update: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: ObjectId, ref: 'User' }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: ObjectId, ref: 'User' },
    },
  ],
})

module.exports = mongoose.model('Post', postSchema)
