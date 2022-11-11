const Router = require('express-promise-router')
const router = new Router()

const { authenticateJwt } = require('../auth')

const profilesController = require('../controllers/profilesController')

router.get('/info/:username', profilesController.getProfile)
router.get('/all', profilesController.getAllProfiles)

router.post('/signup', profilesController.signup)
router.post('/login', profilesController.login)

router.put('/update-bio', authenticateJwt(), profilesController.updateBio)
router.put('/update-username', authenticateJwt(), profilesController.updateUsername)
router.put('/update-email', authenticateJwt(), profilesController.updateEmail)
router.put('/update-password', authenticateJwt(), profilesController.updatePassword)
router.put('/update-profile', authenticateJwt(), profilesController.updateProfile)
router.put('/update-credentials', authenticateJwt(), profilesController.updateCredentials)

router.delete('/close-account', authenticateJwt(), profilesController.closeAccount)

module.exports = router
