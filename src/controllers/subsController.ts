import { NextFunction, Request, Response } from 'express'
import { isEmpty } from 'class-validator'
import { connectionSource } from '../data-source'
import fs from 'fs'

import { User, Subs, Post } from '../entities/index'

exports.createSub = async (req: Request, res: Response) => {
    const { name, title, description, type } = req.body

    let oldImageUrn: string = ''

    if (type !== 'image' && type !== 'banner') {
        if (req.file?.path) {
            fs.unlinkSync(req.file?.path)
        }
        return res.status(400).json({ error: 'Invalid type' })
    }

    const image = req.file?.filename || ''
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

        if (type === 'image') {
            oldImageUrn = sub.imageUrn || ''
            sub.imageUrn = image
        } else {
            oldImageUrn = sub.bannerUrn || ''
            sub.bannerUrn = image
        }

        await sub.save()

        if (oldImageUrn !== '') {
            fs.unlinkSync(`public\\images\\${oldImageUrn}`)
        }

        res.json(sub)
    } catch (error) {
        res.status(400).json({
            error,
        })
    }
}

exports.getMySubs = async (req: Request, res: Response) => {
    return res.json({
        message: 'Get ALL MY subs',
    })
}

exports.getMySub = async (req: Request, res: Response) => {
    return res.json({
        message: 'Get MY sub',
    })
}

exports.getSubs = async (req: Request, res: Response) => {
    return res.json({
        message: 'Get all subs',
    })
}

exports.getSub = async (req: Request, res: Response) => {
    const name = req.params.name

    try {
        const sub = await Subs.findOneOrFail({ where: { name } })
        const posts = await Post.find({
            where: { subName: sub.name },
            order: { createdAt: 'DESC' },
            relations: ['comments', 'votes'],
        })

        sub.posts = posts

        if (res.locals.user) {
            sub.posts.forEach((p) => p.setUserVote(res.locals.user))
        }

        return res.json(sub)
    } catch (error) {
        return res.status(404).json({ sub: 'Sub not found' })
    }
}

exports.ownSub = async (req: Request, res: Response, next: NextFunction) => {
    const user: User = res.locals.user

    try {
        const sub = await Subs.findOneOrFail({
            where: { name: req.params.name },
        })

        if (sub.username !== user.username) {
            return res.status(403).json({ error: 'You dont own this sub' })
        }

        res.locals.sub = sub

        return next()
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

exports.uploadSubImage = async (req: Request, res: Response) => {
    const sub: Subs = res.locals.sub

    try {
    } catch (error) {}

    return res.json({ success: true })
}

exports.updateSub = async (req: Request, res: Response) => {
    // check existing sub
    const sub = await Subs.findOneOrFail({ where: { name: req.params.name } })

    if (!sub) {
        return res.status(500).json({ error: 'Sub does not exist ' })
    }

    // get details
    const { title, description } = sub

    // update
    if (req.body.type !== 'image' && req.body.type !== 'banner') {
        if (req.file?.path) {
            fs.unlinkSync(req.file?.path)
        }
        return res.status(400).json({ error: 'Invalid type' })
    }

    let oldImageUrn: string = ''
    const image = req.file?.filename || ''

    try {
        let errors: any = {}

        if (Object.keys(errors).length > 0) throw errors

        sub.title = req.body.title ? req.body.title : title
        sub.description = req.body.description
            ? req.body.description
            : description
        sub.createdAt = sub.createdAt
        sub.updatedAt = new Date(Date.now())

        if (req.body.type === 'image') {
            oldImageUrn = sub.imageUrn || ''
            sub.imageUrn = image
        } else {
            oldImageUrn = sub.bannerUrn || ''
            sub.bannerUrn = image
        }

        await sub.save()

        if (oldImageUrn !== '') {
            fs.unlinkSync(`public/images/${oldImageUrn}`)
        }

        res.json(sub)
    } catch (error) {
        res.status(400).json({
            error,
        })
    }
}

exports.deleteSub = async (req: Request, res: Response) => {
    return res.json({
        message: 'Delete sub',
    })
}

exports.topSubs = async (_: Request, res: Response) => {
    try {
        const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn", 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y')`
        const subs = await connectionSource
            .createQueryBuilder()
            .select(
                `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
            )
            .from(Subs, 's')
            .leftJoin(Post, 'p', `s.name = p."subName"`)
            .groupBy('s.title, s.name, "imageUrl"')
            .orderBy(`"postCount"`, 'DESC')
            .limit(5)
            .execute()

        res.json(subs)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
}
