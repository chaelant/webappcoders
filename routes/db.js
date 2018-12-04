const express = require('express');
const router = express.Router();
const data = require('../data/');
const businesses = data.businesses;

router.get('/', async(req, res) => {
    try {
        const allBusinesses = await businesses.getAllBusinesses();
        res.json(allBusinesses);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;