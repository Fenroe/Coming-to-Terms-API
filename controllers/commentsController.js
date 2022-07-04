const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

module.exports.getComment = (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return next()
  // it's a valid ObjectId, proceed with call.
  Comment
  .findOne({ '_id': req.params.id })
  .populate('author', 'post')
  .exec((err, result) => {
    if (err) return next(err)
    return res.status(400).send({ commentWasFound: true, message: 'Comment was found', comment: result })
  })
}

module.exports.getPostComments = (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return next()
  // it's a valid ObjectId, proceed with call.
  Comment
  .find({ 'post': req.params.id})
  .populate('author', 'post')
  .sort({ 'dateCommented': -1})
  .exec((err, result) => {
    if (err) return next(err)
    return res.status(200).send({ commentsWereFound: true, message: 'Comments found', comments: result })
  })
}

module.exports.createComment = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, result) => {
      if (err) return res.status(400).send({ commentWasCreated: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  body('content').trim().notEmpty().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ commentWasCreated: false, message: 'Validation failed' })
    }
    if (req.authData.userId !== req.body.username) {
      return res.status(403).send({ commentWasCreated: false, message: 'Forbidden action'})
    }
    const comment = new Comment({
      author: req.body.username,
      post: req.body.postId,
      content: req.body.content,
      dateCommented: new Date()
    })
    comment.save((err, result) => {
      if (err) return next(err)
      return res.status(201).send({ commentWasCreated: true, message: 'Comment successfully created', comment: result })
    })
  }
]

module.exports.updateComment = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, result) => {
      if (err) return res.status(400).send({ commentWasUpdated: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  body('content').trim().notEmpty().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ commentWasUpdated: false, message: 'Validation failed' })
    }
    if (req.authData.userId !== req.body.username) {
      return res.status(403).send({ commentWasUpdated: false, message: 'Forbidden action'})
    }
    Comment
    .findOneAndUpdate({'_id' : req.params.commentId }, {
      'content' : req.body.content,
      'dateUpdated': new Date()
    })
    .exec((err, result) => {
      if (err) return next(err)
      return res.status(201).send({ commentWasUpdated: true, message: 'Comment successfully updated' })
    })
  }
]

module.exports.deleteComment = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, result) => {
      if (err) return res.status(400).send({ commentWasDeleted: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ commentWasDeleted: false, message: 'Validation failed' })
    }
    if (req.authData.userId !== req.body.username) {
      return res.status(403).send({ commentWasDeleted: false, message: 'Forbidden action'})
    }
    Comment
    .findOneAndDelete({'_id' : req.params.commentId })
    .exec((err, result) => {
      if (err) return next(err)
      return res.status(201).send({ commentWasDeleted: true, message: 'Comment successfully deleted' })
    })
  }
]
