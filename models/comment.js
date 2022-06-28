const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    dateCommented: { type: Date, required: true },
    dateUpdated: { type: Date }
  }
)

CommentSchema
.virtual('dateCommentedFormatted')
.get(function () {
  return 'Formatted date (not yet implemented)'
})

CommentSchema
.virtual('dateUpdatedFormatted')
.get(function () {
  return 'Formatted update date (not yet implemented)'
})

module.exports = mongoose.model('Comment', CommentSchema)
