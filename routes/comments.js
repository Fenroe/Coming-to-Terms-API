const express = require('express')

const commentsController = require('../controllers/commentsController')

const router = express.Router()

router.get('/:id', commentsController.getComment)

router.post('/', commentsController.createComment)

router.put('/:id', commentsController.updateComment)

router.delete('/:id', commentsController.deleteComment)

module.exports = router
