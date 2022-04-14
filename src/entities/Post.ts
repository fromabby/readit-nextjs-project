import {
    Entity as TOEntity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    BeforeInsert
} from 'typeorm'
import { makeId, slugify } from '../utils/helpers'

import Entity from './Entity'
import { User, Subs } from './index'

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

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @ManyToOne(() => Subs, sub => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
    sub: Subs

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7)
        this.slug = slugify(this.title)
    }
}
