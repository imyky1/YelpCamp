const mongoose = require('mongoose')
const Review = require('./review')
const { string, required } = require('joi')
const schema = mongoose.Schema

// https://res.cloudinary.com/dyl4cuxnc/image/upload/w_200/v1686653241/YelpCamp/ade8fkhzqwjjz30yntyv.jpg
const imageSchema = new schema({
        url:String,
        filename:String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})
const opts = {toJSON:{virtuals:true}}
const Campgroundschema = new schema({
    title : String,
    image:[imageSchema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true 
        }
    },
    price : Number,
    description : String,
    location : String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    review : [{
        type : schema.Types.ObjectId,
        ref : 'Review'
    }]
},opts)
Campgroundschema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href = "/campground/${this._id}">${this.title}</a></strong>
    <p>₹${this.price}</p>`
})
Campgroundschema.post('findOneAndDelete',async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id : {$in: doc.reviews}
        })
    }
})
module.exports = new mongoose.model('Campground',Campgroundschema)