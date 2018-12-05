//methods to add:
    //deleteBusiness(businessId)
const mongoCollection = require('../config/mongoCollections');
const businesses = mongoCollection.businesses;
const uuid = require('uuid/v4');


let exportedMethods = {

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

    //takes a business object
    addBusiness(business) {
        return businesses().then(businessCollection => {
            let newBusiness = {
                _id: uuid(), //repeatedly got duplicate key errors. will ensure that this matches in the review's businessId
                rating: business.rating, //this gets updated with each added review
                price: business.price,
                phone: business.phone,
                alias: business.alias,
                is_closed: business.is_closed,
                categories: business.categories,
                review_count: business.review_count, //this gets updated with each added review
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
    }
};

module.exports = exportedMethods;