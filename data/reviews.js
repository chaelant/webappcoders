//methods to add:
    //deleteReview(reviewId)

const mongoCollection = require('../config/mongoCollections');
const reviews = mongoCollection.reviews;
const uuid = require('uuid/v4');

let exportedMethods = {

    getAllReviews() {
        return reviews().then(reviewCollection => {
            return reviewCollection.find({}).toArray();
        })
    },

    getReviewById(reviewId) {
        return reviews().then(reviewCollection => {
            return reviewCollection.findOne({_id: reviewId}).then( review => {
                if(!review) throw "Review not found";
                return review;
            })
        })
    },

    getReviewsByUserId(userId) {
        return reviews().then(reviewCollection => {
            return reviewCollection.find({userId: userId}).toArray();
        });
    },

    getReviewsByBusiness(businessId) {
        return reviews().then(reviewCollection => {
            return reviewCollection.find({business: businessId}).toArray();
        });
    },

    //takes a business object, a user object, and a review object
    addReview(business, user, review) {
        return reviews().then(reviewCollection => {

            const now = new Date();

            let newReview = {
                _id: uuid(),
                userId: user._id,
                title: review.title,
                text: review.text,
                rating: review.rating,
                time_created: now,
                business: business._id,
                image_url: review.image_url
            };

            return reviewCollection
                .insertOne(newReview)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getReviewById(newId);
                });

        });
    }
};

module.exports = exportedMethods;
