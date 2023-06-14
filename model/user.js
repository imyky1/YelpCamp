const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
// const passport = require('passport')

const Userschema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : [true,'Email already in use'] 
    }
})
Userschema.plugin(passportLocalMongoose)/*this is going to add on to our schema a username, it's going to add on a field for password.
It's going to make sure those usernames are unique, they're not duplicated.It's also going to give us some additional methods that we can use. */
module.exports = mongoose.model('User',Userschema)