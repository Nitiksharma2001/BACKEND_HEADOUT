import mongoose from 'mongoose'
const { Schema } = mongoose

const historySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    gameId: { type: Schema.Types.ObjectId, ref: 'game' },
    gameCycle: { type: Number, default: 0 },
    result: {
      score: Number,
      correct: Boolean
    },
  },
  { timestamps: true }
)

export const historyModel = mongoose.model('history', historySchema)
