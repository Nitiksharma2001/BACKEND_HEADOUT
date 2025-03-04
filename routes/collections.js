import { Router } from 'express'
import { gameModel } from '../models/game.js'
import { historyModel } from '../models/history.js'
import { userModel } from '../models/user.js'
import { notPlayedGames, scoreTillNow } from './helper/collections.js'

const [CORRECT_POINT, INCORRECT_POINT] = [10, -5]

export const collectionsRouter = Router()

collectionsRouter.get('/', async (req, res) => {
  const { _id: userId } = req.info
  const unplayedGames = await notPlayedGames(userId)
  const randomIndex = Math.floor(Math.random() * unplayedGames.length)
  res.json({ game: unplayedGames[randomIndex], message: 'new game' })
})

collectionsRouter.get('/score', async (req, res) => {
  const { _id: userId, friends } = req.info

  const selfScore = await scoreTillNow(userId)
  const friendsList = await Promise.all(friends.map((friend) => userModel.findById(friend._id)))
  const friendsScore = await Promise.all(
    friendsList.map(async ({_id, username}) => {
      return {
        score: await scoreTillNow(_id),
        username,
      }
    })
  )
  res.json({ friendsScore, selfScore })
})

collectionsRouter.post('/', async (req, res) => {
  const { _id: userId, currentGameCycle } = req.info
  const { alias, answer } = req.body

  const game = await gameModel.findOne({ alias })

  if(!game){
    return res.json({ message: 'invalid game' })
  }

  const history = await historyModel.create({
    userId,
    gameCycle: currentGameCycle,
    gameId: game._id,
    result: {
      score: game.name === answer ? CORRECT_POINT : INCORRECT_POINT,
      correct: game.name === answer,
    },
  })

  const uplayedGames = await notPlayedGames(userId)
  if (uplayedGames.length === 0) {
    const user = await userModel.findById(userId)
    user.currentGameCycle += 1
    await user.save()
  }

  res.json({ result: history.result, funFacts: game.funFacts })
})

collectionsRouter.get('/countries', async (req, res) => {
  const rows = await gameModel.find().distinct('name')
  res.json({ countries: rows })
})