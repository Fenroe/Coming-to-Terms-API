const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    _id: { type: String, required: true, minLength: 4, maxLength: 20 },
    username: { type: String, required: true, unique: true, minLength: 4, maxLength: 20 },
    bio: { type: String }
  }
)

module.exports = mongoose.model('User', UserSchema)
