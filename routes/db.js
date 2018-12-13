const express = require('express');
const router = express.Router();
const data = require('../data/');
const path = require('path');
const businesses = data.businesses;

router.get('/', async(req, res) => {
    try {
        res.sendFile(path.resolve('index.html'))
        //const allBusinesses = await businesses.getAllBusinesses();
        //res.json(allBusinesses);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;