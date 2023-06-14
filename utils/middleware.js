const {campschema} = require('../schema')//to validate schema(server side validation)
const {reviewSchema} = require('../schema')//to validate schema(server side validation)
const ExpressError = require('./ExpressError')//error function to send error message
const Campground=require('../model/campground')
const Review = require('../model/review')
//middle-ware function to check if the user is logged in
module.exports.isloggedin = (req,res,next)=>{
    // console.log('req.user=',req.user)
    req.session.returnto =req.originalUrl
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in')
        return res.redirect('/login')
    }
    next()
}
//middle-ware function to store the current path in res.locals so that we can return agter logging in
module.exports.storesession = (req,res,next)=>{
    if(req.session.returnto){
        res.locals.returnto = req.session.returnto
    }
    next()
}
//middle-ware function for server side schema validation
module.exports.validatecamp = (req,res,next)=>{
    const {error} = campschema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}
//middle-ware function to check if the camp is of given user
module.exports.isauthor = async(req,res,next)=>{
    const{id} = req.params
    const camp = await Campground.findById(id)
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campground/${camp._id}`)
    }
    next()
}
//middle-ware function to check if the review is of given user
module.exports.isReviewauthor = async(req,res,next)=>{
    const{id,reviewID} = req.params
    const review = await Review.findById(reviewID)
    const camp = await Campground.findById(id)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campground/${camp._id}`)
    }
    next()
}
//middle-ware function for server side schema validation
module.exports.validatereview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}