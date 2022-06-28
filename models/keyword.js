const mongoose = require('mongoose')

const Schema = mongoose.Schema

const KeywordSchema = new Schema(
  {
    _id: { type: String, required: true }
  }
)

KeywordSchema
.virtual('short')
.get(function() {
  if (this._id.length <= 12) {
    return this._id
  } else {
    return `${this._id.substring(0, 9)}...`
  }
})

module.exports = mongoose.model('Keyword', KeywordSchema)
