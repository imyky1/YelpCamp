const express = require('express')
const router = express.Router()
const catchasync = require('../utils/catchasync')
const passport = require('passport')
const {storesession} = require('../utils/middleware')
const user = require('../controllers/user')

router.route('/register')
  .get(user.renderRegister)
  .post(catchasync(user.createUser))

router.route('/login')
  .get(user.renderLogin)
  .post(storesession,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),catchasync(user.login))
  //we could set up a route to authenticate local and then a different route to authenticate Google or Twitter.

router.get('/logout',user.logout)

module.exports =router