const Router = require('express-promise-router')
const router = new Router()

const { authenticateJwt } = require('../auth')

const { topicsController } = require('../controllers')

router.get('/info/:topicId', topicsController.getTopic)
router.get('/all', topicsController.getAllTopics)

router.post('/new', authenticateJwt(), topicsController.createTopic)

router.put('/update-name/:topicId', authenticateJwt(), topicsController.updateName)
router.put('/update-description/:topicId', authenticateJwt(), topicsController.updateDescription)

router.delete('/delete/:topicId', authenticateJwt(), topicsController.deleteTopic)

module.exports = router
