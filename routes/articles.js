const Router = require('express-promise-router')
const router = new Router()

const passport = require('../config/passport')

router.get('/info/:articleId', postsController.getPost)
router.get('/all')

router.post('/new', passport.authenticate('jwt', { session: false }), postsController.createPost)

router.put('/update-title/:articleId', passport.authenticate('jwt', { session: false }), postsController.updatePost)
router.put('/update-subtitle/:articleId', passport.authenticate('jwt', { session: false }))
router.put('/update-content/:articleId', passport.authenticate('jwt', {session: false }))
router.put('/update-cover-image/:articleId', passport.authenticate('jwt', {session: false }))
router.put('/update-tags/:articleId', passport.authenticate('jwt', {session: false }))
router.put('/publish/:articleId', passport.authenticate('jwt', { session: false }), postsController.publishPost)
router.put('/unpublish/:articleId', passport.authenticate('jwt', { session: false }), postsController.unpublishPost)

router.delete('/delete/:articleId', passport.authenticate('jwt', { session: false }), postsController.deletePost)

module.exports = router
