import { userModel } from '../models/user.js'

export async function authentication(req, res, next) {
  const { username } = req.headers
  const user = await userModel.findOne({ username })
  if (!user) {
    return res.json({ message: 'user does not exists', error: null })
  }
  req.info = user
  next()
}
