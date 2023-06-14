const express = require('express')
const router = express.Router({mergeParams:true})
/*Routers get separate params and they are separate, but we can actually specify an option here whichis merge params and set that to true.
Now all of the params from over here are also going to be merged alongside the params in this file. */

const catchasync = require('../utils/catchasync')//error function to catch error
const review = require('../controllers/reviews')
const {validatereview,isloggedin,isReviewauthor} = require('../utils/middleware')

router.post('/',isloggedin,validatereview,catchasync(review.postReview))

router.delete('/:reviewID',isloggedin,isReviewauthor,catchasync(review.deleteReview))

module.exports = router