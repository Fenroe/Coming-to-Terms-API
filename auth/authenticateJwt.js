const { passport } = require('../config')

const authenticateJwt = () => {
  const options = {
    session: false
  }
  return passport.authenticate('jwt', options)
}

module.exports = authenticateJwt
