import { gameModel } from "../../models/game.js"
import { historyModel } from "../../models/history.js"

export async function scoreTillNow(userId, currentGameCycle) {
  const gamesOfUser = await historyModel.find({
    userId,
    gameCycle: currentGameCycle,
  })

  if (gamesOfUser.length === 0) return 0
  return gamesOfUser.reduce((acc, curr) => acc + curr.result.score, 0)
}

export async function notPlayedGames(userId, currentGameCycle) {

  const gamesPlayed = await historyModel.find({ userId, gameCycle: currentGameCycle })
  const gamePlayedIds = gamesPlayed.map((game) => game.gameId)
  return await gameModel.find({ _id: { $nin: gamePlayedIds } }).select('clues alias')
}
