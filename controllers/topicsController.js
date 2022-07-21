const { Topic } = require('../models')
const { getQueryValues, getUrlString } = require('../utils')
const { body, validationResult } = require('express-validator')

module.exports.getTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params
    const topic = await Topic.findOne({ 'url': topicId }).exec()
    return res.status(200).send({ topic })
  } catch (err) {
    return next(err)
  }
}

module.exports.getAllTopics = async (req, res, next) => {
  try {
    const { query, limit, offset } = getQueryValues(req)
    const topics = await Topic.find(query).limit(limit).skip(offset).exec()
    return res.status(200).send({ topics })
  } catch (err) {
    return next(err)
  }
}

module.exports.createTopic = [
  body('name').isString().trim().notEmpty(),
  body('description').isString().trim(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { name, description } = req.body
      const nameInUse = await Topic.findOne({ 'name': name }).exec()
      if (nameInUse) {
        throw new Error('Name is already in use.')
      }
      const newTopic = new Topic({
        name,
        description
      })
      const topic = await newTopic.save()
      return res.status(200).send({ topic })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateName = [
  body('name').isString().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { topicId } = req.params
      const { name } = req.body
      const nameInUse = await Topic.findOne({ 'name': name }).exec()
      if (nameInUse) {
        throw new Error('Name is already in use.')
      }
      await Topic.findOneAndUpdate({ 'url': topicId}, { 'name': name, 'url': getUrlString(name) }).exec()
      return res.status(200).send({ message: 'Topic name updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateDescription = [
  body('description').isString().trim(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { topicId } = req.params
      const { description } = req.body
      await Topic.findOneAndUpdate({ 'url': topicId}, { 'description': description }).exec()
      return res.status(200).send({ message: 'Topic description updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.deleteTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params
    await Topic.findOneAndDelete({ 'url': topicId })
    return res.status(200).send({ message: 'Topic deleted' })
  } catch (err) {
    return next(err)
  }
}