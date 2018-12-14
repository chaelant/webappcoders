//methods to add:
    //deleteUser(userId)

const mongoCollection = require('../config/mongoCollections');
const users = mongoCollection.users;
const uuid = require('uuid/v4');
const bcrypt = require("bcryptjs");
const saltRounds = 16;

let exportedMethods = {

    createIndex() {
        return users().then(userCollection => {
            userCollection.createIndex({name: 'text', username: 'text'});
        })
    },

    async addUser(Password, username, name) {
       // users().then(userCollection => {

           const newUser = {
            _id: uuid(),
            sessionId: uuid(),
            hashedPassword: Password,
            name: name,
            username: username
           };

           const userCollection = await users();
           const newInsertInformation = await userCollection.insertOne(newUser);
           const newId = newInsertInformation.insertedId;
           return await this.getSelectedUserById(newId);

            // return userCollection
            //     .insertOne({newUser})
            //     .then(function (newDoc) {
            //         return newDoc.insertedId;
            //     })
            //     .then(function (newId) {
            //         let newUser = exportedMethods.getSelectedUserById(newId);
            //         return newUser;
            //     });
        //})
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
    }
};

module.exports = exportedMethods;