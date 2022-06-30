const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    _id: { type: String, required: true, minLength: 4, maxLength: 20 },
    username: { type: String, required: true, minLength: 4, maxLength: 20 },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isContributor: { type: Boolean, required: true },
    bio: { type: String }
  }
)

UserSchema
.virtual('url')
.get(function() {
  return `/users/${this.username}`
})

module.exports = mongoose.model('User', UserSchema)
