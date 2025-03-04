import { Router } from 'express'
import { userModel } from '../models/user.js'
import { ObjectId } from 'mongoose'

export const userRouter = Router()

const getUserIdsFromUsernames = async (userNames) => {
  const userList = await Promise.all(userNames.map((username) => userModel.findOne({ username })))
  const friendsIds = userList.filter((user) => user).map((user) => user._id)
  return friendsIds
}

userRouter.get('/exists/:username', async (req, res) => {
  const { username } = req.params
  const existedUser = await userModel.findOne({ username })
  return res.json({
    exists: existedUser ? true : false,
    message: `user ${existedUser ? '' : "doesn't "}exists`,
    error: null,
  })
})

userRouter.post('/', async (req, res) => {
  const { username, friendsUsernames } = req.body

  const friendIds = await getUserIdsFromUsernames(friendsUsernames)

  // if the username already existed, update the username with new friends
  const existedUser = await userModel.findOne({ username })
  if (existedUser) {
    existedUser.friends = Array.from(
      new Set([
        ...existedUser.friends.map((id) => id.toString()),
        ...friendIds.map((id) => id.toString()),
      ])
    ).map((id) => {
      new ObjectId(id)
    })
    existedUser.save()

    return res.json({
      message: 'updated user with new friends',
      user: existedUser,
      error: null,
    })
  }

  // if the username not already existed, create username with new friends
  const newUser = await userModel.create({ username, friends: friendIds })
  res.json({ message: 'user created successfully', user: newUser, error: null })
})

userRouter.get('/:username', async (req, res) => {
  const { username } = req.params
  const existedUser = await userModel.findOne({ username })
  if (existedUser) {
    return res.json({ user: existedUser, message: 'signin successfully', error: null })
  }
  res.json({ message: 'user does not exists', error: null })
})
