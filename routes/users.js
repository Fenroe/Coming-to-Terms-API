const express = require('express')

const usersController = require('../controllers/usersController')

const router = express.Router()

router.get('/:id', usersController.getUser)

router.post('/signup', usersController.signup)

router.post('/login', usersController.login)

router.put('/:id', usersController.updateUser)

router.delete('/:id', usersController.deleteUser)

module.exports = router
