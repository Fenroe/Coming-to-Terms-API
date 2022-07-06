const express = require('express')

const commentsController = require('../controllers/commentsController')

const router = express.Router()

const verifyToken = require('../config/verifyToken')

router.get('/:id', commentsController.getComment)

router.get('/post/:id', commentsController.getPostComments)

router.post('/', verifyToken, commentsController.createComment)

router.put('/:id', verifyToken, commentsController.updateComment)

router.delete('/:id', verifyToken, commentsController.deleteComment)

module.exports = router
