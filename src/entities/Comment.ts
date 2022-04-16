import {
    Entity as TOEntity,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    Index,
    OneToMany
} from 'typeorm'

import Entity from './Entity'
import { User, Post, Vote } from './index'

import { makeId } from '../utils/helpers'
import { Exclude } from 'class-transformer'

@TOEntity('comments')
export default class Comment extends Entity {
    @Index()
    @Column()
    identifier: string
    
    @Column()
    body: string

    @Column()
    username: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @ManyToOne(() => Post, post => post.comments, { nullable: false })
    post: Post

    @Exclude()
    @OneToMany(() => Vote, vote => vote.comment)
    votes: Vote[]

    protected userVote: number
    setUserVote(user: User) {
        const index = this.votes?.findIndex(
            vote => vote.username === user.username
        )

        this.userVote =
            index > -1 // it exists
                ? this.votes[index].value
                : 0
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(8)
    }
}
