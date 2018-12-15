const express = require('express');
const router = express.Router();
const data = require('../data/');
const path = require('path');
const businesses = data.businesses;

router.get('/', async(req, res) => {
    //leverage getBusinessBySearchTerm with req.body to filter for landing page
    try {
        //const localBusinesses = await businesses.getBusinessesBySearchTerm('coffee');
        const allBusinesses = await businesses.getAllBusinesses();
        res.render("homepage", {business: allBusinesses});
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;
