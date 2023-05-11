const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    postID: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  })

  const Comment = mongoose.model('Comment', commentSchema);
 
  module.exports = Comment;