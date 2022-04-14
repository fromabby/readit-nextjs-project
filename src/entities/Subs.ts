import {
    Entity as TOEntity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm'

import Entity from './Entity'
import { User, Post } from './index'

@TOEntity('subs')
export default class Subs extends Entity {
    @Index()
    @Column({ unique: true })
    name: string

    @Column()
    title: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ nullable: true })
    imageUrn: string

    @Column({ nullable: true })
    bannerUrn: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @OneToMany(() => Post, post => post.sub)
    posts: Post[]
}
