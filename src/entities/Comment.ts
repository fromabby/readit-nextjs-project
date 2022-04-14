import {
    Entity as TOEntity,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert
} from 'typeorm'

import Entity from './Entity'
import { User, Post } from './index'

import { makeId } from '../utils/helpers'

@TOEntity('comments')
export default class Comment extends Entity {
    @Column()
    identifier: string
    
    @Column({ nullable: true, type: 'text' })
    body: string

    @Column()
    upvote: number

    @Column()
    downvote: number

    @Column()
    username: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @ManyToOne(() => Post, post => post.comments, { nullable: false })
    post: Post

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(8)
        this.upvote = 0
        this.downvote = 0
    }
}
