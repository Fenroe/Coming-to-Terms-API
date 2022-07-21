const mongoose = require('mongoose')
const day = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
day.extend(relativeTime)
const { getUrlString } = require('../utils')

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  title: { type: String, unique: true, required: true },
  url: { type: String, required: true, unique: true },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: true},
  subtitle: { type: String },
  coverImage: { type: String },
  content: { type: String },
  topic: { type: Schema.Types.ObjectId, ref: 'Topic' },
  tags: { type: Array },
  isPublished: { type: Boolean, required: true },
  datePublished: { type: Date }
}, {
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdated' },
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

ArticleSchema
.pre('validate', function(next) {
  if (this.title) {
    this.url = getUrlString(this.title)
  }
  next()
})

ArticleSchema
.virtual('authorName')
.get(function () {
  return this.profile.username
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
  return `${day(this.dateUpdated).format('MMMM D YYYY')}`
})

ArticleSchema
.virtual('yearAndMonthPublished')
.get(function () {
  return day(this.datePublished).format('MMMM YYYY')
})

module.exports = mongoose.model('Article', ArticleSchema)
