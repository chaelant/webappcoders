const MongoClient = require('mongodb').MongoClient;
const settings = require('./config');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt'); //this may not need to be here (probably shouldn't)
const saltRounds = 16;

async function main() {
    const connection = await MongoClient.connect(settings.mongoConfig.serverUrl, {useNewUrlParser: true});
    const db = await connection.db(settings.mongoConfig.database);

    //drop the databases for now so that we're not adding over and over. can remove later on.
    try {
        await db.collection('businesses').drop();
        await db.collection('reviews').drop();
        await db.collection('users').drop();
    } catch (e) {

    }

    const businessCollection = db.collection('businesses');
    const reviewCollection = db.collection('reviews');
    const userCollection = db.collection('users');

    exports.getAllBusinesses = async () => {
        return await businessCollection.find().toArray();
    };

    exports.getAllReviews = async () => {
        return await reviewCollection.find().toArray();
    };

    exports.getAllUsers = async () => {
        return await userCollection.find().toArray();
    };

    //adds business
    exports.addBusiness = async (price, phone, is_closed, categories, name, coordinates, image_url, location, transactions) => {
        const identifier = uuid();
        const newBusiness = {
            _id: identifier,
            rating: 0, //this gets updated with each added review, init at 0
            price: price,
            phone: phone,
            alias: name, //needs to be name + location with hyphens
            is_closed: is_closed,
            categories: categories,
            review_count: 0, //this gets updated with each added review
            name: name,
            coordinates: coordinates,
            image_url: image_url,
            location: location,
            transactions: transactions,
            distance: 0 //this needs to be calculated
        };

        const addingBusiness = await businessCollection.insertOne(newBusiness);
        const addedId = await addingBusiness.insertedId;
        return await businessCollection.findOne({_id: addedId});
    };

    //adds review
    exports.addReview = async (username, title, text, rating, business, image_url) => {
        const identifier = uuid();

        //gets business ID to reference in document
        const businessDoc = await businessCollection.findOne({name: business});
        const business_id = businessDoc._id;

        //gets ID of review writer to reference in document
        const userDoc = await userCollection.findOne({username: username});
        const userId = userDoc._id;

        //when the review was written
        const now = new Date();

        const newReview = {
            _id: identifier,
            userId: userId,
            title: title,
            text: text,
            rating: rating,
            time_created: now,
            business: business_id,
            image_url: image_url
        };

        const addingReview = await reviewCollection.insertOne(newReview);
        const addedId = await addingReview.insertedId;

        //update review_count of business
        let reviewCount = businessDoc.review_count;
        reviewCount++;
        await businessCollection.updateOne({_id: business_id}, {$set: {'review_count': reviewCount}});

        return await reviewCollection.findOne({_id: addedId});
    };

    //adds user
    exports.addUser = async (plainpwd, username, image_url) => {
        const identifier = uuid();
        const hashedPassword = await bcrypt.hash(plainpwd, saltRounds); //should add hashed password, not plaintext password
        const newUser = {
            _id: identifier,
            hashedPassword: hashedPassword,
            username: username,
            image_url: image_url
        };

        const addingUser = await userCollection.insertOne(newUser);
        const addedId = await addingUser.insertedId;
        return await userCollection.findOne({_id: addedId});
    };

    exports = module.exports;
}

main().catch(error => {
    console.log(error);
});
