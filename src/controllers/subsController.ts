import { Request, Response } from 'express'
import { isEmpty } from 'class-validator'
import { connectionSource } from '../data-source'

import { User, Subs } from '../entities/index'

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
            error
        })
    }
}

exports.getMySubs = async (req: Request, res: Response) => {}

exports.getMySub = async (req: Request, res: Response) => {}

exports.getSubs = async (req: Request, res: Response) => {}

exports.getSub = async (req: Request, res: Response) => {}

exports.updateSub = async (req: Request, res: Response) => {}

exports.deleteSub = async (req: Request, res: Response) => {}
