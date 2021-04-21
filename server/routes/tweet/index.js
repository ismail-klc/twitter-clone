const express = require('express');
const router = express.Router();

module.exports = (params) => {

  const { tweetService, userService } = params

  // get all users tweets
  router.get('/', async (req, res) => {
    let tweets = await tweetService.getAllTweets(req.user._id)
    return res.json({tweets})
  })

  router.post('/inActive', async (req,res,ntext) => {
    try {
      const a = await tweetService.deleteTweet(req.body.tweetId)
      res.json({msg:'Tweet deleted'})
    } catch (err) {
      return next(err)
    }
  })

  // like or dislike tweet
  router.post('/liked', async (req,res,next) => {
    try {
      await userService.addLiked(req.user._id, req.body.tweetId)
      await tweetService.addLiked(req.user._id, req.body.tweetId)

    } catch (err) {
      return next(err)
    }
  })

  // retweet or cancel retweet
  router.post('/retweet', async (req,res,next) => {
    try {
      await userService.addRetweet(req.user._id, req.body.tweetId)
      await tweetService.addRetweet(req.user._id, req.body.tweetId)

    } catch (err) {
      return next(err)
    }
  })

  // get tweet by id
  router.get('/:tweetId', async (req, res) => {
    const tweet = await tweetService.getTweetById(req.params.tweetId)
    return res.json({tweet})
  })

  return router;
};