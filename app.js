if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}/* if we're in development, yes, we are in development then require the
ENV package, which is going to take the variables I've defined in .env file and add them into processed
ENV in my Node app so I can access them in this file or any of my other files. */



const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const session= require('express-session')
const flash = require('connect-flash')//to send flash messages
const methodoverride = require('method-override')//to use put,delete route
const ejsmate = require('ejs-mate')//to make a boilerplate layout
const ExpressError = require('./utils/ExpressError')//error function to send error message
const catchasync = require('./utils/catchasync')//error function to catch error
const passport = require('passport')//allows us to plug in multiple strategies for authentication
const LocalStrategy = require('passport-local')
const multer = require('multer')//helps to parse or handle multipart/formata,which is primarily used for uploading files
const uploads = multer({dest:'uploads/'}) //destination gor files
const MongoDBStore = require('connect-mongo')

const mongosanitize = require('express-mongo-sanitize')//handle security issue
const helmet = require('helmet')

const User = require('./model/user')
const campgroundrouter = require('./routes/campground')
const reviewsrouter = require('./routes/reviews')
const userrouter = require('./routes/user')
// const db_url = process.env.DB_URL
const dbUrl =  'mongodb://127.0.0.1:27017/my-camp'
mongoose.connect(dbUrl)
.then(()=>{
    console.log('mongoose connected')
    // console.log(data)
})
.catch(err=>{
    console.log('mongoose connection error')
    console.log(err)
})

// const db = mongoose.connection
// db.on('error',console.error.bind(console,'connection error:'))
// db.once("open",()=>{
//     console.log('database connected')
// })

app.engine('ejs',ejsmate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))//to read form data
app.use(methodoverride('_method'))
app.use(express.static('public'))//we are telling express to serve public directory having static assets
app.use(mongosanitize())
app.use(helmet({contentSecurityPolicy:false}))

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'squirrel'
    }
});

const sessionconfig = {
    store,
    secret : 'thisisnotagoodsecret',
    resave : false,
    saveUninitialized : true,
    cookie: {
        httpOnly:true,
        // secure:true, it says to run on https only
        expires : Date.now()+ 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}


app.use(session(sessionconfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())// make sure that session is used before passport session.
passport.use(new LocalStrategy(User.authenticate()))/*what we're saying here is that, hello, passports.
We would like you to use the local strategy that we have downloaded and required.And for that local strategy, the authentication method is going to be located on our user model and
it's called authenticate. */
//Authenticate is static methods that have been added in automatically.It generates a function that is used in passports local strategy.
passport.serializeUser(User.serializeUser())//This is telling passports how to serialize a user.And serialization refers to basically how do we get data or how do we store a user in the session?
passport.deserializeUser(User.deserializeUser())//How do you get a user out of that session

app.use((req,res,next)=>{
    // console.log(req.query)
    res.locals.currentuser= req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


// app.get('/fakeuser',async(req,res)=>{
//     const user = new User({email:'yash@gmail.com',username:'imyky1'})
//     console.log(user)
//     const newuser = await User.register(user,'ykyyyy')//Local Mongoose Mongoose Plug in convenience method to register a new user instance with a given password.
//     //it's going to hash that password, store it.
//     res.send(newuser)
// })

app.use('/',userrouter)
app.use('/campground',campgroundrouter)
app.use('/campground/:id/review',reviewsrouter)//we will not have acess to the id in the review routes
app.get('/',(req,res)=>{
    res.render('home')
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {message='Oh Boy! Something went wrong',status=500} = err
    res.status(status).render('campground/error',{err})
})

app.listen('3000',()=>{
    console.log('Listeninng on port 3000')
})