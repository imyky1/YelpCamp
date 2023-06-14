const { number } = require('joi')
const mongoose = require('mongoose')
const schema = mongoose.Schema

const reviewschema = new schema({
    body : String,
    rating : Number,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

module.exports = new mongoose.model('Review',reviewschema)