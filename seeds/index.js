const mongoose = require('mongoose')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')

const Campground=require('../model/campground')

mongoose.connect('mongodb://127.0.0.1:27017/my-camp')
.then(()=>{
    console.log('mongoose connected')
    // console.log(data)
})
.catch(err=>{
    console.log('mongoose connection error')
    console.log(err)
})
const sample = array => array[Math.floor(Math.random()*array.length)]

const seeddb = async()=>{
    await Campground.deleteMany({})
    for (let i = 0; i<50 ; i++){
        const rand1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*10000)
        const camp = new Campground({
            //ypur user id
            author : '64871392d72f111e614fbbc8',
            location : `${cities[rand1000].city},${cities[rand1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente assumenda a, ab tempore, tenetur aliquam consectetur ducimus consequuntur deserunt at excepturi qui? Maxime, minus laborum ullam iure consequuntur temporibus veniam.',
            price,
            geometry: { type: 'Point', coordinates: [ cities[rand1000].longitude,cities[rand1000].latitude ] },
            image:[
                {
                  url: 'https://res.cloudinary.com/dyl4cuxnc/image/upload/v1686651988/YelpCamp/fo1fr9fjdynjkq4g4gvj.jpg',
                  filename: 'YelpCamp/fo1fr9fjdynjkq4g4gvj',
                },
                {
                  url: 'https://res.cloudinary.com/dyl4cuxnc/image/upload/v1686652017/YelpCamp/xa6nnhgwx4u2fnqlj9dc.jpg',
                  filename: 'YelpCamp/xa6nnhgwx4u2fnqlj9dc',
                }
              ]
        })
        await camp.save()
    }
}
seeddb().then(()=>{
    mongoose.connection.close()
})