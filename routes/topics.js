const Router = require('express-promise-router')
const router = new Router()

const passport = require('../config/passport')

router.get('/info/:topicId')
router.get('/all')

router.post('/new', passport.authenticate('jwt', { session: false }))

router.put('/update-name/:topicId', passport.authenticate('jwt', { session: false }))
router.put('/update-description/:topicId', passport.authenticate('jwt', { session: false }))

router.delete('/delete/:topicId', passport.authenticate('jwt', { session: false }))

module.exports = router
