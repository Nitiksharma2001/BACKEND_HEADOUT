import { gameModel } from '../../models/game.js'
import { historyModel } from '../../models/history.js'
import { userModel } from '../../models/user.js'

export async function scoreTillNow(userId) {
  const { currentGameCycle } = await userModel.findById(userId)
  const gamesOfUser = await historyModel.find({
    userId,
    gameCycle: currentGameCycle,
  })
  return gamesOfUser.reduce((acc, curr) => acc + curr.result.score, 0)
}

export async function notPlayedGames(userId) {
  const { currentGameCycle } = await userModel.findById(userId)
  const gamePlayedIds = await historyModel
    .find({ userId, gameCycle: currentGameCycle })
    .select('_id')
  return await gameModel.find({ _id: { $nin: gamePlayedIds } }).select('clues alias')
}
