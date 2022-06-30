const express = require('express')

const verifyToken = require('../config/verifyToken')

const usersController = require('../controllers/usersController')

const router = express.Router()

router.get('/userinfo/:id', usersController.getUser)

router.post('/signup', usersController.signup)

router.post('/login', usersController.login)

router.put('/userinfo/:id', verifyToken, usersController.updateUser)

router.delete('/userinfo/:id', verifyToken, usersController.deleteUser)

module.exports = router
