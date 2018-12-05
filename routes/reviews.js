const express = require('express');
const router = express.Router();
const data = require('../data/');
const reviews = data.reviews;

router.get('/', async(req, res) => {
    try {
        //const allReviews = await reviews.getAllReviews();
        //res.json(allReviews);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;