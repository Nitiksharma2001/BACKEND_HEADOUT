import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { userRouter } from './routes/user.js'
import { collectionsRouter } from './routes/collections.js'
import { authentication } from './middlewares/user.js'

const PORT = process.env.PORT || 3000
const DATABASE_CONNECTION_URL = process.env.DATABASE_CONNECTION_URL

const app = express()
async function connectDb() {
  await mongoose.connect(DATABASE_CONNECTION_URL + '/headout')
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL) // Update with frontend URL
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
  })

  app.use(cors())
  app.use(express.json())
  
  app.use('/user', userRouter)
  app.use('/game', authentication, collectionsRouter)

  app.listen(PORT, () => console.log('listening to PORT', PORT))
}

connectDb()
