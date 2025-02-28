import { Router } from 'express'
import { userModel } from '../models/user.js'
import { scoreTillNow } from './helper/collections.js'

export const homeRouter = Router()

homeRouter.get('/:friendUserName', async (req, res) => {
  const { _id: userId, currentGameCycle } = req.info
  const { friendUserName } = req.params

  const friend = await userModel.findOne({ username: friendUserName })

  const friendScore = friendUserName ? await scoreTillNow(friend._id, friend.currentGameCycle) : 0
  const selfScore = await scoreTillNow(userId, currentGameCycle)

  res.json({ friendScore, selfScore })
})
