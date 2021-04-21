const mongoose = require('mongoose')

const BookmarkSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tweets: [{
        tweet : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet'
        },
        date: {
            type:Date,
            default:Date.now
        }
    }],
} ,{ versionKey: false })


const Bookmark = mongoose.model('Bookmark', BookmarkSchema)

module.exports = Bookmark