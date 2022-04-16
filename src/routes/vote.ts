import { Router } from 'express'
import { auth as authorize } from '../middlewares/index'

const router = Router()
const { vote } = require('../controllers/index')

router.post('/new', authorize, vote.newVote)
router.get('/', authorize, vote.getVotes)

export default router
