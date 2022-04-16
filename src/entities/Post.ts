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

import { Expose } from 'class-transformer'
 
import Entity from './Entity'
import { User, Comment, Subs } from './index'

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

    @Expose() get url(): string {
        return `/r/${this.subName}/${this.identifier}/${this.slug}`
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
