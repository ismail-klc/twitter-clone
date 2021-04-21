const express = require('express');
const router = express.Router();
const User = require('../../models/UserModel')
const ChatRoom = require('../../models/ChatRoomModel')
const Message = require('../../models/MessageModel')

module.exports = (params) => {

    router.post('/roomId', async (req, res) => {
        const { email1, email2 } = req.body

        const user1 = await User.findOne({ email: email1 })
        const user2 = await User.findOne({ email: email2 })

        const chatRoom = await ChatRoom.findOne({ users: { $all: [user1._id, user2._id] } })

        if (chatRoom) {
            return res.json({ chatRoom })
        }

        let newChatRoom = new ChatRoom()
        newChatRoom.users.push(user1._id)
        newChatRoom.users.push(user2._id)

        newChatRoom.save().then(chatRoom => {
            return res.json({ chatRoom })
        })
    })

    router.get('/list', async (req, res) => {

        let rooms = await ChatRoom.find({ users: { $in: [req.user._id] } })
            .populate({
                path: 'users',
                select: ['name', 'email']
            })

        for (const room of rooms) {
            const count = await Message.find({ roomId: room._id }).countDocuments()
            if (count === 0) {
                rooms = rooms.filter(r=> r._id !== room._id)
            }
        }

        return res.json({ rooms })
    })

    router.get('/:roomId', async (req, res) => {
        const { roomId } = req.params

        const messages = await Message.find({ roomId })
        return res.json({ messages })
    })



    return router;
};