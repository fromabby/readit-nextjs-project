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
import { Post, Vote } from './index'

@TOEntity('users')
export default class User extends Entity {
    @Index()
    @IsEmail(undefined, { message: 'Must be a valid email address'})
    @Length(1, 255, { message: 'Email is empty' })
    @Column({ unique: true })
    email: string

    @Index()
    @Length(6, 255, { message: 'Must be at least 6 characters long' })
    @Column({ unique: true })
    username: string

    @Exclude()
    @Column()
    @Length(6, 255, { message: 'Must be at least 6 characters' })
    password: string

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @OneToMany(() => Vote, vote => vote.user)
    votes: Vote[]
    
    @BeforeInsert()
    async hashPasword() {
        this.password = await bcrypt.hash(this.password, 6)
    }
}
