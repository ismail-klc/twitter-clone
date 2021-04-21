const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const https = require('https')
const socketIo = require("socket.io");
const fs = require('fs')
const compression = require('compression')
const http = require('http')


const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const auth = require('./lib/auth')

const TweetService = require('./services/TweetService')
const UserService = require('./services/UserService')
const CommentService = require('./services/CommentService')

module.exports = (config) => {
  const log = config.log();

  const tweetService = new TweetService()
  const userService = new UserService()
  const commentService = new CommentService()

  app.use('/public', express.static(path.join(__dirname, 'uploads')))
  app.use(cors({ credentials: true, origin: process.env.CLIENT }))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // const server = http.createServer(app)
  const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
  }, app)

  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT,
      methods: ["GET", "POST"]
    }
  });
  
  require('./sockets/index')(io,config)

  if (app.get('env') === 'development') {
    app.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  app.use(session({
    secret: 'This is a secret',
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      client: config.database.redis.client
    })
  }))

  app.use(compression());

  app.use(auth.initialize)
  app.use(auth.session)

  app.use('/', routes({ tweetService, userService, commentService, config, io }));

  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });

  return server;
};
