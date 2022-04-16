import {
    Entity as TOEntity,
    Column,
    Index,
    ManyToOne,
    OneToMany,
    JoinColumn,
    BeforeInsert,
    AfterLoad
} from 'typeorm'

import { Expose, Exclude } from 'class-transformer'

import Entity from './Entity'
import { User, Comment, Subs, Vote } from './index'

import { makeId, slugify } from '../utils/helpers'

@TOEntity('posts')
export default class Post extends Entity {
    @Index()
    @Column()
    identifier: string //7 character id

    @Column()
    title: string

    @Index()
    @Column()
    slug: string

    @Column({ nullable: true, type: 'text' })
    body: string

    @Column()
    subName: string

    @Column()
    username: string

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @ManyToOne(() => Subs, sub => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
    sub: Subs

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[]

    @Exclude()
    @OneToMany(() => Vote, vote => vote.post)
    votes: Vote[]

    @Expose() get url(): string {
        return `/r/${this.subName}/${this.identifier}/${this.slug}`
    }

    @Expose() get commentCount(): number {
        return this.comments?.length
    }

    // get votes
    @Expose() get voteScore(): number {
        return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0)
    }

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

    // protected url: string

    // @AfterLoad()
    // createFields() {
    //     this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`
    // }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7)
        this.slug = slugify(this.title)
    }
}
