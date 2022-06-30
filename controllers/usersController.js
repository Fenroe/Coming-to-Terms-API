const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Post = require('../models/post')
const { body, param, validationResult } = require('express-validator')
const async = require('async')

module.exports.getUser = [
  param('id').exists().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ userWasFound: false, message: 'Validation failed' })
    } else {
      async.parallel({
        userData: (callback) => {
          User
          .findOne({ '_id': req.params.id })
          .exec(callback)
        },
        userPosts: (callback) => {
          Post
          .find({ 'author': req.params.id })
          .populate('author')
          .exec(callback)
        }
      }, (err, results) => {
        if (err) return next(err)
        if (!results.userData) {
          return res.status(404).send({ userWasFound: false, message: 'User wasn\'t found'})
        } else {
          const userData = {
            username: results.userData.username,
            bio: results.userData.bio
          }
          const drafts = []
          const published = []
          results.userPosts.forEach((post) => {
            if (post.isPublished) {
              published.push(post)
            } else {
              drafts.push(draft)
            }
          })
          return res.status(200).send({
            userWasFound: true,
            message: 'User was found',
            userData,
            posts: {
              drafts,
              published
            }
          })
        }
      })

    }
  }
]

module.exports.signup = [
  body('username').trim().isLength({ min: 4, max: 20 }).escape(),
  body('email').isEmail().escape(),
  body('password').trim().isLength({ min: 6 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ userwasCreated: false, message: 'Validation failed' })
    } else {
      User
      .findOne({'_id': req.body.username})
      .exec((err, result) => {
        if (err) return next(err)
        if (result) {
          res.status(409).send({ userWasCreated: false, message: 'Username unavailable'})
        } else {
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) return next (err)
            const user = new User({
              _id: req.body.username,
              username: req.body.username,
              email: req.body.email,
              password: hashedPassword,
              isContributor: false,
              bio: ''
            })
            user
            .save()
            .then(() => res.status(201).send({userWasCreated: true, message: 'User created'}))
            .catch(() => res.status(500).send( { userWasCreated: false, message: 'Server error'} ))
          })
        }
      })
    }
  }
]

module.exports.login = [
  body('username').trim().isLength({ min: 4, max: 20 }).escape(),
  body('password').trim().isLength({ min: 6 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ loginWasSuccessful: false, message: 'Validation failed' })
    } else {
      User
      .findOne({ '_id': req.body.username})
      .exec((err, result) => {
        if (err) return next(err)
        if (!result) return res.status(404).send({ loginWasSuccessful: false, message: 'Invalid username/password' })
        bcrypt.compare(req.body.password, result.password, (err, success) => {
          if (err) return next(err)
          if (!success) return res.status(404).send({ lgoinWasSuccessful: false, message: 'Invalid username/password'})
          const token = jwt.sign(
            {
            userId: result._id,
            username: result.username,
            email: result.email,
            isContributor: result.isContributor
          }, process.env.JWT_KEY)
          return res.status(200).send({loginWasSuccessful: true, message: 'Auth successful', token, username: result.username})
        })
      })
    }
  }
]

module.exports.updateUser = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, result) => {
      if (err) return res.status(400).send({ userWasUpdated: false, message: 'Request was unsuccessful' })
      req.authData = result
      next()
    })
  },
  param('id').exists().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ userWasUpdated: false, message: 'Validation failed' })
    }
    if (req.authData.userId !== req.params.id) {
      return res.status(403).send({ userWasUpdated: false, message: 'Action forbidden' })
    }
    User
    .findOneAndUpdate({'_id': req.params.id}, { 'bio' : req.body.bio, 'isContributor' : req.body.isContributor })
    .exec((err, result) => {
      if (err) return next(err)
      return res.status(200).send({ userWasUpdated: true, message: 'User was updated' })
    })
  }
]

module.exports.deleteUser = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Delete user')
}
