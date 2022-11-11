const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CredentialsSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
    isContributor: { type: Boolean, required: true }
  }
)

module.exports = mongoose.model('Credentials', CredentialsSchema)