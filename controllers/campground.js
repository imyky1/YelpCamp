const Campground=require('../model/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken =process.env.MAPBOX_TOKEN
const geocoder =mbxGeocoding({accessToken:mapboxToken})
const {cloudinary} = require('../cloudinary/index')
module.exports.index = async (req,res)=>{
    const camps = await Campground.find({})
    res.render('campground/index',{camps})
}
module.exports.newcamp = (req,res)=>{
    res.render('campground/new')
}
module.exports.creatcamp = async(req,res,next)=>{
    // if(!req.body.campground)throw new ExpressError('Inavlid Campground Data',400)
    const geodata = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send()
    
    const camp = new Campground(req.body.campground)
    camp.geometry = geodata.body.features[0].geometry
    camp.author = req.user._id
    camp.image = req.files.map(f =>({url : f.path,filename:f.filename}))
    await camp.save()
    console.log(camp)
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campground/${camp._id}`)
 }
module.exports.showcamp = async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id).populate({
        path:'review',//populating reviews
        populate:{
            path:'author'//populating author of each review
        }
    }).populate('author')//populating author or each campground
    // console.log(camp)
    if(!camp){
        req.flash('error','Could not find the campground')
        res.redirect('/campground')
    }
    res.render('campground/show',{camp})
}
module.exports.editpage = async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id)
    if(!camp){
        req.flash('error','Could not find the campground')
        return res.redirect('/campground')
    }
    res.render('campground/edit',{camp})
}
module.exports.editcamp = async (req,res)=>{
    console.log(req.body)
    const {id} = req.params;
    const newcamp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const img = req.files.map(f =>({url : f.path,filename:f.filename}))
    newcamp.image.push(...img)
    await newcamp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename)
        }
        await newcamp.updateOne({$pull: {image:{filename:{$in: req.body.deleteImages}}}})
        console.log(newcamp)
    }
    req.flash('success','Successfully updated a campground')
    res.redirect(`/campground/${newcamp._id}`)
}
module.exports.deleltecamp = async(req,res)=>{

    const {id} = req.params;
    await Campground.findByIdAndDelete(id,{...req.body.campground})
    req.flash('success','Successfully deleted a campground')
    res.redirect('/campground')
}