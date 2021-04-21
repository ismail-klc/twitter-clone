const Tweet = require('../models/TweetModel')
const Fallowing = require('../models/FallowingModel')
const User = require('../models/UserModel')
const mongoose = require('mongoose')

class TweetService {

    async addTweet(message, image, userId) {
        const tweet = new Tweet({
            message,
            image,
            creator: userId
        })

        return tweet.save().then(tweet =>
            tweet.populate({
                path: 'creator',
                select: ['avatar', 'name', 'email']
            }).execPopulate()
        )
    }

    async getAllTweets(userId) {
        // get user followings
        const users = await Fallowing.findOne({ user: userId })

        // get user followings and push it our userId
        // so, our tweets and our followings' tweets will be shown
        const follow = users.fallowings
        follow.push(userId)

        // get these users' tweets
        const tweetUser = await User.find().where('_id').in(follow)
            .populate('tweetsCreated')
            .populate('creator')
            .populate('reTweets.tweet')

        let tweets = []

        for (let user of tweetUser) {
            for (let tweet of user.tweetsCreated) {
                Tweet.populate(tweet, { path: 'creator', select: ['cover', 'avatar', 'name', 'email'] }).then(() => {
                    tweet.type = "tweet"
                    tweets.push(tweet)
                })
            }
            for (let tweet of user.reTweets) {
                Tweet.populate(tweet.tweet, { path: 'creator', select: ['cover', 'avatar', 'name', 'email'] }).then(() => {
                    let t = tweet.tweet
                    t.type = "retweet"
                    tweets.push(t)
                })
            }
        }

        const tweetler = await Tweet.find().populate('creator', ['name', 'email', 'avatar'])
            .populate('comments').populate('reTweeted.user')

        let newTweets = []

        for (const tweet of tweets) {
            if (newTweets.some(a => a._id === tweet._id && a.type === tweet.type) === false && tweet.isActive === true) {
                newTweets.push(tweet)
            }
        }

        await Tweet.populate(newTweets, {path:'reTweeted.user', select: ['name', 'email', 'avatar']})

        return newTweets
            .sort(function (a, b) {
                return new Date(b.type === "retweet" ? b.reTweeted[b.reTweeted.length - 1].date : b.createdAt) -
                    new Date(a.type === "retweet" ? a.reTweeted[a.reTweeted.length - 1].date : a.createdAt)
            })
    }

    async deleteTweet(tweetId) {
        const tweet = await Tweet.findById(tweetId)
        tweet.isActive = false
        return tweet.save()
    }

    async addLiked(user, tweetId) {
        const tweet = await Tweet.findById(tweetId)

        if (tweet.liked.includes(user)) {
            console.log("disliked tweet");
            tweet.liked.pull(user)
        }
        else {
            console.log("liked tweet");
            tweet.liked.push(user)
        }

        return tweet.save()
    }

    async addRetweet(user, tweetId) {
        const tweet = await Tweet.findById(tweetId)
        let include = false

        for (const a of tweet.reTweeted) {
            if (a.user.toString() === user.toString()) {
                include = true
            }
        }

        if (include) {
            console.log("retweet false");
            Tweet.findOneAndUpdate({ _id: tweetId }, { $pull: { reTweeted: { user: user } } }, function (err, data) {
                console.log(err, data);
                return data
            })
        }
        else {
            console.log("re tweet");
            Tweet.findOneAndUpdate({ _id: tweetId }, { $push: { reTweeted: { user: user } } }, function (err, data) {
                console.log(err, data);
                return data
            })
        }
    }

    async getTweetById(tweetId) {
        return Tweet.findById(tweetId)
            .populate({
                path: 'creator',
                select: ['name', 'email', 'avatar']
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'creator',
                    select: ['name', 'email', 'avatar']
                }
            })
    }
}

module.exports = TweetService