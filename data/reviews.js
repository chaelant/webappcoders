//methods to add:
//deleteReview(reviewId)

const mongoCollection = require('../config/mongoCollections');
const reviews = mongoCollection.reviews;
const uuid = require('uuid/v4');

let exportedMethods = {

    createIndex() {
        return reviews().then(reviewCollection => {
            reviewCollection.createIndex({'$**': 'text'})
        })
    },

    getReviewsBySearchTerm(searchTerm) {
        return reviews().then(reviewCollection => {
            return reviewCollection.find({$text: {$search: searchTerm}}).toArray();
        })
    },

    getAllReviews() {
        return reviews().then(reviewCollection => {
            return reviewCollection.find({}).toArray();
        })
    },

    getReviewById(reviewId) {
        return reviews().then(reviewCollection => {
            return reviewCollection.findOne({ _id: reviewId }).then(review => {
                if (!review) throw "Review not found";
                return review;
            })
        })
    },

    getReviewsByUserId(userId) {
        return reviews().then(reviewCollection => {
            return reviewCollection.find({ userId: userId }).toArray();
        });
    },

    getReviewsByBusiness(businessId) {
        return reviews().then(reviewCollection => {
            return reviewCollection.find({ business: businessId }).toArray();
        });
    },

    //takes a review object
    addReviewSeed(review) {
        return reviews().then(reviewCollection => {
            return reviewCollection
                .insertOne(review)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getReviewById(newId);
                });

        });
    },

    deleteReview(id) {
        return reviews().then(reviewCollection => {
            return reviewCollection.removeOne({ _id: id }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete review with id of ${id}`;
                } else {

                }
            });
        });
    },

    addReview(userid, title, text, rating, timecreated, businessId, imageurl) {
        return reviews().then(reviewCollection => {

            let newReview = {
                _id: uuid(),
                userId: userid,
                title: title,
                text: text,
                rating: rating,
                time_created: timecreated,
                business: businessId,
                image_url: imageurl
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
