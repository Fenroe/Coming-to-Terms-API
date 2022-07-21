const passport = require('passport')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const Credentials = require('../models/credentials')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY
}

const jwtStrategy = new JwtStrategy(
  options,
  async (payload, done) => {
    try {
      const id = payload.sub
      const user = await Credentials.findOne({ '_id': id }).populate('profile').exec()
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
)

passport.use(jwtStrategy)

module.exports = passport
