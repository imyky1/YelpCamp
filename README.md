# YelpCamp
This project is a full stack website from a course called Web Developer Bootcamp by Colt Steele.
![Screenshot (184)](https://github.com/imyky1/YelpCamp/assets/109689075/d7ce1698-e4f6-498b-9d92-b2c58fed3575)

YelpCamp is essentially a website that allows users to discover and review campgrounds.
Users can create accounts, browse existing campgrounds, leave reviews, and add new campgrounds to the platform
# Features
## Authentication
> Users can sign up or login using username and password.

> User can not submit campgrounds if they are not logged in.
## Authorization
> User can only modify campgrounds created by them.
## User Profile
> Every registered user has profile where all his submitted campgrounds are shown.
## Basic Functionality
> Add Name, Image and Description to the campground.

> Create, Update, Delete the Campground.

> Add comments to campgrounds.

> Flash Important messages to warn or greet the users.

> Responsive Web design.

>   Interactive Maps

> Image Upload

![Screenshot (185)](https://github.com/imyky1/YelpCamp/assets/109689075/e9d1bc1c-9354-41f6-9bbf-873358c0b76a)
![Screenshot (186)](https://github.com/imyky1/YelpCamp/assets/109689075/465d4dfa-1b9b-48fd-8aac-090d76b30a82)

# Run it Locally
1. install Mongodb
2. Create Cloudinary account to get an api key and secret code
3. Create an account on mapbox to get mapbox token

```
git clone https://github.com/imyky1/YelpCamp.git
cd yelpcamp
npm install
```
Create a .env file (or just export manually in the terminal) in the root of the project and add the following:
```
CLOUDINARY_NAME=name
CLOUDINARY_KEY=key
CLOUDINARY_SECRET=secret
MAPBOX_TOKEN= mapbox token
```
Run mongod in another terminal and node app.js in the terminal with the project.

Then Go to http://localhost:3000/


