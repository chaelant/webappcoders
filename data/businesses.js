//methods to add:
    //deleteBusiness(businessId)
const mongoCollection = require('../config/mongoCollections');
const businesses = mongoCollection.businesses;
const reviews = require('./reviews');
const uuid = require('uuid/v4');


let exportedMethods = {

    createIndex() {
        return businesses().then(businessCollection => {
            businessCollection.createIndex({'$**': 'text'})
        })
    },

    getBusinessesBySearchTerm(searchTerm) {
      return businesses().then(businessCollection => {
          return businessCollection.find({$text: {$search: searchTerm}}).toArray();
      })
    },

    getAllBusinesses() {
        return businesses().then(businessCollection => {
            return businessCollection.find({}).toArray();
        });
    },

    getBusinessById(id) {
        return businesses().then(businessCollection => {
            return businessCollection.findOne({ _id: id }).then(business => {
                if (!business) throw "Business not found";
                return business;
            })
        })
    },

    getBusinessByAlias(alias) {
        return businesses().then(businessCollection => {
            return businessCollection.findOne({alias: alias}).then(business => {
                if (!business) return false;
                return business;
            })
        })
    },

    //takes a business object
    addBusiness(business) {
        return businesses().then(businessCollection => {
            let newBusiness = {
                _id: uuid(), //repeatedly got duplicate key errors. will ensure that this matches in the review's businessId
                rating: 0.0, //this gets updated with each added review
                price: business.price,
                phone: business.phone,
                alias: business.alias,
                is_closed: business.is_closed,
                categories: business.categories,
                review_count: 0, //this gets updated with each added review
                name: business.name,
                coordinates: business.coordinates,
                image_url: business.image_url,
                location: business.location,
                transactions: business.transactions,
                distance: business.distance //dependent on user location
            };

            return businessCollection
                .insertOne(newBusiness)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getBusinessById(newId);
                });
        });
    },

    updateReviewCount(id, reviewCount) {
        return businesses().then(businessCollection => {
            return businessCollection.updateOne({_id: id}, {$set: {review_count: reviewCount}}).then(updateInfo => {
                if (updateInfo.modifiedCount === 0) {
                    throw `Could not update review count of business with id of ${id}`;
                } else {
                    return this.getBusinessById(id);
                }
            })
        })
    },

    updateAverageRating(businessId) {
        return reviews.getReviewsByBusiness(businessId).then(reviewList => {
            var cumulativeRating = 0;
            for (let r in reviewList) {

                if (typeof reviewList[r].rating === 'string') {
                    let rated = Number.parseFloat(reviewList[r].rating).toFixed(1);
                    cumulativeRating = cumulativeRating + rated;
                } else {
                    let rated = reviewList[r].rating;
                    cumulativeRating = cumulativeRating + rated;
                }

            }
            if (cumulativeRating <= 0) {
                return 0
            } else {
                return Number.parseFloat(cumulativeRating / reviewList.length).toFixed(1);
            }

        }).then(newAverage => {
            return businesses().then(businessCollection => {
                businessCollection.updateOne({_id: businessId}, {$set: {rating: newAverage}}).then(updateInfo => {
                    if (updateInfo.modifiedCount === 0){
                        throw `Could not update rating of business with id of ${businessId}`;
                    } else {
                        return newAverage;
                    }
                })
            })
        })
    },

    deleteBusiness(id) {
        return businesses().then(businessCollection => {
            return businessCollection.removeOne({_id: id}).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete business with id of ${id}`;
                } else {

                }
            });
        });
    }
};

module.exports = exportedMethods;