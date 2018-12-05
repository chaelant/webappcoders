//methods to add:
    //deleteUser(userId)

const mongoCollection = require('../config/mongoCollections');
const users = mongoCollection.users;
const uuid = require('uuid/v4');


let exportedMethods = {

    getAllUsers() {
        return users().then(userCollection => {
            return userCollection.find({}).toArray();
        });
    },

    getUserById(id) {
        return users().then(userCollection => {
            return userCollection.findOne({ _id: id}).then(user => {
                if(!user) throw "User not found";
                return user;
            })
        })
    },

    //takes a user object
    //plaintext password should be hashed before calling this function
    addUser(user) {
        return users().then(userCollection => {
            let newUser = {
                _id: uuid(),
                sessionId: user.sessionId,
                hashedPassword: user.hashedPassword,
                name: user.name,
                image_url: user.image_url
            };

            return userCollection
                .insertOne(newUser)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getUserById(newId);
                })
        })
    }
};

module.exports = exportedMethods;