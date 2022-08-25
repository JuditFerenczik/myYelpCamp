const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_150,h_100')
});
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }

    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href=1stQ/campgrounds/${this._id}2ndQ>${this.title}</a></strong><p>${this.description.substring(0, 30)}...</p>`
});
module.exports = mongoose.model('Campground', CampgroundSchema);