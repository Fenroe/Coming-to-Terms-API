const mongoose = require('mongoose')
const day = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
day.extend(relativeTime)

const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  previewText: { type: String, required: true},
  content: { type: String, required: true },
  isPublished: { type: Boolean, required: true },
  datePublished: { type: Date, required: true },
  dateUpdated: { type: Date, required: true },
  keywords: [{ type: String, ref: 'Keyword' }]
})

PostSchema
.virtual('url')
.get(function() {
  return `/posts/${this._id}`
})

PostSchema
.virtual('authorName')
.get(function () {
  return this.author.username
})

PostSchema
.virtual('datePublishedFormatted')
.get(function () {
  return `Hello`
})

PostSchema
.virtual('datePublishedFromNow')
.get(function () {
  return `Published ${day(this.datePublished).fromNow()}`
})

PostSchema
.virtual('dateUpdatedFormatted')
.get(function () {
  return 'A formatted update date (not implemented yet)'
})

module.exports = mongoose.model('Post', PostSchema)
