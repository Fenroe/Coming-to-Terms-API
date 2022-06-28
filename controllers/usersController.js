const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports.getUser = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Get user')
}

module.exports.signup = (req, res, next) => {
  User
  .findOne({'username': req.body.username})
  .exec((err, result) => {
    if (err) return next(err)
    if (result) {
      res.status(409).send({ userWasCreated: false, message: 'Username unavailable'})
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next (err)
        const user = new User({
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

module.exports.login = (req, res, next) => {
  User
  .findOne({ 'username': req.body.username})
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
      return res.status(200).send({loginWasSuccessful: true, message: 'Auth successful', token})
    })
  })
}

module.exports.updateUser = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Update user')
}

module.exports.deleteUser = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Delete user')
}
