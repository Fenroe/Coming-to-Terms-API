const Router = require('express-promise-router')
const router = new Router()

const { authenticateJwt } = require('../auth')
const { articlesController } = require('../controllers')

router.get('/info/:articleId', articlesController.getArticle)
router.get('/all', articlesController.getAllArticles)
router.get('/user-article/:articleId', authenticateJwt(), articlesController.getUserArticle)
router.get('/all-user', authenticateJwt(), articlesController.getAllUserArticles)

router.post('/new', authenticateJwt(), articlesController.createArticle)

router.put('/update-title/:articleId', authenticateJwt(), articlesController.updateTitle)
router.put('/update-subtitle/:articleId', authenticateJwt(), articlesController.updateSubtitle)
router.put('/update-content/:articleId', authenticateJwt(), articlesController.updateContent)
router.put('/update-cover-image/:articleId', authenticateJwt(), articlesController.updateCoverImage)
router.put('/update-tags/:articleId', authenticateJwt(), articlesController.updateTags)
router.put('/publish/:articleId', authenticateJwt(), articlesController.publishArticle)
router.put('/unpublish/:articleId', authenticateJwt(), articlesController.unpublishArticle)
router.put('/update/:articleId', authenticateJwt(), articlesController.updateArticle)

router.delete('/delete/:articleId', authenticateJwt(), articlesController.deleteArticle)

module.exports = router
