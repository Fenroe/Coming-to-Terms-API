const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TopicSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true, unique: true },
    description: { type: String }
  },
  {
    timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdated'}
  }
)

TopicSchema
.pre('validate', function(next) {
  if (this.name) {
    this.url = getUrlString(this.name)
  }
  next()
})

module.exports = mongoose.model('Topic', TopicSchema)
