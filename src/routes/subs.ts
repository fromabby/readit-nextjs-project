import { Router } from 'express'
import { auth as authorize } from '../middlewares/index'

const router = Router()
const { subs } = require('../controllers/index')

router.post('/new', authorize, subs.createSub)
router.get('/me/subs', authorize, subs.getMySubs)
router.get('/me/:id', authorize, subs.getMySub)

router.get('/subs', authorize, subs.getSubs)
router.get('/:id', authorize, subs.getSub)
router.put('/:id', authorize, subs.updateSub)
router.delete('/:id', authorize, subs.deleteSub)

export default router
