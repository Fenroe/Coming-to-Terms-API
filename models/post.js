const mongoose = require('mongoose')
const day = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
day.extend(relativeTime)

const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: { type: String },
  author: { type: String, ref: 'User', required: true},
  previewText: { type: String },
  coverImage: { type: String },
  content: { type: String },
  isPublished: { type: Boolean, required: true },
  datePublished: { type: Date },
  dateUpdated: { type: Date }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
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
  return `${day(this.datePublished).format('MMMM D YYYY')}`
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

PostSchema
.virtual('yearAndMonthPublished')
.get(function () {
  return day(this.datePublished).format('MMMM YYYY')
})

module.exports = mongoose.model('Post', PostSchema)
