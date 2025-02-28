import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    currentGameCycle: { type: Number, default: 1 },
  },
  { timestamps: true }
)

export const userModel = mongoose.model('user', userSchema)
