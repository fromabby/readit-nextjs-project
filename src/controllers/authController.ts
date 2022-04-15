import { Request, Response } from 'express'
import { isEmpty, validate } from 'class-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import { User } from '../entities/index'

const mapErrors = (errors: Object[]) => {
    // let mappedErrors: any = {}

    // errors.forEach((e: any) => {
    //     const key = e.property
    //     const value = Object.entries(e.constraints)[0][1]

    //     mappedErrors[key] = value
    // })

    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1]
        return prev
    }, {})
}
exports.register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    try {
        //TODO: validate data
        let errors: any = {}
        const emailUser = await User.findOne({ where: { email } })
        const usernameUser = await User.findOne({ where: { username } })

        if (emailUser) errors.email = 'Email is already taken'
        if (usernameUser) errors.username = 'Username is already taken'

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                errors
            })
        }

        //TODO: create the user
        const user = new User()

        user.email = email
        user.username = username
        user.password = password

        errors = await validate(user)

        if (errors.length > 0) {
            return res.status(400).json(mapErrors(errors))
        }

        await user.save()

        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'something went wrong' })
    }
}

exports.login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    try {
        let errors: any = {}

        if (isEmpty(username)) errors.username = 'Username must not be empty'
        if (isEmpty(password)) errors.password = 'Password must not be empty'
        
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        const user = await User.findOne({ where: { username } })

        if (!user) return res.status(404).json({ username: 'User not found' })

        const passwordMatches = await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
            return res.status(401).json({ password: 'Password is incorrect' })
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET!)

        res.set(
            'Set-Cookie',
            cookie.serialize('token', token, {
                httpOnly: true, // not accessible by javascript
                secure: process.env.NODE_ENV === 'production', // accessed by https (false in dev mode since no SSL)
                sameSite: 'strict', // cookie should only come from the domain
                maxAge: Number(process.env.MAX_AGE), // valid for 3600 seconds = 1 hr
                path: '/' // where the cookie is valid, set to / so the cookie is valid everywhere
            })
        )

        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
}

exports.getMyProfile = (_: Request, res: Response) => {
    res.json(res.locals.user)
}

exports.logout = async (_: Request, res: Response) => {
    try {
        res.set(
            'Set-Cookie',
            cookie.serialize('token', '', {
                httpOnly: true, // not accessible by javascript
                secure: process.env.NODE_ENV === 'production', // accessed by https (false in dev mode since no SSL)
                sameSite: 'strict', // cookie should only come from the domain
                expires: new Date(0), // valid for 0, expire asap
                path: '/' // where the cookie is valid, set to / so the cookie is valid everywhere
            })
        )

        res.status(200).json({
            success: true,
            message: 'User has been logged out.'
        })
    } catch (error) {
        res.status(401).json({
            error: 'User is not logged in.'
        })
    }
}

exports.updateProfile = async (req: Request, res: Response) => {}

exports.updatePassword = async (req: Request, res: Response) => {}

exports.forgotPassword = async (req: Request, res: Response) => {}

exports.resetPassword = async (req: Request, res: Response) => {}

exports.getUsers = async (req: Request, res: Response) => {}

exports.getUser = async (req: Request, res: Response) => {}

exports.updateUser = async (req: Request, res: Response) => {}

exports.deleteUser = async (req: Request, res: Response) => {}
