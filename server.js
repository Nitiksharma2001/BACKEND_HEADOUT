import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { userRouter } from './routes/user.js'
import { collectionsRouter } from './routes/collections.js'
import { authentication } from './middlewares/user.js'
import { homeRouter } from './routes/home.js'
import { corsHeaders } from './middlewares/cors.js'

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

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }
    next()
  })

  app.use(
    cors({
      origin: ['http://localhost:5173', process.env.FRONTEND_URL], // Replace with your frontend URL
      methods: 'GET,POST,PUT,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
    })
  )
  app.use(express.json())
  app.use('/user', userRouter)
  app.use('/game', authentication, collectionsRouter)
  app.use('/home', authentication, homeRouter)

  app.listen(PORT, () => console.log('listening to PORT', PORT))
}

connectDb()
