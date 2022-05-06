import { Request, Response } from 'express'
import { isEmpty } from 'class-validator'
import { connectionSource } from '../data-source'

import { User, Subs, Post } from '../entities/index'

exports.createSub = async (req: Request, res: Response) => {
    const { name, title, description } = req.body

    const user: User = res.locals.user

    try {
        let errors: any = {}

        if (isEmpty(name)) errors.name = 'Name must not be empty'
        if (isEmpty(title)) errors.title = 'title must not be empty'

        const subRecord = await connectionSource
            .getRepository(Subs)
            .createQueryBuilder('sub')
            .where('lower(sub.name) = :name', { name: name.toLowerCase() })
            .getOne()

        if (subRecord) errors.name = 'Sub already exists'

        if (Object.keys(errors).length > 0) throw errors

        const sub = new Subs()
        sub.title = title
        sub.description = description
        sub.name = name
        sub.user = user

        await sub.save()

        res.json(sub)
    } catch (error) {
        res.status(400).json({
            error,
        })
    }
}

exports.getMySubs = async (req: Request, res: Response) => {
    return res.json({
        message: 'Get ALL MY subs'
    })}

exports.getMySub = async (req: Request, res: Response) => {
    return res.json({
        message: 'Get MY sub'
    })}

exports.getSubs = async (req: Request, res: Response) => {
    return res.json({
        message: 'Get all subs'
    })}

exports.getSub = async (req: Request, res: Response) => {
    const name = req.params.name

    try {
        const sub = await Subs.findOneOrFail({ where: { name } })
        const posts = await Post.find({
            where: { subName: sub.name }, 
            order: { createdAt: 'DESC' },
            relations: ['comments', 'votes']
        })

        sub.posts = posts

        if(res.locals.user) {
            sub.posts.forEach(p => p.setUserVote(res.locals.user))
        }

        return res.json(sub)
    } catch (error) {
        return res.status(404).json({ sub: 'Sub not found' })
    }
}

exports.updateSub = async (req: Request, res: Response) => {
    return res.json({
        message: 'Update sub'
    })
}

exports.deleteSub = async (req: Request, res: Response) => {
    return res.json({
        message: 'Delete sub'
    })}
