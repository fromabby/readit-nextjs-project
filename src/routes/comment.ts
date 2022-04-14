import { Router } from 'express'
import { auth as authorize } from '../middlewares/index'

const router = Router()
const { comment } = require('../controllers/index')

router.post('/:identifier/:slug/comments', authorize, comment.createComment)
router.get('/me/comments', authorize, comment.getMyComments)
router.get('/me/:id', authorize, comment.getMyComment)
router.put('/me/:id', authorize, comment.updateMyComment)
router.delete('/me/:id', authorize, comment.deleteMyComment)

router.get('/comments', comment.getComments)
router.get('/:id', comment.getComment)

export default router
