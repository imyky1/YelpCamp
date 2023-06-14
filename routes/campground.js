const express = require('express')
const router = express.Router()
const catchasync = require('../utils/catchasync')//error function to catch error
const Campground=require('../model/campground')
const multer = require('multer')
const{storage} = require('../cloudinary/index')
const upload = multer({storage})

const {isloggedin,validatecamp,isauthor}=require('../utils/middleware')
const campground = require('../controllers/campground')

router.route('/')
  .get(catchasync(campground.index))
  // .post(upload.array('image'),(req,res)=>{
  //   console.log(req.body,req.files)
  //   res.send('it worked')
  // })
  .post(isloggedin,upload.array('image'),validatecamp, catchasync(campground.creatcamp))

router.get('/new',isloggedin,catchasync(campground.newcamp))

router.route('/:id')
  .get( catchasync(campground.showcamp))
  .put(isloggedin,isauthor,upload.array('image'),validatecamp, catchasync(campground.editcamp))
  .delete(isloggedin,isauthor, catchasync(campground.deleltecamp))

router.get('/:id/edit',isloggedin,isauthor,catchasync(campground.editpage))


module.exports = router