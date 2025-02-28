import mongoose from 'mongoose'
const { Schema } = mongoose

const gameSchema = new Schema(
  {
    alias: String,
    name: String,
    clues: [String],
    funFacts: [String],
  },
  { timestamps: true }
)

export const gameModel = mongoose.model('game', gameSchema)
