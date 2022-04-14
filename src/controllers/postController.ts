import { Request, Response } from 'express'

import { Post, Subs } from '../entities/index'

exports.createPost = async (req: Request, res: Response) => {
    const { title, body, subName } = req.body

    const user = res.locals.user

    if (title.trim() === '') {
        return res.status(400).json({
            error: 'Title must not be empty'
        })
    }

    try {
        const sub = await Subs.findOneOrFail({ where: { name: subName } })

        const post = new Post()

        post.title = title
        post.body = body
        post.user = user
        post.subName = sub.name

        await post.save()

        return res.json(post)
    } catch (error) {
        return res.status(500).json({
            error: 'cannot post'
        })
    }
}

exports.getMyPosts = async (req: Request, res: Response) => {}

exports.getMyPost = async (req: Request, res: Response) => {}

exports.getPosts = async (req: Request, res: Response) => {}

exports.getPost = async (req: Request, res: Response) => {}

exports.updatePost = async (req: Request, res: Response) => {}

exports.deletePost = async (req: Request, res: Response) => {}