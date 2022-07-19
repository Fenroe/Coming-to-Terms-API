const Router = require('express-promise-router')
const router = new Router()

const verifyToken = require('../config/verifyToken')

const usersController = require('../controllers/usersController')

router.get('/userinfo/:id', usersController.getUser)

router.post('/signup', usersController.signup)

router.post('/login', usersController.login)

router.put('/userinfo/:id', verifyToken, usersController.updateUser)

router.put('/userinfo/sensitiveupdate/:id', verifyToken, usersController.updateUserSecurely)

router.delete('/userinfo/:id', verifyToken, usersController.deleteUser)

module.exports = router
