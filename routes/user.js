import { Router } from 'express'
import { userModel } from '../models/user.js'
import { scoreTillNow } from './helper/collections.js'

export const userRouter = Router()

userRouter.post('/', async (req, res) => {
  const { username } = req.body
  const existedUser = await userModel.findOne({ username })
  if (existedUser) {
    return res.json({ message: 'username already existed', error: null })
  }
  const newUser = await userModel.create({ username })
  res.json({ message: 'user created successfully', user: newUser, error: null })
})

userRouter.get('/:username', async (req, res) => {
  const { username } = req.params
  const existedUser = await userModel.findOne({ username })
  if (existedUser) {
    return res.json({ user: existedUser, error: null })
  }
  res.json({ message: 'user does not exists', error: null })
})

userRouter.get('/invitation/:username', async (req, res) => {
  const { username } = req.params
  const user = await userModel.findOne({ username })
  res.json({ score: await scoreTillNow(user._id, user.currentGameCycle) })
})
