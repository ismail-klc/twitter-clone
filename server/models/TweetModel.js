const mongoose = require('mongoose')

const TweetSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    liked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type:{
        type:String
    },
    reTweeted: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }, { versionKey: false })

var deepPopulate = require('mongoose-deep-populate')(mongoose);
TweetSchema.plugin(deepPopulate)

const Tweet = mongoose.model('Tweet', TweetSchema)

module.exports = Tweet