const mongoCollection = require('../config/mongoCollections');
const users = mongoCollection.users;
const uuid = require('uuid/v4');
const bcrypt = require("bcryptjs");
const saltRounds = 16;

let exportedMethods = {

    createIndex() {
        return users().then(userCollection => {
            userCollection.createIndex({'$**': 'text'});
        })
    },

    getUsersBySearchTerm(searchTerm) {
        return users().then(userCollection => {
            return userCollection.find({$text: {$search: searchTerm}}).toArray();
        })
    },

    async addUser(Password, username, name) {

           const newUser = {
            _id: uuid(),
            sessionId: [],
            hashedPassword: Password,
            name: name,
            username: username,
            favorites: []
           };

           const userCollection = await users();
           const newInsertInformation = await userCollection.insertOne(newUser);
           const newId = newInsertInformation.insertedId;
           return await this.getSelectedUserById(newId);
    },

    async checkIfValidUser(username, password) {
        var newusers = await this.getAllUsers();
        for (const element of newusers) {
            if (username === element.username) {
                let compareToMerlin = false;
                try {
                    compareToMerlin = await bcrypt.compare(password, element.hashedPassword);
                    if (compareToMerlin) return element;
                } catch (e) {

                }
            }
        }
        return null;
    },

    getAllUsers() {
        return users().then(userCollection => {
            return userCollection.find({}).toArray();
        });
    },

    async getSelectedUserById(id) {
        return users().then(userCollection => {
            return userCollection.findOne({ _id: id }).then(user => {
                if (!user) throw "User not found";
                return user;
            });
        });
    },

    deleteUser(id) {
        return users().then(userCollection => {
            return userCollection.removeOne({ _id: id }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete user with id of ${id}`
                } else {

                }
            });
        });
    },

    addFavoriteBusiness(businessId, userId) {
        return users().then(userCollection => {
            return userCollection.updateOne({_id: userId}, {$push: {favorites: businessId}}).then(updatedUser => {
                if (updatedUser.modifiedCount === 0) {
                    throw `Could not add favorite to user with id of ${userId}`;
                } else {
                    return true;
                }
            })
        })
    },

    getFavoriteBusinesses(userId) {
        return users().then(userCollection => {
            return userCollection.findOne({_id: userId}).then(foundUser => {
                if (!foundUser) {
                    throw `No user with id of ${userId}`;
                } else {
                    return foundUser.favorites;
                }
            })
        })
    }
};

module.exports = exportedMethods;