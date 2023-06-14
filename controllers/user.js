const User = require('../model/user')
module.exports.renderRegister = async(req,res)=>{
    res.render('users/register')
}
module.exports.createUser = async(req,res,next)=>{
    try{
    const {Username,Email,Password}= req.body
    const user = new User({email:Email,username:Username})
    const registereduser= await User.register(user,Password)
    req.login(registereduser,err=>{ //req.logout requires a callback function
        if(err) return next(err)
        req.flash('success','Registration Successful')
        res.redirect('/campground')
    })
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}
module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}
module.exports.login =async(req,res)=>{
    req.flash('success','logged in')
    const redirecturl = res.locals.returnto || '/campground'
    res.redirect(redirecturl)
}
module.exports.logout = (req,res)=>{
    req.logOut(err=>{ //req.logout requires a callback function
        if(err){
            return next(err)
        }
        req.flash('error','logged Out')
        res.redirect('/campground')
    })
}