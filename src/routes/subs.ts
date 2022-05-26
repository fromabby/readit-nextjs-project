import { Router } from 'express'
import { auth as authorize, user } from '../middlewares/index'
import { Request, Response } from 'express'

import multer, { FileFilterCallback } from 'multer'
import { makeId } from '../utils/helpers'
import path from 'path'

const upload = multer({
    storage: multer.diskStorage({
        destination: 'public/images',
        filename: (_, file: any, callback) => {
            const name = makeId(15)

            callback(null, `${name}${path.extname(file.originalname)}`)
        },
    }),
    fileFilter: (_, file: any, callback: FileFilterCallback) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            callback(null, true)
        } else {
            callback(new Error('File not an image'))
        }
    },
})

const router = Router()
const { subs } = require('../controllers/index')

router.post('/new', user, authorize, upload.single('image'), subs.createSub)
router.get('/me/subs', authorize, subs.getMySubs)
router.get('/me/:id', authorize, subs.getMySub)

router.get('/subs', user, authorize, subs.getSubs)
router.get('/:name', user, subs.getSub)
router.put(
    '/:name',
    user,
    authorize,
    subs.ownSub,
    upload.single('image'),
    subs.updateSub
)
router.delete('/:id', authorize, subs.deleteSub)

export default router
