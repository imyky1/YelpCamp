const Campground=require('../model/campground')
const Review=require('../model/review')
module.exports.postReview = async (req,res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    camp.review.push(review)
    await review.save()
    await camp.save()
    req.flash('success','Successfully created new review')
    res.redirect(`/campground/${camp._id}`)
}
module.exports.deleteReview = async (req,res,next)=>{
    await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewID}})  //pull Is going to take this ID and pull anything with that ID out of reviews.And reviews is just an array of IDs.//So we're pulling that out.
    await Review.findByIdAndDelete(req.params.reviewID)
    req.flash('success','Successfully deleted a review')
    res.redirect(`/campground/${req.params.id}`)
}