const express = require('express');
const router = express.Router();

const googleRoute = require('./google')

module.exports = (params) => {

  router.use('/google', googleRoute())

  router.get('/logout', (req,res) => {
    req.logout()
    return res.redirect('https://localhost:4200')
  })  

  return router;
};