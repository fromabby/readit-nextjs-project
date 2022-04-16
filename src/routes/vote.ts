import { Router } from 'express'
import { auth as authorize, user } from '../middlewares/index'

const router = Router()
const { vote } = require('../controllers/index')

router.post('/new', user, authorize, vote.newVote)
router.get('/', authorize, vote.getVotes)

export default router
