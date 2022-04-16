import {
    Entity as TOEntity,
    Column,
    Index,
    BeforeInsert,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { Exclude } from 'class-transformer'

import Entity from './Entity'
import { Post, User, Comment } from './index'

@TOEntity('votes')
export default class Vote extends Entity {
    @Column()
    value: number

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username'})
    user: User

    @Index()
    @Column()
    username: string

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'postId', referencedColumnName: 'id'})
    post: Post

    @Index()
    @Column({ nullable: true })
    postId: number

    @ManyToOne(() => Comment)
    @JoinColumn({ name: 'commentIdentifier', referencedColumnName: 'id'})
    comment: Comment

    @Index()
    @Column({ nullable: true })
    commentIdentifier: string
}
