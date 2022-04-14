import {
    Entity as TOEntity,
    Column,
    Index,
    BeforeInsert,
    OneToMany
} from 'typeorm'
import { IsEmail, Length } from 'class-validator'
import { Exclude } from 'class-transformer'
import bcrypt from 'bcrypt'

import Entity from './Entity'
import { Post } from './index'
@TOEntity('users')
export default class User extends Entity {
    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string

    @Index()
    @Length(6, 255, { message: 'Username must be at least 6 characters long' })
    @Column({ unique: true })
    username: string

    @Exclude()
    @Column()
    @Length(6, 255, { message: 'Password must be more than 6 characters' })
    password: string

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @BeforeInsert()
    async hashPasword() {
        this.password = await bcrypt.hash(this.password, 6)
    }
}
