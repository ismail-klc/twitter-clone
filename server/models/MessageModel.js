const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required:true
    },
    message: {
        type: String,
        required:true
    },
},{timestamps:true}, { versionKey: false })

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message