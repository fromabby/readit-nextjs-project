import "reflect-metadata"
import { DataSource } from "typeorm"

export const connectionSource = new DataSource({
    migrationsTableName: 'migrations',
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "twice",
    database: "readit",
    synchronize: true,
    logging: true,
    entities: ['src/models/*.ts'],
    migrations: [],
    subscribers: [],
})
