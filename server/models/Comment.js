const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const commentSchema = new mongoose.Schema({

    postID: {
      type: ObjectId,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  })

  const Comment = mongoose.model('Comment', commentSchema);
 
  module.exports = Comment;