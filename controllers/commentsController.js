const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const { body, param, validationResult } = require('express-validator')

module.exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment
    .findOne({ '_id': req.params.id })
    .populate('author', 'post')
    .exec()
    return res
    .status(200)
    .send({ comment: comment })
  } catch (err) {
    return next(err)
  }
}

module.exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment
    .find({ 'post': req.params.id})
    .populate('author', 'post')
    .sort({ 'dateCommented': -1 })
    .exec()
    return res
    .status(200)
    .send({ comments: comments })
  } catch (err) {
    return next(err)
  }
}

module.exports.createComment = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ commentWasCreated: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  body('content').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      if (req.authData.userId !== req.body.username) {
        throw new Error('Forbidden action')
      }
      const comment = new Comment({
        author: req.body.username,
        post: req.body.postId,
        content: req.body.content,
        dateCommented: new Date()
      })
      const newComment = await comment.save()
      return res.status(201).send({ comment: newComment })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateComment = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ commentWasUpdated: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  body('content').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      if (req.authData.userId !== req.body.username) {
        throw new Error('Forbidden action')
      }
      await Comment
      .findOneAndUpdate({'_id' : req.params.id }, {
        'content' : req.body.content,
        'dateUpdated': new Date()
      })
      .exec()
      return res
      .status(200)
      .send({ message: 'Comment successfully updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.deleteComment = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ commentWasDeleted: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      if (req.authData.userId !== req.body.username) {
        throw new Error('Forbidden action')
      }
      await Comment
      .findOneAndDelete({'_id' : req.params.id })
      .exec()
      return res
      .status(200)
      .send({ message: 'Comment successfully deleted' })
    } catch (err) {
      return next(err)
    }
  }
]
