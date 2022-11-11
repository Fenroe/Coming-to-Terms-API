const { Article, Topic } = require('../models')
const { getQueryValues, getUrlString } = require('../utils')

const { body, validationResult } = require('express-validator')

module.exports.getArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params
    const article = await Article.findOne({ 'url': articleId, 'isPublished': true }).populate('profile').exec()
    return res.status(200).send({ article })
  } catch (err) {
    return next(err)
  }
}

module.exports.getAllArticles = async (req, res, next) => {
  try {
    const { query, limit, offset } = getQueryValues(req, { isPublished: true })
    const articles = await Article.find(query).limit(limit).skip(offset).populate('profile').exec()
    return res.status(200).send({ articles })
  } catch (err) {
    return next(err)
  }
}

module.exports.getUserArticle = async (req, res, next) => {
  try {
    const profile = req.user.profile._id
    const { articleId } = req.params
    const article = await Article.findOne({ 'url': articleId, 'profile': profile }).populate('profile').exec()
    return res.status(200).send({ article })
  } catch (err) {
    return next(err)
  }
}

module.exports.getAllUserArticles = async (req, res, next) => {
  try {
    const profile = req.user.profile._id
    const { query, limit, offset } = getQueryValues(req, { profile })
    const articles = await Article.find(query).limit(limit).skip(offset).populate('profile').exec()
    return res.status(200).send({ articles })
  } catch (err) {
    return next(err)
  }
}

module.exports.createArticle = [
  body('title').isString().notEmpty().trim(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { title } = req.body
      const titleInUse = await Article.findOne({ 'title': title }).exec()
      if (titleInUse) {
        throw new Error('There is another article with this title.')
      }
      const profile = req.user.profile._id
      const article = new Article({
        title,
        subtitle: '',
        profile,
        coverImage: '',
        isPublished: false
      })
      const savedArticle = await article.save()
      return res.status(201).send({ article: savedArticle })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateTitle = [
  body('title').isString().notEmpty().trim(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { title } = req.body
      const titleInUse = await Article.findOne({ 'title': title }).exec()
      if (titleInUse) {
        throw new Error('There is another article with this title.')
      }
      const { articleId } = req.params
      const profile = req.user.profile._id
      await Article.findOneAndUpdate({ 'url': articleId, 'profile': profile }, { 'title': title, 'url': getUrlString(title) }).exec()
      return res.status(200).send({ message: 'Article title updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateSubtitle = [
  body('subtitle').isString().trim(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { subtitle } = req.body
      const { articleId } = req.params
      const profile = req.user.profile._id
      await Article.findOneAndUpdate({ 'url': articleId, 'profile': profile }, { 'subtitle': subtitle }).exec()
      return res.status(200).send({ message: 'Article subtitle updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateContent = [
  body('content').isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { content } = req.body
      const { articleId } = req.params
      const profile = req.user.profile._id
      await Article.findOneAndUpdate({ 'url': articleId, 'profile': profile }, { 'content': content }).exec()
      return res.status(200).send({ message: 'Article content updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateCoverImage = [
  body('coverImage').isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { coverImage } = req.body
      const { articleId } = req.params
      const profile = req.user.profile._id
      await Article.findOneAndUpdate({ 'url': articleId, 'profile': profile }, { 'coverImage': coverImage }).exec()
      return res.status(200).send({ message: 'Article cover image updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateTopic = [
  body('topic').isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { topic } = req.body
      const topicQuery = await Topic.findOne({ '_id': topic }).exec()
      if (!topicQuery) {
        throw new Error('Topic does not exist')
      }
      const { articleId } = req.params
      const profile = req.user.profile._id
      await Article.findOneAndUpdate({ 'url': articleId, 'profile': profile }, { 'topic': topic }).exec()
      return res.status(200).send({ message: 'Article topic updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.updateTags = [
  body('tags').isArray(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { tags } = req.body
      const { articleId } = req.params
      const profile = req.user.profile._id
      await Article.findOneAndUpdate({ 'url': articleId, 'profile': profile }, { 'tags': tags }).exec()
      return res.status(200).send({ message: 'Article tags updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.publishArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params
    const profile = req.user.profile._id
    await Article.findOneAndUpdate({ 'url': articleId, 'profile': profile }, { 'isPublished': true }).exec()
    return res.status(200).send({ message: 'Article was published' })
  } catch (err) {
    return next(err)
  }
}

module.exports.unpublishArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params
    const profile = req.user.profile._id
    await Article.findOneAndUpdate({ 'url': articleId, 'profile': profile }, { 'isPublished': false }).exec()
    return res.status(200).send({ message: 'Article was published' })
  } catch (err) {
    return next(err)
  }
}

module.exports.updateArticle = [
  body('title').isString(),
  body('subtitle').isString(),
  body('content').isString(),
  body('coverImage').isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new Error('Validation failed')
      }
      const { title, subtitle, content, coverImage } = req.body
      const { articleId } = req.params
      const profile = req.user.profile._id
      await Article.findOneAndUpdate(
        { 'url': articleId, 'profile': profile },
        { 'title': title, 'subtitle': subtitle, 'content': content, 'coverImage': coverImage }
      )
      .exec()
      return res.status(200).send({ message: 'Article was updated' })
    } catch (err) {
      return next(err)
    }
  }
]

module.exports.deleteArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params
    const profile = req.user.profile._id
    await Article.findOneAndDelete({ 'url': articleId, 'profile': profile })
    return res.status(200).send({ message: 'Article was deleted' })
  } catch (err) {
    return next(err)
  }
}