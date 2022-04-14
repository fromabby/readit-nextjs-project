import "reflect-metadata"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import express from 'express'
import morgan from 'morgan'

import authRoutes from './routes/auth'
import trim from './middleware/trim'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => res.send('Hello world'))

app.listen(5000, async () => {
    console.log('server running at http://localhost:5000')

    try{
        await AppDataSource.initialize()
    } catch (err) {
        console.log(err)
    }
})