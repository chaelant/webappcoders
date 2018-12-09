//methods to add:
    //deleteUser(userId)

const mongoCollection = require('../config/mongoCollections');
const users = mongoCollection.users;
const uuid = require('uuid/v4');
const bcrypt = require("bcrypt");
const saltRounds = 16;

let exportedMethods = {
   async addUser(Password, username, name, image_url) {
        
        users().then(userCollection => {
            // let newUser = {
            //     _id: uuid(),
            //     sessionId: uuid(),
            //     hashedPassword: Password,
            //     name: name,
            //     username: username,
            //     image_url: image_url
            // };

            // const newDoc = await userCollection.insertOne(newUser);
            // let addedUser = this.getUserById(newDoc.insertedId);
            // return addedUser;

             userCollection
                .insertOne({
                    _id: uuid(),
                    sessionId: uuid(),
                    hashedPassword: Password,
                    name: name,
                    username: username,
                    image_url: image_url})
                .then(function (newDoc) {
                    return newDoc.insertedId;
                })
                .then(function (newId) {
                    let newUser = exportedMethods.getSelectedUserById(newId);
                    return newUser;
                });
        })
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
            })
        })
    }
};

module.exports = exportedMethods;