const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const shortid = require('shortid')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(path.dirname(__dirname), '../uploads'))
  },
  filename: (req, file, cb) => {
      cb(null, shortid.generate() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

module.exports = (params) => {

  const { tweetService, userService, config } = params

  const client = config.database.redis.client
  const util = require('util')
  client.getAsync = util.promisify(client.get)

  router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
      
      const followings = await userService.getFollowings(req.user.email) 
      return res.json({
        name: req.user.name,
        userId: req.user._id,
        isAuth: req.isAuthenticated(),
        email: req.user.email,
        avatar: req.user.avatar,
        cover: req.user.cover,
        followings: followings
      })
    }

    return res.json({ isAuth: req.isAuthenticated() })

  })

  router.get('/getallusers', async (req,res,next) => {
    if (!req.user) {
      next()
    }
    try {
      const users = await userService.getAllUsers(req.user._id)
      return res.json({users})
    } catch (error) {
      return next(error)
    }
  })

  // get user detail by email
  router.get('/detail/:email', async (req,res,next) => {
    const {email} = req.params

    try {
      const user = await userService.getUserDetail(email)
      return res.json({user:user})
      
    } catch (error) {
      return next(error)
    }
  })

  // add tweet to bookmark or remove it from bookmark
  router.post('/bookmark', async (req,res,next) => {
    try {
      await userService.addBookmark(req.user._id, req.body.tweetId)
      return res.json({msg:"operation success"})
    } catch (err) {
      return next(err)
    }
  })

  // get bookmarked tweets
  router.get('/bookmarks', async (req,res,next) => {
    try {
      const bookmarks = await userService.getBookmarks(req.user._id)
      return res.json({bookmarks})
    } catch (error) {
      return next(error)
    }
  })

  // edit profile
  router.post('/edit', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req,res,next) => {
    const {bio} = req.body
    const cover = req.files.cover ? req.files.cover[0].filename : null
    const avatar = req.files.avatar ? req.files.avatar[0].filename : null

    try {
      const user = await userService.editProfile(avatar, cover, bio, req.user._id)
      return res.status(200).json({user})

    } catch (err) {
      return next(err)
    }

  })

  // add tweet
  router.post('/tweet', upload.single('image'), async (req, res, next) => {
    const { message } = req.body
    const image = req.file ? req.file.filename : null

    try {
      await client.del((`${req.user.email}.tweets`))
      let tweet = await tweetService.addTweet(message,image, req.user._id)
      await userService.addTweet(req.user._id, tweet)

      return res.json({ tweet })
    }
    catch (err) {
      return next(err)
    }
  })

  // get user tweets by email
  router.get('/tweets/:email', async (req, res, next) => {
    const { email } = req.params

    try {
      // const cachedUserTweets = await client.getAsync(`${email}.tweets`)
      // if (cachedUserTweets) {
      //   return res.json({ tweets: JSON.parse(cachedUserTweets) })
      // }

      console.log("\ndatabaseden çekildi\n");
      const userTweets = await userService.getUserTweets(email)
      // client.set(`${email}.tweets`, JSON.stringify(userTweets))
      return res.json({ tweets: userTweets })
    }
    catch (err) {
      return next(err)
    }
  })

  // get liked tweets
  router.get('/likes/:email', async (req, res, next) => {
    const { email } = req.params

    try {
      const tweets = await userService.getLikedTweets(email)
      return res.json({ tweets })
    } catch (err) {
      return next(err)
    }
  })

  // follow someone
  router.post('/follow', async (req, res, next) => {
    const { followerEmail } = req.body
    const userId = req.user._id

    try {
      const user = await userService.addFollow(userId, followerEmail)
      return res.json({ user })
    } catch (err) {
      return next(err)
    }
  })

  // get followers and following users
  router.get('/followers/:email', async (req, res, next) => {
    const { email } = req.params

    try {
      const followers = await userService.getFollowers(email)
      const followings = await userService.getFollowings(email)

      return res.json({ followers, followings })
    } catch (err) {
      return next(err)
    }
  })

  return router;
};