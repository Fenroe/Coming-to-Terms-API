const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const sanitizeHtml = require('sanitize-html')

const { body, validationResult } = require('express-validator')
const async = require('async')

module.exports.getPost = (req, res, next) => {

  async.parallel({
    post: (callback) => {
      Post
      .findOne({ '_id' : req.params.id })
      .populate('author')
      .exec(callback)
    },
    postComments: (callback) => {
      Comment
      .find({ 'post' : req.params.id })
      .populate('author', 'post')
      .sort({ 'dateCommented': -1 })
      .exec(callback)
    }
  }, (err, results) => {
    if (err) return next(err)
    return res.status(200).send({ postWasFound: true, message: 'Post was found', post: results.post, comments: results.postComments })
  })
}

module.exports.getArchive = (req, res, next) => {
  Post
  .find({ 'isPublished' : true })
  .populate('author')
  .sort({ 'datePublished' : -1 })
  .exec((err, result) => {
    if (err) return next(err)
    return res.status(200).send({ querySuccessful: true, message: 'All published posts retrieved', posts: result})
  })
}

module.exports.getRecentPosts = (req, res, next) => {
  Post
  .find({ 'isPublished' : true})
  .populate('author')
  .sort({ 'datePublished' : -1 })
  .limit(req.query.limit || 10 )
  .exec((err, result) => {
    if (err) return next(err)
    return res.status(200).send({ querySuccessful: true, message: 'Recent posts retrieved', posts: result})
  })
}

module.exports.createPost = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ postWasCreated: false, message: 'Could not verify credentials' })
      req.authData = result
      console.log(result)
      next()
    })
  },
  body('username').trim().notEmpty().escape(),
  body('title').trim().notEmpty().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ postWasCreated: false, message: 'Validation failed' })
    }
    if (req.authData.isContributor === false || req.body.username !== req.authData.userId) {
      return res.status(403).send({ postWasCreated: false, message: 'Action forbidden' })
    }
    const post = new Post({
      title: req.body.title,
      author: req.body.username,
      previewText: '',
      content: '',
      isPublished: false,
      datePublished: new Date(),
      dateUpdated: new Date()
    })
    post.save((err, result) => {
      if (err) return next(err)
      return res.status(201).send({ postWasCreated: true, message: 'Post was created', post: result })
    })
  }
]

module.exports.updatePost = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ postWasUpdated: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('title').trim().notEmpty(),
  body('previewText').trim(),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ postWasUpdated: false, message: 'Validation failed' })
    }
    if (req.authData.isContributor === false || req.body.username !== req.authData.userId) {
      return res.status(403).send({ postWasUpdated: false, message: 'Action forbidden'})
    }
    Post
    .findOneAndUpdate({'_id': req.body.postId}, {
      'title': req.body.title,
      'previewText': req.body.previewText,
      'content': sanitizeHtml(req.body.content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])}),
      'dateUpdated': new Date()
    })
    .exec((err, result) => {
      if (err) return next(err)
      return res.status(200).send({ postWasUpdated: true, message: 'Post was updated' })
    })
  }
]

module.exports.publishPost = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ postWasPublished: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ postWasPublished: false, message: 'Validation failed' })
    }
    if (req.authData.isContributor === false || req.authData.userId !== req.body.username) {
      return res.status(403).send({ postWasPublished: false, message: 'Action forbidden' })
    }
    Post
    .findOneAndUpdate({ '_id':req.body.postId }, {
      'isPublished': true
    })
    .exec((err, result) => {
      if (err) return next(err)
      return res.status(200).send({ postWasPublished: true, message: 'Post was published', post: result })
    })
  }
]

module.exports.unpublishPost = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ postWasUnpublished: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ postWasUnpublished: false, message: 'Validation failed' })
    }
    if (req.authData.isContributor === false || req.authData.userId !== req.body.username) {
      return res.status(403).send({ postWasUnpublished: false, message: 'Action forbidden' })
    }
    Post
    .findOneAndUpdate({ '_id':req.body.postId }, {
      'isPublished': false
    })
    .exec((err, result) => {
      if (err) return next(err)
      return res.status(200).send({ postWasUnpublished: true, message: 'Post was unpublished', post: result })
    })
  }
]

module.exports.deletePost = (req, res, next) => {
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ postWasDeleted: false, message: 'Could not verify credentials' })
      req.authData = result
      next()
    })
  },
  body('username').trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ postWasDeleted: false, message: 'Validation failed' })
    }
    if (req.authData.isContributor === false || req.authData.userId !== req.body.username) {
      return res.status(403).send({ postWasDeleted: false, message: 'Action forbidden' })
    }
    Post
    .findOneAndDelete({ '_id':req.body.postId })
    .exec((err, result) => {
      if (err) return next(err)
      return res.status(200).send({ postWasDeleted: true, message: 'Post was deleted', post: result })
    })
  }
}
