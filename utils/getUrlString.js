const slugify = require('slugify')

const getUrlString = (string) => {
  const options = {
    lower: true,
    strict: true
  }
  return slugify(string, options)
}

module.exports = getUrlString
