
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    //useCreateIndex= true not supported
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '630472629f0cf6920c8b451f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dx02bn4ab/image/upload/v1661247678/YelpCamp/uvw9q5a7pxieopw7exkr.jpg',
                    filename: 'YelpCamp/uvw9q5a7pxieopw7exkr'
                },
                {
                    url: 'https://res.cloudinary.com/dx02bn4ab/image/upload/v1661247678/YelpCamp/gu0w6je2xxxbp7r9c3ws.jpg',
                    filename: 'YelpCamp/gu0w6je2xxxbp7r9c3ws'
                }
            ]

        })
        await camp.save();

    }

}

seedDB().then(() => {
    mongoose.connection.close();
})
