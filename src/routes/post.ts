import { Router } from 'express'
import { auth as authorize } from '../middlewares/index'

const router = Router()
const { post } = require('../controllers/index')

router.post('/new', authorize, post.createPost)
router.get('/me/posts', authorize, post.getMyPosts)
router.get('/me/:id', authorize, post.getMyPost)

router.get('/posts', authorize, post.getPosts)
router.get('/:id', authorize, post.getPost)
router.put('/:id', authorize, post.updatePost)
router.delete('/:id', authorize, post.deletePost)

export default router
