import { Router } from 'express'
import { auth as authorize, user } from '../middlewares/index'

const router = Router()
const { subs } = require('../controllers/index')

router.post('/new', user, authorize, subs.createSub)
router.get('/me/subs', authorize, subs.getMySubs)
router.get('/me/:id', authorize, subs.getMySub)

router.get('/subs', user, authorize, subs.getSubs)
router.get('/:name', user, subs.getSub)
router.put('/:id', authorize, subs.updateSub)
router.delete('/:id', authorize, subs.deleteSub)

export default router
