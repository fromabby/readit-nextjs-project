import { Request, Response } from 'express'

import { Comment, Post } from '../entities/index'

exports.createComment = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params
    const { body } = req.body

    try {
        const user = res.locals.user
        const post = await Post.findOneOrFail({ where: { identifier, slug } })

        const comment = new Comment()

        comment.body = body
        comment.user = user
        comment.post = post

        await comment.save()

        res.json(comment)
    } catch (error) {
        res.status(500).json({ error: 'Comment cannot be posted' })
    }
}

exports.getMyComments = async (req: Request, res: Response) => {}

exports.getMyComment = async (req: Request, res: Response) => {}

exports.updateMyComment = async (req: Request, res: Response) => {}

exports.deleteMyComment = async (req: Request, res: Response) => {}

exports.getComments = async (req: Request, res: Response) => {}

exports.getComment = async (req: Request, res: Response) => {}
