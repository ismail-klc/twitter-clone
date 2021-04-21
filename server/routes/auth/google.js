const express = require('express');
const router = express.Router();
const passport = require('passport')

module.exports = (params) => {

  router.get('/', passport.authenticate('google', {scope:['profile','email']}))

  router.get('/callback', passport.authenticate('google'), (req,res,next) => {
      res.redirect('https://localhost:4200')
  })

  return router;
};
