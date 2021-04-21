const mongoose = require('mongoose')

const ChatRoomSchema = mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps:true}, { versionKey: false })

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema)

module.exports = ChatRoom