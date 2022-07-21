const Router = require('express-promise-router')
const router = new Router()

const profilesRouter = require('./profiles')
const articlesRouter = require('./articles')
const topicsRouter = require('./topics')

router.use('/profiles', profilesRouter)
router.use('/articles', articlesRouter)
router.use('/topics', topicsRouter)

module.exports = router
