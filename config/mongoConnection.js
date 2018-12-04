const MongoClient = require('mongodb').MongoClient; //connection package

const settings = {
    mongoConfig: {
        serverUrl: "mongodb://localhost:27017/WebAppCoders",
        database: "yelp-db"
    }
};

let fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;

let _conn = undefined;

let connect = () => {
    if (!_conn) {
        _conn = MongoClient.connect(fullMongoUrl).then(db => {
            return db;
        });
    }

    return _conn;
};

module.exports = connect;