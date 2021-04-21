const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cover : {
        type:String,
        default: 'https://lh3.googleusercontent.com/proxy/dVtYfiZHYBdkjjuikUIYIHZEN_oczToDeHuGLIzEu6GIWfyV4aptgJMnOIAT81gWgEsrHnL7CVUUcGIwqZ2kYTPx2FnzVVEp07urfkwEE1WYLbFIGPF2aevFTSNR'
    },
    avatar: {
        type:String,
        default:'http://cdn.onlinewebfonts.com/svg/img_264570.png'
    },
    bio: {
        type:String
    },
    tweetsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    tweetsLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    commentsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    reTweets: [{
        tweet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true }, { versionKey: false })

const User = mongoose.model('User', UserSchema)

module.exports = User