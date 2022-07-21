const mongoose = require('mongoose')
const day = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
day.extend(relativeTime)

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  _id: { type: String },
  title: { type: String, unique: true, required: true },
  author: { type: String, ref: 'User', required: true},
  subtitle: { type: String },
  coverImage: { type: String },
  content: { type: String },
  topic: { type: String, ref: 'Topic' },
  tags: { type: Array },
  isPublished: { type: Boolean, required: true },
  datePublished: { type: Date }
}, {
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdated' },
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

ArticleSchema
.virtual('authorName')
.get(function () {
  return this.author.username
})

ArticleSchema
.virtual('datePublishedFormatted')
.get(function () {
  return `${day(this.datePublished).format('MMMM D YYYY')}`
})

ArticleSchema
.virtual('datePublishedFromNow')
.get(function () {
  return `Published ${day(this.datePublished).fromNow()}`
})

ArticleSchema
.virtual('dateUpdatedFormatted')
.get(function () {
  return 'A formatted update date (not implemented yet)'
})

ArticleSchema
.virtual('yearAndMonthPublished')
.get(function () {
  return day(this.datePublished).format('MMMM YYYY')
})

module.exports = mongoose.model('Article', ArticleSchema)
