const Router = require('express-promise-router')
const router = new Router()

const verifyToken = require('../config/verifyToken')

const postsController = require('../controllers/postsController')

router.get('/archive', postsController.getArchive)

router.get('/recent', postsController.getRecentPosts)

router.get('/postinfo/:id', postsController.getPost)

router.post('/new', verifyToken, postsController.createPost)

router.put('/postinfo/:id', verifyToken, postsController.updatePost)

router.put('/publish/:id', verifyToken, postsController.publishPost)

router.put('/unpublish/:id', verifyToken, postsController.unpublishPost)

router.delete('/:id', verifyToken, postsController.deletePost)

module.exports = router
