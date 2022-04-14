import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./models/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "twice",
    database: "readit",
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
})
