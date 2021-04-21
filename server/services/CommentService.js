const Comment = require('../models/CommentModel')
const User = require('../models/UserModel')
const Tweet = require('../models/TweetModel')

class CommentService {

    async addComment(comment,userId,tweetId){
        const userComment = new Comment({
            comment,
            creator:userId,
            tweet:tweetId
        })
        console.log(comment,userId,tweetId);

        await userComment.save()

        const user = await User.findById(userId)
        await user.commentsCreated.push(userComment)
        await user.save()

        const tweet = await Tweet.findById(tweetId)
        await tweet.comments.push(userComment)
        await tweet.save()
       
        return userComment
    }
    
    
}

module.exports = CommentService