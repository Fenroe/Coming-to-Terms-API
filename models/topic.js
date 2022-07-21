const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TopicSchema = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    description: { type: String }
  },
  {
    timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdated'}
  }
)

module.exports = mongoose.model('Topic', TopicSchema)
