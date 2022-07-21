const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Profile = require('../models/profile')
const Credentials = require('../models/credentials')
const { body, validationResult } = require('express-validator')

module.exports.getProfile = async (req, res, next) => {
  try {
    const username = req.params.username
    const profile = await Profile.findOne({ '_id': username }).exec()
    return res.status(200).send({ profile })
  } catch (err) {
    return next(err)
  }
}

module.exports.getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find().exec()
    return res.status(200).send({ profiles })
  } catch (err) {
    return next(err)
  }
}

module.exports.signup = [
  body('username').trim().notEmpty(),
  body('email').isEmail(),
  body('password').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body
      const usernameUnavailable = await Profile.findOne({ '_id': username }).exec()
      if (usernameUnavailable) {
        throw new Error('Username unavailable')
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const profile = new Profile({
        _id: username,
        username
      })
      const savedProfile = await profile.save()
      const credentials = new Credentials({
        email,
        password: hashedPassword,
        profile: savedProfile._id
      })
      await credentials.save()
      return res.status(201).send({ newProfileId: savedProfile.id })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.login = [
  body('email').isEmail(),
  body('password').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { email, password } = req.body
      const credentials = await Credentials.findOne({ 'email': email }).exec()
      if (!credentials) {
        throw new Error('Invalid username/password')
      }
      const passwordsMatch = await bcrypt.compare(password, credentials.password)
      if (!passwordsMatch) {
        throw new Error('Invalid username/password')
      }
      const profile = await Profile.findOne({ '_id': credentials.profile }).exec()
      const payload = {
        sub: credentials._id,
        iat: Date.now()
      }
      const token = jwt.sign(payload, process.env.JWT_KEY)
      return res.status(200).send({ token, profile })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateBio = [
  body('bio').exists({ checkFalsy: false, checkNull: true }),
  async (req, res, next) => {
    try {
      const username = req.user.profile._id
      const { bio } = req.body
      await Profile.findOneAndUpdate({ '_id': username }, { 'bio': bio }).exec()
      return res.status(200).send({ message: 'Bio was updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateUsername = [
  body('username').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { username } = req.body
      if (username === req.user.profile._id) {
        throw new Error('Unnecessary update')
      }
      const usernameInUse = await Profile.findOne({ '_id': username }).exec()
      if (usernameInUse) {
        throw new Error('Username is already in use')
      }
      await Profile.findOneAndUpdate({ '_id': req.user.profile._id}, { '_id': username }).exec()
      return res.status(200).send({ message: 'Username was updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateEmail = [
  body('email').isEmail(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { email } = req.body
      const credentialsId = req.user._id
      if (email === req.user.email) {
        throw new Error('Unnecessary update')
      }
      const emailInUse = await Credentials.findOne({ 'email': email }).exec()
      if (emailInUse) {
        throw new Error('Email is already in use')
      }
      await Credentials.findOneAndUpdate({ '_id': credentialsId }, { 'email': email }).exec()
      return res.status(200).send({ message: 'Email was updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updatePassword = [
  body('currentPassword').trim().notEmpty(),
  body('newPassword').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body
      const hashedPassword = req.user.password
      const credentialsId = req.user._id
      const passwordsMatch = await bcrypt.compare(currentPassword, hashedPassword)
      if (!passwordsMatch) {
        throw new Error('Incorrect password')
      }
      const newHashedPassword = await bcrypt.hash(newPassword, 10)
      await Credentials.findOneAndUpdate({ '_id': credentialsId }, { 'password': newHashedPassword }).exec()
      return res.status(200).send({ message: 'Password updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.closeAccount = [
  body('password').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { password } = req.body
      const hashedPassword = req.user.password
      const passwordsMatch = await bcrypt.compare(password, hashedPassword)
      if (!passwordsMatch) {
        throw new Error('Incorrect password')
      }
      const credentialsId = req.user._id
      const profileId = req.user.profile._id
      await Profile.findOneAndDelete({ '_id': profileId }).exec()
      await Credentials.findOneAndDelete({ '_id': credentialsId }).exec()
      return res.status(200).send({ message: 'Account successfully closed' })
    } catch (err) {
      return next(err)
    }
  }
]
