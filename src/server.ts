import 'reflect-metadata'
import { connectionSource } from './data-source'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// console.log(path.resolve(__dirname+'/.env'))
dotenv.config({ path: path.resolve(__dirname + '/.env') })

import { authRoutes, postRoutes, subsRoutes, commentRoutes } from './routes/index'
import { trim } from './middlewares/index'

const app = express()
const PORT = process.env.PORT
// const ENVIRONMENT = process.env.NODE_ENV


app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
}))

app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/subs', subsRoutes)
app.use('/api/comment', commentRoutes)

app.get('/', (_, res) => res.send('Hello world'))

app.listen(PORT, async () => {
    console.log(`server running at http://localhost:${PORT}`)

    try {
        await connectionSource.initialize()
    } catch (err) {
        console.log(err)
    }
})
