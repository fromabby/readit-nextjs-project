import { NextFunction, Request, Response } from 'express'
import { User } from '../entities/index'
import jwt from 'jsonwebtoken'

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies

        if (!token) return res.status(401).json({ error: 'unauthenticated' })

        const { username }: any = jwt.verify(token, process.env.JWT_SECRET!)

        const user = await User.findOne({ where: { username } })

        if (!user) return res.status(401).json({ error: 'unauthenticated' })

        res.locals.user = user

        return next()
    } catch (err) {
        return res.status(401).json({
            error: 'Unauthenticated'
        })
    }
}
