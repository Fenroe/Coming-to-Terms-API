const { nextTick } = require('async')
const mongoose = require('mongoose')
const { getUrlString } = require('../utils')

const Schema = mongoose.Schema

const ProfileSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    url: { type: String, required: true, unique: true },
    bio: { type: String }
  }
)

ProfileSchema.pre('validate', function(next) {
  if (this.username) {
    this.url = getUrlString(this.username)
  }
  next()
})

module.exports = mongoose.model('Profile', ProfileSchema)
