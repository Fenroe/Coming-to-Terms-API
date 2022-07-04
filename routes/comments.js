const express = require('express')

const commentsController = require('../controllers/commentsController')

const router = express.Router()

router.get('/:id', commentsController.getComment)

router.get('/post/:id', commentsController.getPostComments)

router.post('/', commentsController.createComment)

router.put('/:id', commentsController.updateComment)

router.delete('/:id', commentsController.deleteComment)

module.exports = router
