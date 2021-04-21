const User = require('../models/UserModel')
const Fallowing = require('../models/FallowingModel')
const Fallower = require('../models/FallowerModel')
const Bookmark = require('../models/BookmarkModel')
const Tweet = require('../models/TweetModel')

class UserService {

    async addTweet(userId, tweet) {
        User.findById(userId).then(user => {
            user.tweetsCreated.push(tweet)
            return user.save()
        })
    }

    async getUserDetail(email) {
        const user = await User.findOne({ email })
        return user
    }

    async editProfile(avatar, cover, bio, userId) {
        User.findById(userId).then(user => {
            user.avatar = avatar ? avatar : user.avatar
            user.cover = cover ? cover : user.cover
            user.bio = bio ? bio : user.bio
            return user.save()
        })
    }

    // get user tweets
    async getUserTweets(email) {
        const user = await User.findOne({ email: email })
        let retweets = user.reTweets
        const tweets = [] 

        for (const tweet of user.tweetsCreated) {
            if (tweet !== null) {
                const newTweet = await Tweet.findById(tweet).populate({
                    path: 'creator',
                    select: ['name','avatar','email']
                })
                newTweet.type = "tweet"
                newTweet.isActive && tweets.push(newTweet)
            }
        }

        for (const tweet of retweets) {
            const newTweet = await Tweet.findById(tweet.tweet).populate({
                path: 'creator',
                select: ['name','avatar','email']
            })
            newTweet.type = "retweet"
            newTweet.isActive && tweets.push(newTweet)
        }

        await Tweet.populate(tweets, {path:'reTweeted.user', select: ['name', 'email', 'avatar']})

        return tweets
            .sort(function (a, b) {
                return new Date(b.type === "retweet" ? b.reTweeted[b.reTweeted.length - 1].date : b.createdAt) -
                    new Date(a.type === "retweet" ? a.reTweeted[a.reTweeted.length - 1].date : a.createdAt)
            })
    }

    async addLiked(userId, tweetId) {
        const user = await User.findById(userId)

        if (user.tweetsLiked.includes(tweetId)) {
            console.log("user disliked tweet");
            user.tweetsLiked.pull(tweetId)
        }
        else {
            console.log("User liked tweet");
            user.tweetsLiked.push(tweetId)
        }

        return user.save()
    }

    async addRetweet(userId, tweetId) {
        const user = await User.findById(userId)
        let include = false

        for (const a of user.reTweets) {
            if (a.tweet.toString() === tweetId.toString()) {
                include = true
            }
        }

        if (include) {
            console.log("user toggle retweet");
            User.findOneAndUpdate({ _id: userId }, { $pull: { reTweets: { tweet: tweetId } } }, function (err, data) {
                console.log(err, data);
            })
        }
        else {
            console.log("User retweet");
            User.findOneAndUpdate({ _id: userId }, { $push: { reTweets: { tweet: tweetId } } }, function (err, data) {
                console.log(err, data);
            })
        }

        return user.save()
    }

    async getAllUsers(id) {
        const users = await User.find({ _id: { $nin: [id] } }).select('_id email name avatar')
        let returnedUsers = []
        for (var user of users) {
            const followers = await Fallower.findOne({ user: user._id }).populate('fallowers', ['email'])
            returnedUsers.push({
                user,
                followers: followers.fallowers
            })
        }
        return returnedUsers
    }

    async getLikedTweets(email) {
        const user = await User.findOne({ email }).populate({
            path: 'tweetsLiked',
            populate: {
                path: 'creator',
                select: ['avatar', 'email', 'name']
            },
            select: ['message', 'liked', 'creator', 'createdAt', 'image', 'reTweeted']
        })

        return user.tweetsLiked
    }

    async getBookmarks(userId) {
        const bookmark = await Bookmark.findOne({ user: userId })
            .populate({
                path: 'tweets.tweet',
                populate: {
                    path: 'creator'
                }
            })

        if (!bookmark) {
            return []
        }

        return bookmark.tweets.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date)
        })
    }

    async addBookmark(userId, tweetId) {
        let bookmark = await Bookmark.findOne({ user: userId })

        if (!bookmark) {
            bookmark = new Bookmark({ user: userId })
            await bookmark.save()
        }

        if (bookmark.tweets.some(a => a.tweet.toString() === tweetId.toString())) {
            console.log("remove bookmark");
            Bookmark.findOneAndUpdate({ user: userId }, { $pull: { tweets: { tweet: tweetId } } }, function (err, data) {
                console.log(err, data);
            })
        }
        else {
            console.log("add bookmark");
            Bookmark.findOneAndUpdate({ user: userId }, { $push: { tweets: { tweet: tweetId } } }, function (err, data) {
                console.log(err, data);
            })
        }
    }

    async addFollow(userId, followerEmail) {
        // add fallowing models
        const followingUser = await User.findOne({ email: followerEmail })
        const fallowingId = followingUser._id

        let user = await Fallowing.findOne({ user: userId })

        if (!user) {
            user = new Fallowing({ user: userId })
        }

        if (!user.fallowings.includes(fallowingId)) {
            user.fallowings.push(fallowingId)
        }
        else {
            user.fallowings.pull(fallowingId)
        }
        await user.save()

        // add fallower model
        let user2 = await Fallower.findOne({ user: fallowingId })

        if (!user2) {
            user2 = new Fallower({ user: fallowingId })
        }
        if (!user2.fallowers.includes(userId)) {
            user2.fallowers.push(userId)
        }
        else {
            user2.fallowers.pull(userId)
        }

        await user2.save()

        return user
    }

    async getFollowings(email) {
        const user = await User.findOne({ email })
        const userId = user._id

        const fallowing = await Fallowing.findOne({ user: userId })
            .populate('fallowings', ['email', 'name', 'avatar'])
            .select('fallowings')

        return fallowing
    }

    async getFollowers(email) {
        const user = await User.findOne({ email })
        const userId = user._id

        const fallowing = await Fallower.findOne({ user: userId })
            .populate('fallowers', ['email', 'name', 'avatar'])
            .select('fallowers')

        return fallowing
    }
}

module.exports = UserService