import { Request, Response } from 'express'
import { connectionSource } from '../data-source'

import { User, Post, Comment, Vote } from '../entities/index'

exports.newVote = async (req: Request, res: Response) => {
    const { identifier, slug, commentId, value } = req.body

    //validate the value
    if (![-1, 0, 1].includes(value))
        return res.status(500).json({ value: 'value must be -1, 0, or 1' })

    try {
        const user: User = res.locals.user

        let post = await Post.findOneOrFail({ where: { identifier, slug } })

        let vote: Vote | null
        let comment: Comment | null | undefined

        // my custom code
        const { username } = user

        if (commentId) {
            //IF there is a comment identifier, then find vote by comment
            comment = await Comment.findOneOrFail({
                where: { id: commentId }
            })

            vote = await Vote.findOne({
                where: { username, commentIdentifier: commentId }
            })
        } else {
            // ELSE find vote by post
            vote = await Vote.findOne({
                where: { username, postId: post.id }
            })

            // console.log(post.id)
            // vote = await connectionSource
            //     .getRepository(Vote)
            //     .createQueryBuilder('post')
            //     .where('post.id = :id', { id: post.id })
            //     .andWhere('username = :username', { username })
            //     .getOne()
        }

        if (!vote && value === 0) {
            // if no vote, and value = 0, return error
            return res.status(404).json({ error: 'vote not found' })
        } else if (!vote) {
            vote = new Vote()

            vote.user = user
            vote.value = value

            if (comment) vote.comment = comment
            else vote.post = post

            await vote.save()
        } else if (value === 0) {
            // reset vote, if vote exists, and value = 0, remove vote from database
            await vote.remove()
        } else if (vote.value !== value) {
            // IF vote and value has changed, update vote
            vote.value = value

            await vote.save()
        }

        post = await Post.findOneOrFail({
            where: { identifier, slug },
            relations: ['comments', 'comments.votes', 'votes', 'sub']
        })

        post.setUserVote(user)
        post.comments.forEach(comment => comment.setUserVote(user))

        return res.json({ post })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong' })
    }
}

exports.getVotes = async (req: Request, res: Response) => {
    try {
        const votes = await Vote.find({
            order: { createdAt: 'DESC' }
        })

        res.json({
            success: true,
            votes
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}
