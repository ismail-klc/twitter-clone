const express = require('express');
const router = express.Router();

const authRoute = require('./auth')
const userRoute = require('./user')
const tweetRoute = require('./tweet')
const commentRoute = require('./comment')
const messageRoute = require('./message')

module.exports = (params) => {

  router.get('/', (req, res) => {
    res.json({ user: req.user })
  })

  router.use('/auth', authRoute())
  router.use('/user', userRoute(params))
  router.use('/tweets', tweetRoute(params))
  router.use('/comment', commentRoute(params))
  router.use('/message', messageRoute(params))

  return router;
};