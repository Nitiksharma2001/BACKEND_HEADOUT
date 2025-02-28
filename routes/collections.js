import { Router } from 'express'
import { gameModel } from '../models/game.js'
import { historyModel } from '../models/history.js'
import { userModel } from '../models/user.js'
import { notPlayedGames, scoreTillNow } from './helper/collections.js'

const [CORRECT_POINT, INCORRECT_POINT] = [10, -5]
export const collectionsRouter = Router()

collectionsRouter.get('/', async (req, res) => {
  const { _id: userId, currentGameCycle } = req.info
  const unplayedGames = await notPlayedGames(userId, currentGameCycle)
  res.json({ game: unplayedGames[Math.floor(Math.random() * unplayedGames.length)] })
})

collectionsRouter.post('/', async (req, res) => {
  const { _id: userId, currentGameCycle } = req.info
  const { alias, answer } = req.body

  const game = await gameModel.findOne({ alias })

  const history = await historyModel.create({
    userId,
    gameCycle: currentGameCycle,
    gameId: game._id,
    result: {
      score: game.name === answer ? CORRECT_POINT : INCORRECT_POINT,
      correct: game.name === answer,
    },
  })

  const uplayedGames = await notPlayedGames(userId, currentGameCycle)
  if (uplayedGames.length === 0) {
    const user = await userModel.findById(userId)
    user.currentGameCycle += 1
    await user.save()
  }

  res.json({ result: history.result })
})

collectionsRouter.get('/countries', async (req, res) => {
  const rows = await gameModel.find()

  res.json({ countries: rows.map((row) => row.name) })
})