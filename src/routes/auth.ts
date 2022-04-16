import { Router } from 'express'
import { auth as authorize, user } from '../middlewares/index'

const router = Router()
const { auth } = require('../controllers/index')

router.post('/login', auth.login)
router.get('/logout', authorize, auth.logout)
router.post('/new', auth.register)
router.get('/password/forgot', auth.forgotPassword)
router.put('/password/reset', auth.resetPassword)

router.get('/me', user, authorize, auth.getMyProfile)
router.put('/me', user, authorize, auth.updateProfile)
router.put('/me/password', authorize, auth.updatePassword)

router.get('/users', authorize, auth.getUsers)
router.get('/user/:id', authorize, auth.getUser)
router.put('/user/:id', authorize, auth.updateUser)
router.delete('/user/:id', authorize, auth.deleteUser)

export default router
