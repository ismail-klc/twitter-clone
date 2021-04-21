const MessageModel = require('../models/MessageModel')
const Tweet = require('../models/TweetModel')

module.exports = (io, config) => {
  const client = config.database.redis.client
  const util = require('util')
  client.getAsync = util.promisify(client.get)

  var allClients = {};
  io.on('connection', function (socket) {
    console.log(`\n${Date(Date.now()).toLocaleString()}: yeni bir istemci bağlandı  ${socket.id}\n`);

    socket.emit('connection', null);

    // control user is online
    socket.on('isOnline', data => {
      
      let isOn = false
      for (const c of Object.keys(allClients)) {
        if (allClients[c] === data) {
          isOn = true
        }
      }
      socket.emit('isOn', {isOn,data})
    })

    // when user login, we save his/her email 
    socket.on('login', data => {
      let user = allClients[`${socket.id}`]

      if (user !== null) {
        allClients[`${socket.id}`] = data
      }
    })

    // an update on tweet
    socket.on('update tweet', async tweetId => {
      const tweet = await Tweet.findById(tweetId).populate({
        path:'creator',
        model:'User'
      })
      console.log("new tweet: ", tweet);
      socket.emit('update tweet', tweet)
    })

    // odaya katılma
    socket.on('join chat', data => {
      socket.join(data)
      console.log(`\n${socket.id} oda ${data} ya katıldı\n`);
    })


    // mesaj gönderme
    socket.on('data', data => {
      const newMessage = new MessageModel({
        creator: data.userId,
        roomId: data.roomId,
        message: data.message
      })

      newMessage.save().then(newData => {
        console.log(newData);

        io.to(data.roomId).emit('message', newData)
      })
    })

    // tweet ekleme
    socket.on('add tweet', data => {
      console.log("eklenen tweet");
      console.log(data);
      io.emit('add tweet', data)
    })

    socket.on('disconnect', function (data) {
      delete allClients[`${socket.id}`]
      console.log(`\n${Date(Date.now()).toLocaleString()}: istemci ayrıldı\n`);
    });
  });
}