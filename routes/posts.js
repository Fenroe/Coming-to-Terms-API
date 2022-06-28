const express = require('express')

const postsController = require('../controllers/postsController')

const router = express.Router()

router.get('/archive', postsController.getArchive)

router.get('/recent', postsController.getRecentPosts)

router.get('/:id', postsController.getPost)

router.post('/', postsController.createPost)

router.put('/:id', postsController.updatePost)

router.delete('/:id', postsController.deletePost)

module.exports = router
