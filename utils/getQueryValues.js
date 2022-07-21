const getQueryValues = (req, base) => {
  const { tags, profile, topic } = req.query
  const limit = parseInt(req.query.limit) || 10
  const page = parseInt(req.query.page) || 1
  const offset = page && limit ? (page - 1) * limit : null
  const query = base || {}
  if (tags && !query.tags) {
    query.tags = tags
  }
  if (profile && !query.profile) {
    query.profile = profile
  }
  if (topic && !query.topic) {
    query.topic = topic
  }
  return { query, limit, offset }
}

module.exports = getQueryValues
