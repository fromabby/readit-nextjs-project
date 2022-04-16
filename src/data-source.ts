import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User, Post, Subs, Comment, Vote } from './entities/index'

export const connectionSource = new DataSource({
    migrationsTableName: 'migrations',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'twice',
    database: 'readit',
    synchronize: true,
    logging: true,
    entities: [User, Post, Subs, Comment, Vote],
    migrations: [],
    subscribers: []
})
