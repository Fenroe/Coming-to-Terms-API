const Router = require('express-promise-router')
const router = new Router()

const passport = require('../config/passport')

const profilesController = require('../controllers/profilesController')

router.get('/info/:username', profilesController.getProfile)
router.get('/all', profilesController.getAllProfiles)

router.post('/signup', profilesController.signup)
router.post('/login', profilesController.login)

router.put('/update-bio', passport.authenticate('jwt', { session: false }), profilesController.updateBio)
router.put('/update-username', passport.authenticate('jwt', { session: false }), profilesController.updateUsername)
router.put('/update-email', passport.authenticate('jwt', { session: false }), profilesController.updateEmail)
router.put('/update-password', passport.authenticate('jwt', { session: false }), profilesController.updatePassword)

router.delete('/close-account', passport.authenticate('jwt', { session: false }), profilesController.closeAccount)

module.exports = router
