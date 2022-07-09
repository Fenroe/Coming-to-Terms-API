const mongoose = require('mongoose')
const day = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
day.extend(relativeTime)

const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    author: { type: String, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    dateCommented: { type: Date, required: true },
    dateUpdated: { type: Date }
  }, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
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

CommentSchema
.virtual('dateCommentedFromNow')
.get(function () {
  return `${day(this.dateCommented).fromNow()}`
})

CommentSchema
.virtual('dateEditedFromNow')
.get(function () {
  if (this.dateUpdated) {
    return `${day(this.dateUpdated).fromNow()}`
  }
})

module.exports = mongoose.model('Comment', CommentSchema)
